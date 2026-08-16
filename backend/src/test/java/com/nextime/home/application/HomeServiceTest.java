package com.nextime.home.application;

import com.nextime.ai.nextme.domain.NextBudTheme;
import com.nextime.ai.nextme.domain.NextMeGeneration;
import com.nextime.ai.nextme.domain.NextMeGenerationRepository;
import com.nextime.common.error.BusinessException;
import com.nextime.mission.domain.Mission;
import com.nextime.nexttime.domain.NextTimeSession;
import com.nextime.nexttime.domain.NextTimeSessionRepository;
import com.nextime.smokingcontext.domain.SmokingContext;
import com.nextime.user.domain.User;
import com.nextime.user.domain.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static com.nextime.nexttime.domain.CravingBefore.HIGH;
import static com.nextime.nexttime.domain.MissionHelpfulness.HELPFUL;
import static com.nextime.nexttime.domain.NextTimeResult.DELAYED;
import static com.nextime.nexttime.domain.NextTimeResult.NOT_SMOKED;
import static com.nextime.nexttime.domain.NextTimeResult.SMOKED;
import static com.nextime.nexttime.domain.NextTimeSessionStatus.MISSION_STARTED;
import static com.nextime.nexttime.domain.NextTimeSessionStatus.RESULT_RECORDED;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyCollection;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class HomeServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private NextMeGenerationRepository nextMeGenerationRepository;
    @Mock
    private NextTimeSessionRepository nextTimeSessionRepository;

    private HomeService service;

    @BeforeEach
    void setUp() {
        service = new HomeService(userRepository, nextMeGenerationRepository, nextTimeSessionRepository);
    }

    @Test
    void returnsHomeDataWithActiveSessionAndTodaySummary() {
        UUID userId = UUID.randomUUID();
        NextMeGeneration nextMe = nextMe();
        NextTimeSession activeSession = activeSession();
        Mission walking = mission(UUID.randomUUID());
        Mission breathing = mission(UUID.randomUUID());
        List<NextTimeSession> results = List.of(
                resultSession(walking, NOT_SMOKED, HELPFUL, "2026-08-16T03:00:00Z"),
                resultSession(walking, DELAYED, HELPFUL, "2026-08-16T02:00:00Z"),
                resultSession(breathing, SMOKED, HELPFUL, "2026-08-16T01:00:00Z")
        );
        mockCommon(userId, nextMe);
        when(nextTimeSessionRepository.findFirstByUser_IdAndStatusInOrderByUpdatedAtDesc(
                eq(userId), anyCollection()
        )).thenReturn(Optional.of(activeSession));
        when(nextTimeSessionRepository
                .findByUser_IdAndStatusAndResultRecordedAtGreaterThanEqualAndResultRecordedAtLessThanOrderByResultRecordedAtDesc(
                        eq(userId), eq(RESULT_RECORDED), any(Instant.class), any(Instant.class)
                )).thenReturn(results);

        var response = service.getHome(userId);

        assertThat(response.nextMe().headline()).isEqualTo("먼저 멈추지 않는 나");
        assertThat(response.nextMe().nextBudTheme()).isEqualTo(NextBudTheme.NEXTBUD_HEALTH_01);
        assertThat(response.activeNextTimeSession().status()).isEqualTo(MISSION_STARTED);
        assertThat(response.activeNextTimeSession().cravingBefore()).isEqualTo(HIGH);
        assertThat(response.todaySummary().totalAttemptCount()).isEqualTo(3);
        assertThat(response.todaySummary().overcomeCount()).isEqualTo(1);
        assertThat(response.todaySummary().delayedCount()).isEqualTo(1);
        assertThat(response.todaySummary().smokedCount()).isEqualTo(1);
        assertThat(response.todaySummary().nextAction().missionId()).isEqualTo(walking.getId());
    }

    @Test
    void returnsEmptyTodaySummaryWhenThereAreNoResults() {
        UUID userId = UUID.randomUUID();
        mockCommon(userId, nextMe());
        when(nextTimeSessionRepository.findFirstByUser_IdAndStatusInOrderByUpdatedAtDesc(
                eq(userId), anyCollection()
        )).thenReturn(Optional.empty());
        when(nextTimeSessionRepository
                .findByUser_IdAndStatusAndResultRecordedAtGreaterThanEqualAndResultRecordedAtLessThanOrderByResultRecordedAtDesc(
                        eq(userId), eq(RESULT_RECORDED), any(Instant.class), any(Instant.class)
                )).thenReturn(List.of());

        var response = service.getHome(userId);

        assertThat(response.activeNextTimeSession()).isNull();
        assertThat(response.todaySummary().totalAttemptCount()).isZero();
        assertThat(response.todaySummary().nextAction()).isNull();
    }

    @Test
    void doesNotSelectNeutralOrSkippedMissionAsNextAction() {
        UUID userId = UUID.randomUUID();
        NextTimeSession session = mock(NextTimeSession.class);
        when(session.getMissionCompletedAt()).thenReturn(null);
        when(session.getResult()).thenReturn(NOT_SMOKED);
        mockCommon(userId, nextMe());
        when(nextTimeSessionRepository.findFirstByUser_IdAndStatusInOrderByUpdatedAtDesc(
                eq(userId), anyCollection()
        )).thenReturn(Optional.empty());
        when(nextTimeSessionRepository
                .findByUser_IdAndStatusAndResultRecordedAtGreaterThanEqualAndResultRecordedAtLessThanOrderByResultRecordedAtDesc(
                        eq(userId), eq(RESULT_RECORDED), any(Instant.class), any(Instant.class)
                )).thenReturn(List.of(session));

        assertThat(service.getHome(userId).todaySummary().nextAction()).isNull();
    }

    @Test
    void rejectsUserWhoHasNotCompletedOnboarding() {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(user.isOnboardingCompleted()).thenReturn(false);

        assertThatThrownBy(() -> service.getHome(userId))
                .isInstanceOf(BusinessException.class)
                .hasMessage("온보딩을 먼저 완료해 주세요.");
    }

    @Test
    void rejectsWhenNextMeDoesNotExist() {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        when(user.isOnboardingCompleted()).thenReturn(true);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(nextMeGenerationRepository.findFirstByUserIdOrderByCreatedAtDesc(userId))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.getHome(userId))
                .isInstanceOf(BusinessException.class)
                .hasMessage("생성된 NEXT ME 메시지가 없습니다.");
    }

    private void mockCommon(UUID userId, NextMeGeneration nextMe) {
        User user = mock(User.class);
        when(user.isOnboardingCompleted()).thenReturn(true);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(nextMeGenerationRepository.findFirstByUserIdOrderByCreatedAtDesc(userId))
                .thenReturn(Optional.of(nextMe));
    }

    private NextMeGeneration nextMe() {
        NextMeGeneration generation = mock(NextMeGeneration.class);
        when(generation.getHeadline()).thenReturn("먼저 멈추지 않는 나");
        when(generation.getMessageToFutureSelf()).thenReturn("내 체력 때문에 포기하고 싶지 않아.");
        when(generation.getNextBudTheme()).thenReturn(NextBudTheme.NEXTBUD_HEALTH_01);
        return generation;
    }

    private NextTimeSession activeSession() {
        NextTimeSession session = mock(NextTimeSession.class);
        when(session.getId()).thenReturn(UUID.randomUUID());
        when(session.getStatus()).thenReturn(MISSION_STARTED);
        when(session.getCravingBefore()).thenReturn(HIGH);
        when(session.getContexts()).thenReturn(Set.<SmokingContext>of());
        when(session.getRecommendedMission()).thenReturn(null);
        return session;
    }

    private Mission mission(UUID id) {
        Mission mission = mock(Mission.class);
        when(mission.getId()).thenReturn(id);
        return mission;
    }

    private NextTimeSession resultSession(
            Mission mission,
            com.nextime.nexttime.domain.NextTimeResult result,
            com.nextime.nexttime.domain.MissionHelpfulness helpfulness,
            String recordedAt
    ) {
        NextTimeSession session = mock(NextTimeSession.class);
        Instant time = Instant.parse(recordedAt);
        when(session.getRecommendedMission()).thenReturn(mission);
        lenient().when(session.getMissionCodeSnapshot()).thenReturn("SHORT_WALK");
        lenient().when(session.getMissionNameSnapshot()).thenReturn("잠깐 걷기");
        lenient().when(session.getMissionDescriptionSnapshot()).thenReturn("잠깐 걸어보세요.");
        when(session.getMissionCompletedAt()).thenReturn(time.minusSeconds(10));
        when(session.getMissionHelpfulness()).thenReturn(helpfulness);
        when(session.getResult()).thenReturn(result);
        when(session.getResultRecordedAt()).thenReturn(time);
        return session;
    }
}
