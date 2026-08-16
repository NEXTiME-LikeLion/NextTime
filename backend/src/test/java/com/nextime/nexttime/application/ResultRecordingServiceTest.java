package com.nextime.nexttime.application;

import com.nextime.ai.resultmemory.client.ResultMemoryAiClient;
import com.nextime.ai.resultmemory.client.ResultMemoryClientResult;
import com.nextime.common.error.BusinessException;
import com.nextime.mission.domain.Mission;
import com.nextime.nexttime.api.RecordNextTimeResultRequest;
import com.nextime.nexttime.domain.CravingAfter;
import com.nextime.nexttime.domain.CravingChange;
import com.nextime.nexttime.domain.MissionHelpfulness;
import com.nextime.nexttime.domain.NextTimeResult;
import com.nextime.nexttime.domain.NextTimeSession;
import com.nextime.nexttime.domain.NextTimeSessionRepository;
import com.nextime.nexttime.domain.ResultMemorySource;
import com.nextime.smokingcontext.domain.SmokingContext;
import com.nextime.smokingcontext.domain.SmokingContextType;
import com.nextime.user.domain.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.ArgumentCaptor;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import static com.nextime.nexttime.domain.CravingBefore.HIGH;
import static com.nextime.nexttime.domain.NextTimeSessionStatus.RESULT_RECORDED;
import static com.nextime.nexttime.domain.RecommendationSource.RULE;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ResultRecordingServiceTest {

    private static final UUID USER_ID = UUID.fromString("30000000-0000-0000-0000-000000000001");
    private static final UUID SESSION_ID = UUID.fromString("40000000-0000-0000-0000-000000000001");

    @Mock
    private NextTimeSessionRepository sessionRepository;
    @Mock
    private ResultMemoryAiClient resultMemoryAiClient;

    private ResultRecordingService service;

    @BeforeEach
    void setUp() {
        service = new ResultRecordingService(
                new ResultPersistenceService(sessionRepository),
                resultMemoryAiClient
        );
    }

    @Test
    void recordsResultWithAiMemory() {
        NextTimeSession session = completedSession();
        stubSession(session);
        when(resultMemoryAiClient.generate(any())).thenReturn(
                ResultMemoryClientResult.ai("잠깐 걸으며 이번 욕구를 피우지 않고 넘겼어요.")
        );

        var response = service.record(USER_ID, SESSION_ID, validRequest("  회사 앞에서 다시 생각났어요.  "));

        assertThat(response.status()).isEqualTo(RESULT_RECORDED);
        assertThat(response.result()).isEqualTo(NextTimeResult.NOT_SMOKED);
        assertThat(response.cravingChange()).isEqualTo(CravingChange.DECREASED);
        assertThat(response.feedback()).isEqualTo("회사 앞에서 다시 생각났어요.");
        assertThat(response.memorySource()).isEqualTo(ResultMemorySource.AI);
        assertThat(response.memorySummary()).contains("피우지 않고 넘겼어요");
        assertThat(response.resultRecordedAt()).isNotNull();
        ArgumentCaptor<com.nextime.ai.resultmemory.client.ResultMemoryPromptInput> captor =
                ArgumentCaptor.forClass(com.nextime.ai.resultmemory.client.ResultMemoryPromptInput.class);
        verify(resultMemoryAiClient).generate(captor.capture());
        assertThat(captor.getValue().missionStatus()).isEqualTo("완료");
        assertThat(captor.getValue().result()).isEqualTo("피우지 않았어요");
        assertThat(captor.getValue().cravingAfter()).isEqualTo("이제 괜찮아요");
        assertThat(captor.getValue().missionHelpfulness()).isEqualTo("도움이 됐어요");
    }

    @Test
    void usesFallbackWhenAiFails() {
        NextTimeSession session = completedSession();
        stubSession(session);
        when(resultMemoryAiClient.generate(any())).thenThrow(new IllegalStateException("timeout"));

        var response = service.record(USER_ID, SESSION_ID, validRequest(null));

        assertThat(response.memorySource()).isEqualTo(ResultMemorySource.FALLBACK);
        assertThat(response.memorySummary())
                .isEqualTo("밥을 먹고 나서 잠깐 걷기를 했고, 결과는 피우지 않았어요. 이번 미션은 도움이 됐다고 기록했어요.");
    }

    @Test
    void repeatedRequestReturnsSavedResultWithoutCallingAiAgain() {
        NextTimeSession session = completedSession();
        stubSession(session);
        when(resultMemoryAiClient.generate(any())).thenReturn(ResultMemoryClientResult.fallback());
        RecordNextTimeResultRequest request = validRequest(null);

        Instant first = service.record(USER_ID, SESSION_ID, request).resultRecordedAt();
        Instant second = service.record(USER_ID, SESSION_ID, request).resultRecordedAt();

        assertThat(second).isEqualTo(first);
        verify(resultMemoryAiClient).generate(any());
    }

    @Test
    void rejectsResultBeforeMissionCompletion() {
        NextTimeSession session = recommendedSession();
        stubSession(session);

        assertThatThrownBy(() -> service.record(USER_ID, SESSION_ID, validRequest(null)))
                .isInstanceOf(BusinessException.class)
                .hasMessage("행동 미션을 완료한 후 결과를 기록해 주세요.");
        verify(resultMemoryAiClient, never()).generate(any());
    }

    @Test
    void rejectsResultForSkippedMission() {
        NextTimeSession session = recommendedSession();
        session.skipMission(Instant.now());
        stubSession(session);

        assertThatThrownBy(() -> service.record(USER_ID, SESSION_ID, validRequest(null)))
                .isInstanceOf(BusinessException.class)
                .hasMessage("건너뛴 미션에는 결과를 기록할 수 없습니다.");
    }

    @Test
    void hidesMissingOrOtherUsersSessionAsNotFound() {
        when(sessionRepository.findWithRecommendationByIdAndUser_Id(SESSION_ID, USER_ID))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.record(USER_ID, SESSION_ID, validRequest(null)))
                .isInstanceOf(BusinessException.class)
                .hasMessage("NEXT TIME 세션을 찾을 수 없습니다.");
    }

    private void stubSession(NextTimeSession session) {
        when(sessionRepository.findWithRecommendationByIdAndUser_Id(SESSION_ID, USER_ID))
                .thenReturn(Optional.of(session));
    }

    private NextTimeSession completedSession() {
        NextTimeSession session = recommendedSession();
        session.startMission(Instant.now());
        session.completeMission(Instant.now());
        return session;
    }

    private NextTimeSession recommendedSession() {
        SmokingContext location = context("HOME", "집", SmokingContextType.LOCATION);
        SmokingContext trigger = context("AFTER_MEAL", "밥을 먹고 나서", SmokingContextType.TRIGGER);
        NextTimeSession session = new NextTimeSession(mock(User.class));
        session.saveContext(HIGH, location, trigger, Instant.now());

        Mission mission = mock(Mission.class);
        lenient().when(mission.getId())
                .thenReturn(UUID.fromString("20000000-0000-0000-0000-000000000003"));
        when(mission.getCode()).thenReturn("SHORT_WALK");
        when(mission.getName()).thenReturn("잠깐 걷기");
        when(mission.getDescription()).thenReturn("5분만 걸어보세요.");
        when(mission.getCompletionCriteria()).thenReturn("5분 동안 걸으면 완료");
        when(mission.getEstimatedSeconds()).thenReturn(300);
        session.recommend(mission, "추천 이유", RULE, Instant.now());
        return session;
    }

    private SmokingContext context(String code, String name, SmokingContextType type) {
        SmokingContext context = mock(SmokingContext.class);
        lenient().when(context.getCode()).thenReturn(code);
        lenient().when(context.getName()).thenReturn(name);
        lenient().when(context.getContextType()).thenReturn(type);
        return context;
    }

    private RecordNextTimeResultRequest validRequest(String feedback) {
        return new RecordNextTimeResultRequest(
                NextTimeResult.NOT_SMOKED,
                CravingAfter.NONE,
                MissionHelpfulness.HELPFUL,
                feedback
        );
    }
}
