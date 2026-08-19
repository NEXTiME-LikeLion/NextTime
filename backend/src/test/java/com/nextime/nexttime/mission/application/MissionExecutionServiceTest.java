package com.nextime.nexttime.mission.application;

import com.nextime.common.error.BusinessException;
import com.nextime.mission.domain.Mission;
import com.nextime.nexttime.domain.NextTimeSession;
import com.nextime.nexttime.domain.NextTimeSessionRepository;
import com.nextime.smokingcontext.domain.SmokingContext;
import com.nextime.user.domain.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import static com.nextime.nexttime.domain.CravingBefore.MEDIUM;
import static com.nextime.nexttime.domain.NextTimeSessionStatus.CANCELLED;
import static com.nextime.nexttime.domain.NextTimeSessionStatus.MISSION_COMPLETED;
import static com.nextime.nexttime.domain.NextTimeSessionStatus.MISSION_STARTED;
import static com.nextime.nexttime.domain.RecommendationSource.RULE;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MissionExecutionServiceTest {

    private static final UUID USER_ID = UUID.fromString("30000000-0000-0000-0000-000000000001");
    private static final UUID SESSION_ID = UUID.fromString("40000000-0000-0000-0000-000000000001");

    @Mock
    private NextTimeSessionRepository sessionRepository;

    private MissionExecutionService service;

    @BeforeEach
    void setUp() {
        service = new MissionExecutionService(sessionRepository);
    }

    @Test
    void startsRecommendedMission() {
        NextTimeSession session = recommendedSession();
        stubSession(session);

        var response = service.start(USER_ID, SESSION_ID);

        assertThat(response.status()).isEqualTo(MISSION_STARTED);
        assertThat(response.mission().code()).isEqualTo("BRUSH_OR_RINSE");
        assertThat(response.startedAt()).isNotNull();
    }

    @Test
    void repeatedStartReturnsOriginalStartTime() {
        NextTimeSession session = recommendedSession();
        stubSession(session);

        Instant first = service.start(USER_ID, SESSION_ID).startedAt();
        Instant second = service.start(USER_ID, SESSION_ID).startedAt();

        assertThat(second).isEqualTo(first);
    }

    @Test
    void rejectsStartBeforeRecommendation() {
        NextTimeSession session = contextSavedSession();
        stubSession(session);

        assertThatThrownBy(() -> service.start(USER_ID, SESSION_ID))
                .isInstanceOf(BusinessException.class)
                .hasMessage("추천된 행동 미션이 없습니다.");
    }

    @Test
    void completesStartedMission() {
        NextTimeSession session = recommendedSession();
        stubSession(session);
        service.start(USER_ID, SESSION_ID);

        var response = service.complete(USER_ID, SESSION_ID);

        assertThat(response.status()).isEqualTo(MISSION_COMPLETED);
        assertThat(response.startedAt()).isNotNull();
        assertThat(response.completedAt()).isNotNull();
    }

    @Test
    void repeatedCompletionReturnsOriginalCompletionTime() {
        NextTimeSession session = recommendedSession();
        stubSession(session);
        service.start(USER_ID, SESSION_ID);

        Instant first = service.complete(USER_ID, SESSION_ID).completedAt();
        Instant second = service.complete(USER_ID, SESSION_ID).completedAt();

        assertThat(second).isEqualTo(first);
    }

    @Test
    void rejectsCompletionBeforeStart() {
        NextTimeSession session = recommendedSession();
        stubSession(session);

        assertThatThrownBy(() -> service.complete(USER_ID, SESSION_ID))
                .isInstanceOf(BusinessException.class)
                .hasMessage("행동 미션을 먼저 시작해 주세요.");
    }

    @Test
    void skipsRecommendedMission() {
        NextTimeSession session = recommendedSession();
        stubSession(session);

        var response = service.skip(USER_ID, SESSION_ID);

        assertThat(response.status()).isEqualTo(CANCELLED);
        assertThat(response.mission().code()).isEqualTo("BRUSH_OR_RINSE");
        assertThat(response.skippedAt()).isNotNull();
    }

    @Test
    void repeatedSkipReturnsOriginalSkipTime() {
        NextTimeSession session = recommendedSession();
        stubSession(session);

        Instant first = service.skip(USER_ID, SESSION_ID).skippedAt();
        Instant second = service.skip(USER_ID, SESSION_ID).skippedAt();

        assertThat(second).isEqualTo(first);
    }

    @Test
    void allowsSkipAfterStart() {
        NextTimeSession session = recommendedSession();
        stubSession(session);
        service.start(USER_ID, SESSION_ID);

        var response = service.skip(USER_ID, SESSION_ID);

        assertThat(response.status()).isEqualTo(CANCELLED);
        assertThat(response.skippedAt()).isNotNull();
    }

    @Test
    void rejectsSkipBeforeRecommendation() {
        NextTimeSession session = contextSavedSession();
        stubSession(session);

        assertThatThrownBy(() -> service.skip(USER_ID, SESSION_ID))
                .isInstanceOf(BusinessException.class)
                .hasMessage("건너뛸 행동 미션이 없습니다.");
    }

    @Test
    void hidesMissingOrOtherUsersSessionAsNotFound() {
        when(sessionRepository.findWithRecommendationByIdAndUser_Id(SESSION_ID, USER_ID))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.start(USER_ID, SESSION_ID))
                .isInstanceOf(BusinessException.class)
                .hasMessage("NEXT TIME 세션을 찾을 수 없습니다.");
    }

    private void stubSession(NextTimeSession session) {
        when(sessionRepository.findWithRecommendationByIdAndUser_Id(SESSION_ID, USER_ID))
                .thenReturn(Optional.of(session));
    }

    private NextTimeSession recommendedSession() {
        NextTimeSession session = contextSavedSession();
        Mission mission = mock(Mission.class);
        lenient().when(mission.getId())
                .thenReturn(UUID.fromString("20000000-0000-0000-0000-000000000007"));
        when(mission.getCode()).thenReturn("BRUSH_OR_RINSE");
        when(mission.getName()).thenReturn("양치하거나 입 헹구기");
        when(mission.getDescription()).thenReturn("양치하거나 입을 헹구며 식후 루틴을 바꿔보세요.");
        when(mission.getCompletionCriteria()).thenReturn("양치하거나 입을 헹구면 완료");
        when(mission.getEstimatedSeconds()).thenReturn(120);
        session.recommend(mission, "추천 이유", RULE, Instant.now());
        return session;
    }

    private NextTimeSession contextSavedSession() {
        NextTimeSession session = new NextTimeSession(mock(User.class));
        session.saveContext(MEDIUM, mock(SmokingContext.class), mock(SmokingContext.class), Instant.now());
        return session;
    }
}
