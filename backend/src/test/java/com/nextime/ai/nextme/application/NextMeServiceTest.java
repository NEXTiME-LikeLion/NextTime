package com.nextime.ai.nextme.application;

import com.nextime.ai.nextme.api.NextMeGenerateRequest;
import com.nextime.ai.nextme.client.NextMeAiClient;
import com.nextime.ai.nextme.client.NextMeClientResult;
import com.nextime.ai.nextme.client.NextMePromptInput;
import com.nextime.ai.nextme.domain.ChangeReason;
import com.nextime.ai.nextme.domain.GenerationSource;
import com.nextime.ai.nextme.domain.NextMeGeneration;
import com.nextime.ai.nextme.domain.NextMeGenerationRepository;
import com.nextime.ai.nextme.domain.NextBudTheme;
import com.nextime.common.error.BusinessException;
import com.nextime.common.error.ErrorCode;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import com.nextime.user.domain.UserProfileRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NextMeServiceTest {

    private static final UUID USER_ID = UUID.fromString("30000000-0000-0000-0000-000000000001");

    @Mock
    private NextMeAiClient aiClient;
    @Mock
    private NextMeGenerationRepository generationRepository;
    @Mock
    private UserProfileRepository userProfileRepository;
    @InjectMocks
    private NextMeService service;

    @Test
    void generatesAiCardFields() {
        when(aiClient.generate(any(NextMePromptInput.class)))
                .thenReturn(NextMeClientResult.ai(
                        "건강하고 자유로운 나",
                        "숨이 차서 시작한 변화",
                        "오늘의 선택을 기억하자.",
                        NextBudTheme.NEXTBUD_HEALTH_01
                ));
        when(generationRepository.save(any(NextMeGeneration.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        NextMeGeneration result = service.generate(USER_ID, validRequest());

        assertThat(result.getHeadline()).isEqualTo("건강하고 자유로운 나");
        assertThat(result.getStartReason()).isEqualTo("숨이 차서 시작한 변화");
        assertThat(result.getNextBudTheme()).isEqualTo(NextBudTheme.NEXTBUD_HEALTH_01);
        assertThat(result.getSource()).isEqualTo(GenerationSource.AI);
        ArgumentCaptor<NextMePromptInput> input = ArgumentCaptor.forClass(NextMePromptInput.class);
        verify(aiClient).generate(input.capture());
        assertThat(input.getValue().changeReasons()).containsExactly("체력·건강", "자유");
    }

    @Test
    void usesFallbackWhenAiThemeDoesNotMatchSelectedReasons() {
        when(aiClient.generate(any(NextMePromptInput.class)))
                .thenReturn(NextMeClientResult.ai(
                        "건강하고 자유로운 나",
                        "숨이 차서 시작한 변화",
                        "오늘의 선택을 기억하자.",
                        NextBudTheme.NEXTBUD_ECONOMY_01
                ));
        when(generationRepository.save(any(NextMeGeneration.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        NextMeGeneration result = service.generate(USER_ID, validRequest());

        assertThat(result.getSource()).isEqualTo(GenerationSource.FALLBACK);
        assertThat(result.getNextBudTheme()).isEqualTo(NextBudTheme.NEXTBUD_HEALTH_01);
    }

    @Test
    void truncatesCardText() {
        when(aiClient.generate(any(NextMePromptInput.class)))
                .thenReturn(NextMeClientResult.ai(
                        "건강하고 자유로운 일상을 오랫동안 꾸준하게 살아가는 미래의 나",
                        "계단을 오를 때 숨이 차서 변화를 시작해야겠다고 느낀 순간",
                        "오늘의 선택을 기억하자.",
                        NextBudTheme.NEXTBUD_HEALTH_01
                ));
        when(generationRepository.save(any(NextMeGeneration.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        NextMeGeneration result = service.generate(USER_ID, validRequest());

        assertThat(result.getSource()).isEqualTo(GenerationSource.AI);
        assertThat(result.getHeadline().codePointCount(0, result.getHeadline().length())).isLessThanOrEqualTo(36);
        assertThat(result.getStartReason().codePointCount(0, result.getStartReason().length())).isLessThanOrEqualTo(24);
    }

    @Test
    void regeneratesGoalFieldsAndThemeFromAiResult() {
        NextMeGeneration current = new NextMeGeneration(
                USER_ID,
                List.of(ChangeReason.HEALTH_FITNESS),
                null,
                "기존 동기",
                "기존 미래 모습",
                "기존 메시지",
                "기존 NEXT ME",
                "기존 동기",
                NextBudTheme.NEXTBUD_HEALTH_01,
                GenerationSource.AI
        );
        when(aiClient.generate(any(NextMePromptInput.class)))
                .thenReturn(NextMeClientResult.ai(
                        "비용 걱정 없이 여유로운 나",
                        "생활비를 아끼고 싶어요.",
                        "담배 대신 나를 위해 저축하자.",
                        NextBudTheme.NEXTBUD_HEALTH_01
                ));
        when(generationRepository.save(any(NextMeGeneration.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        NextMeGeneration result = service.regenerateGoal(
                USER_ID,
                com.nextime.user.domain.OnboardingGoal.QUIT,
                current,
                "돈이 없어서 담뱃값을 아끼고 싶은 나",
                "담뱃값이 아까워요.",
                "저축을 시작하자.",
                List.of("nextMe")
        );

        assertThat(result.getFutureSelf()).isEqualTo("비용 걱정 없이 여유로운 나");
        assertThat(result.getDecisionTrigger()).isEqualTo("생활비를 아끼고 싶어요.");
        assertThat(result.getMessageToFutureSelf()).isEqualTo("담배 대신 나를 위해 저축하자.");
        assertThat(result.getNextBudTheme()).isEqualTo(NextBudTheme.NEXTBUD_ECONOMY_01);
        assertThat(result.getSource()).isEqualTo(GenerationSource.AI);
        ArgumentCaptor<NextMePromptInput> input = ArgumentCaptor.forClass(NextMePromptInput.class);
        verify(aiClient).generate(input.capture());
        assertThat(input.getValue().updatedFields()).containsExactly("nextMe");
    }

    @Test
    void rejectsDuplicateReasons() {
        NextMeGenerateRequest request = request(
                List.of(ChangeReason.COST, ChangeReason.COST),
                null
        );

        BusinessException exception = assertThrows(
                BusinessException.class,
                () -> service.generate(USER_ID, request)
        );

        assertThat(exception.errorCode()).isEqualTo(ErrorCode.INVALID_REQUEST);
        verify(aiClient, never()).generate(any());
    }

    @Test
    void rejectsOtherCombinedWithPresetReason() {
        NextMeGenerateRequest request = request(
                List.of(ChangeReason.OTHER, ChangeReason.COST),
                "직접 적은 이유"
        );

        BusinessException exception = assertThrows(
                BusinessException.class,
                () -> service.generate(USER_ID, request)
        );

        assertThat(exception.errorCode()).isEqualTo(ErrorCode.INVALID_REQUEST);
    }

    @Test
    void latestGenerationMustExist() {
        when(generationRepository.findFirstByUserIdOrderByCreatedAtDesc(USER_ID))
                .thenReturn(Optional.empty());

        BusinessException exception = assertThrows(
                BusinessException.class,
                () -> service.getLatest(USER_ID)
        );

        assertThat(exception.errorCode()).isEqualTo(ErrorCode.NEXT_ME_NOT_FOUND);
    }

    private NextMeGenerateRequest validRequest() {
        return request(List.of(ChangeReason.HEALTH_FITNESS, ChangeReason.FREEDOM), null);
    }

    private NextMeGenerateRequest request(List<ChangeReason> reasons, String customReason) {
        return new NextMeGenerateRequest(
                reasons,
                customReason,
                "계단을 오를 때 숨이 찼어요.",
                "건강하고 자유롭게 생활하는 사람",
                "오늘의 선택을 기억하자."
        );
    }
}
