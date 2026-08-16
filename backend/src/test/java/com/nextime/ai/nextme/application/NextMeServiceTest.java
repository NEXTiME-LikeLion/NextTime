package com.nextime.ai.nextme.application;

import com.nextime.ai.nextme.api.NextMeGenerateRequest;
import com.nextime.ai.nextme.client.NextMeAiClient;
import com.nextime.ai.nextme.client.NextMeClientResult;
import com.nextime.ai.nextme.client.NextMePromptInput;
import com.nextime.ai.nextme.domain.ChangeReason;
import com.nextime.ai.nextme.domain.GenerationSource;
import com.nextime.ai.nextme.domain.NextMeGeneration;
import com.nextime.ai.nextme.domain.NextMeGenerationRepository;
import com.nextime.common.error.BusinessException;
import com.nextime.common.error.ErrorCode;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

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
    @InjectMocks
    private NextMeService service;

    @Test
    void generatesOneAiMessageEndingWithRequiredPhrase() {
        when(aiClient.generate(any(NextMePromptInput.class)))
                .thenReturn(NextMeClientResult.ai("건강한 일상을 스스로 선택하는 나"));
        when(generationRepository.save(any(NextMeGeneration.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        NextMeGeneration result = service.generate(USER_ID, validRequest());

        assertThat(result.getGeneratedMessage()).isEqualTo("건강한 일상을 스스로 선택하는 나");
        assertThat(result.getSource()).isEqualTo(GenerationSource.AI);
        ArgumentCaptor<NextMePromptInput> input = ArgumentCaptor.forClass(NextMePromptInput.class);
        verify(aiClient).generate(input.capture());
        assertThat(input.getValue().changeReasons()).containsExactly("체력·건강", "자유");
    }

    @Test
    void usesFallbackWhenAiMessageHasWrongEnding() {
        when(aiClient.generate(any(NextMePromptInput.class)))
                .thenReturn(NextMeClientResult.ai("건강한 미래를 만들겠습니다."));
        when(generationRepository.save(any(NextMeGeneration.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        NextMeGeneration result = service.generate(USER_ID, validRequest());

        assertThat(result.getGeneratedMessage()).endsWith("는 나");
        assertThat(result.getSource()).isEqualTo(GenerationSource.FALLBACK);
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
