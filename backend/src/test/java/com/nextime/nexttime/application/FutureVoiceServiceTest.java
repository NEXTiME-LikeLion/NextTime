package com.nextime.nexttime.application;

import com.nextime.ai.futurevoice.client.FutureVoiceAiClient;
import com.nextime.ai.futurevoice.client.FutureVoiceClientResult;
import com.nextime.ai.futurevoice.client.FutureVoicePromptInput;
import com.nextime.ai.nextme.domain.NextMeGeneration;
import com.nextime.ai.nextme.domain.NextMeGenerationRepository;
import com.nextime.common.error.BusinessException;
import com.nextime.nexttime.domain.FutureVoiceSource;
import com.nextime.nexttime.domain.NextTimeSession;
import com.nextime.nexttime.domain.NextTimeSessionRepository;
import com.nextime.smokingcontext.domain.SmokingContext;
import com.nextime.smokingcontext.domain.SmokingContextType;
import com.nextime.user.domain.OnboardingGoal;
import com.nextime.user.domain.User;
import com.nextime.user.domain.UserProfile;
import com.nextime.user.domain.UserProfileRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import static com.nextime.nexttime.domain.CravingBefore.HIGH;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FutureVoiceServiceTest {

    private static final UUID USER_ID = UUID.fromString("30000000-0000-0000-0000-000000000001");
    private static final UUID SESSION_ID = UUID.fromString("40000000-0000-0000-0000-000000000001");

    @Mock
    private NextTimeSessionRepository sessionRepository;
    @Mock
    private UserProfileRepository profileRepository;
    @Mock
    private NextMeGenerationRepository generationRepository;
    @Mock
    private FutureVoiceAiClient aiClient;

    private FutureVoiceService service;

    @BeforeEach
    void setUp() {
        service = new FutureVoiceService(
                new FutureVoicePersistenceService(
                        sessionRepository,
                        profileRepository,
                        generationRepository
                ),
                aiClient
        );
    }

    @Test
    void generatesFutureVoiceFromSavedContextAndNextMe() {
        NextTimeSession session = contextSavedSession();
        stubInputs(session);
        when(aiClient.generate(any())).thenReturn(FutureVoiceClientResult.ai(
                "나 오늘 저녁에도 달릴 거잖아",
                "지금 한 대가 너무 당기는 거 알아",
                "몇 시간 뒤의 나는 숨이 차서 멈추고 싶지 않아.",
                "이번 한 번만, 나를 먼저 선택해줘"
        ));

        var response = service.generate(USER_ID, SESSION_ID);

        assertThat(response.source()).isEqualTo(FutureVoiceSource.AI);
        assertThat(response.futureHook()).contains("달릴 거잖아");
        assertThat(response.generatedAt()).isNotNull();
        ArgumentCaptor<FutureVoicePromptInput> captor = ArgumentCaptor.forClass(FutureVoicePromptInput.class);
        verify(aiClient).generate(captor.capture());
        assertThat(captor.getValue().craving()).isEqualTo("당장 피우고 싶음");
        assertThat(captor.getValue().location()).isEqualTo("집");
        assertThat(captor.getValue().trigger()).isEqualTo("밥을 먹고 나서");
        assertThat(captor.getValue().goal()).isEqualTo("완전히 끊고 싶어요");
    }

    @Test
    void keepsFallbackWhenAiFails() {
        NextTimeSession session = contextSavedSession();
        stubInputs(session);
        when(aiClient.generate(any())).thenThrow(new IllegalStateException("timeout"));

        var response = service.generate(USER_ID, SESSION_ID);

        assertThat(response.source()).isEqualTo(FutureVoiceSource.FALLBACK);
        assertThat(response.futureHook()).isEqualTo("러닝할 때 숨이 차서 먼저 멈추지 않는 나");
        assertThat(response.acknowledge()).contains("당장 한 대");
        assertThat(response.futureReason()).isEqualTo("이번에는 나한테 3분만 먼저 줘.");
    }

    @Test
    void repeatedRequestReturnsSavedVoiceWithoutCallingAiAgain() {
        NextTimeSession session = contextSavedSession();
        stubInputs(session);
        when(aiClient.generate(any())).thenReturn(FutureVoiceClientResult.fallback());

        var first = service.generate(USER_ID, SESSION_ID);
        var second = service.generate(USER_ID, SESSION_ID);

        assertThat(second.generatedAt()).isEqualTo(first.generatedAt());
        verify(aiClient).generate(any());
    }

    @Test
    void rejectsBeforeContextIsSaved() {
        NextTimeSession session = new NextTimeSession(mock(User.class));
        when(sessionRepository.findWithRecommendationByIdAndUser_Id(SESSION_ID, USER_ID))
                .thenReturn(Optional.of(session));

        assertThatThrownBy(() -> service.generate(USER_ID, SESSION_ID))
                .isInstanceOf(BusinessException.class)
                .hasMessage("현재 상황을 먼저 저장해 주세요.");
        verify(aiClient, never()).generate(any());
    }

    @Test
    void rejectsWhenNextMeDoesNotExist() {
        NextTimeSession session = contextSavedSession();
        when(sessionRepository.findWithRecommendationByIdAndUser_Id(SESSION_ID, USER_ID))
                .thenReturn(Optional.of(session));
        when(profileRepository.findById(USER_ID)).thenReturn(Optional.of(profile()));
        when(generationRepository.findFirstByUserIdOrderByCreatedAtDesc(USER_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.generate(USER_ID, SESSION_ID))
                .isInstanceOf(BusinessException.class)
                .hasMessage("NEXT ME를 먼저 생성해 주세요.");
    }

    private void stubInputs(NextTimeSession session) {
        NextMeGeneration generation = nextMe();
        when(sessionRepository.findWithRecommendationByIdAndUser_Id(SESSION_ID, USER_ID))
                .thenReturn(Optional.of(session));
        when(profileRepository.findById(USER_ID)).thenReturn(Optional.of(profile()));
        when(generationRepository.findFirstByUserIdOrderByCreatedAtDesc(USER_ID))
                .thenReturn(Optional.of(generation));
    }

    private NextTimeSession contextSavedSession() {
        SmokingContext location = context("HOME", "집", SmokingContextType.LOCATION);
        SmokingContext trigger = context("AFTER_MEAL", "밥을 먹고 나서", SmokingContextType.TRIGGER);
        NextTimeSession session = new NextTimeSession(mock(User.class));
        session.saveContext(HIGH, location, trigger, Instant.now());
        return session;
    }

    private SmokingContext context(String code, String name, SmokingContextType type) {
        SmokingContext context = mock(SmokingContext.class);
        lenient().when(context.getName()).thenReturn(name);
        lenient().when(context.getContextType()).thenReturn(type);
        return context;
    }

    private UserProfile profile() {
        return new UserProfile(USER_ID, null, OnboardingGoal.QUIT, null);
    }

    private NextMeGeneration nextMe() {
        NextMeGeneration generation = mock(NextMeGeneration.class);
        when(generation.getHeadline()).thenReturn("러닝할 때 숨이 차서 먼저 멈추지 않는 나");
        when(generation.getDecisionTrigger()).thenReturn("건강을 위해 바꾸기로 했다");
        when(generation.getFutureSelf()).thenReturn("오래 달리는 나");
        when(generation.getMessageToFutureSelf()).thenReturn("이번에는 나한테 3분만 먼저 줘.");
        return generation;
    }
}
