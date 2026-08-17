package com.nextime.nexttime.recommendation.application;

import com.nextime.ai.copingprofile.domain.CopingProfileRepository;
import com.nextime.common.error.BusinessException;
import com.nextime.mission.domain.Mission;
import com.nextime.mission.domain.MissionRepository;
import com.nextime.nexttime.domain.NextTimeResult;
import com.nextime.nexttime.domain.NextTimeSession;
import com.nextime.nexttime.domain.NextTimeSessionRepository;
import com.nextime.smokingcontext.domain.SmokingContext;
import com.nextime.smokingcontext.domain.SmokingContextType;
import com.nextime.user.domain.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static com.nextime.mission.domain.MissionEffortType.ACTIVE;
import static com.nextime.mission.domain.MissionEffortType.LOW_EFFORT;
import static com.nextime.nexttime.domain.CravingBefore.MEDIUM;
import static com.nextime.nexttime.domain.MissionHelpfulness.HELPFUL;
import static com.nextime.nexttime.domain.MissionHelpfulness.NOT_FIT;
import static com.nextime.nexttime.domain.NextTimeResult.SMOKED;
import static com.nextime.nexttime.domain.NextTimeSessionStatus.MISSION_RECOMMENDED;
import static com.nextime.nexttime.domain.NextTimeSessionStatus.RESULT_RECORDED;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MissionRecommendationServiceTest {

    @Mock
    private NextTimeSessionRepository sessionRepository;
    @Mock
    private MissionRepository missionRepository;
    @Mock
    private CopingProfileRepository copingProfileRepository;

    private MissionRecommendationService service;

    @BeforeEach
    void setUp() {
        service = new MissionRecommendationService(
                sessionRepository,
                missionRepository,
                copingProfileRepository,
                new MissionCandidatePolicy()
        );
    }

    @Test
    void recommendsFirstPolicyCandidateWhenThereIsNoHistory() {
        UUID userId = UUID.randomUUID();
        UUID sessionId = UUID.randomUUID();
        SmokingContext home = context("HOME", "집", SmokingContextType.LOCATION);
        SmokingContext meal = context("AFTER_MEAL", "밥을 먹고 나서", SmokingContextType.TRIGGER);
        NextTimeSession session = contextSavedSession(home, meal);
        Mission brush = mission("BRUSH_OR_RINSE", "양치하거나 입 헹구기", LOW_EFFORT);
        Mission gum = mission("GUM_OR_CANDY", "껌이나 사탕 먹기", LOW_EFFORT);

        stubRequest(userId, sessionId, session, home, List.of(gum, brush), List.of());

        var response = service.recommend(userId, sessionId);

        assertThat(response.status()).isEqualTo(MISSION_RECOMMENDED);
        assertThat(response.mission().code()).isEqualTo("BRUSH_OR_RINSE");
        assertThat(response.reason()).isEqualTo("BRUSH_OR_RINSE 기본 이유");
    }

    @Test
    void exactContextPositiveHistoryOverridesDefaultOrder() {
        UUID userId = UUID.randomUUID();
        UUID sessionId = UUID.randomUUID();
        SmokingContext home = context("HOME", "집", SmokingContextType.LOCATION);
        SmokingContext meal = context("AFTER_MEAL", "밥을 먹고 나서", SmokingContextType.TRIGGER);
        NextTimeSession session = contextSavedSession(home, meal);
        Mission brush = mission("BRUSH_OR_RINSE", "양치", LOW_EFFORT);
        Mission water = mission("DRINK_WATER", "물 마시기", LOW_EFFORT);
        NextTimeSession positiveWater = history(water, home, meal, HELPFUL, NextTimeResult.NOT_SMOKED);

        stubRequest(userId, sessionId, session, home, List.of(brush, water), List.of(positiveWater));

        var response = service.recommend(userId, sessionId);

        assertThat(response.mission().code()).isEqualTo("DRINK_WATER");
        assertThat(response.reason()).contains("밥을 먹고 나서·집");
    }

    @Test
    void automaticallyExcludesMissionWhenLatestThreeSessionScoresAreAllMinusTwo() {
        UUID userId = UUID.randomUUID();
        UUID sessionId = UUID.randomUUID();
        SmokingContext home = context("HOME", "집", SmokingContextType.LOCATION);
        SmokingContext meal = context("AFTER_MEAL", "밥을 먹고 나서", SmokingContextType.TRIGGER);
        NextTimeSession session = contextSavedSession(home, meal);
        Mission brush = mission("BRUSH_OR_RINSE", "양치", LOW_EFFORT);
        Mission gum = mission("GUM_OR_CANDY", "껌이나 사탕", LOW_EFFORT);
        List<NextTimeSession> history = List.of(
                history(brush, home, meal, NOT_FIT, SMOKED),
                history(brush, home, meal, NOT_FIT, SMOKED),
                history(brush, home, meal, NOT_FIT, SMOKED)
        );
        stubRequest(userId, sessionId, session, home, List.of(brush, gum), history);

        var response = service.recommend(userId, sessionId);

        assertThat(response.mission().code()).isEqualTo("GUM_OR_CANDY");
        verify(missionRepository).saveAutomaticExclusion(userId, brush.getId());
    }

    @Test
    void doesNotAutomaticallyExcludeMissionWithOnlyTwoMinusTwoScores() {
        UUID userId = UUID.randomUUID();
        UUID sessionId = UUID.randomUUID();
        SmokingContext home = context("HOME", "집", SmokingContextType.LOCATION);
        SmokingContext meal = context("AFTER_MEAL", "밥을 먹고 나서", SmokingContextType.TRIGGER);
        NextTimeSession session = contextSavedSession(home, meal);
        Mission brush = mission("BRUSH_OR_RINSE", "양치", LOW_EFFORT);
        List<NextTimeSession> history = List.of(
                history(brush, home, meal, NOT_FIT, SMOKED),
                history(brush, home, meal, NOT_FIT, SMOKED)
        );
        stubRequest(userId, sessionId, session, home, List.of(brush), history);

        service.recommend(userId, sessionId);

        verify(missionRepository, never()).saveAutomaticExclusion(any(), any());
    }

    @Test
    void restoredMissionIgnoresResultsRecordedBeforeRestore() {
        UUID userId = UUID.randomUUID();
        UUID sessionId = UUID.randomUUID();
        SmokingContext home = context("HOME", "집", SmokingContextType.LOCATION);
        SmokingContext meal = context("AFTER_MEAL", "밥을 먹고 나서", SmokingContextType.TRIGGER);
        NextTimeSession session = contextSavedSession(home, meal);
        Mission brush = mission("BRUSH_OR_RINSE", "양치", LOW_EFFORT);
        UUID brushId = brush.getId();
        List<NextTimeSession> history = List.of(
                history(brush, home, meal, NOT_FIT, SMOKED),
                history(brush, home, meal, NOT_FIT, SMOKED),
                history(brush, home, meal, NOT_FIT, SMOKED)
        );
        stubRequest(userId, sessionId, session, home, List.of(brush), history);
        Instant restoredAt = Instant.parse("2026-08-17T03:00:00Z");
        history.forEach(past -> when(past.getResultRecordedAt())
                .thenReturn(Instant.parse("2026-08-17T02:00:00Z")));
        MissionRepository.RestoredMissionView restored = mock(MissionRepository.RestoredMissionView.class);
        when(restored.getMissionId()).thenReturn(brushId);
        when(restored.getRestoredAt()).thenReturn(restoredAt);
        when(missionRepository.findRestoredMissions(userId)).thenReturn(List.of(restored));

        var response = service.recommend(userId, sessionId);

        assertThat(response.mission().code()).isEqualTo("BRUSH_OR_RINSE");
        verify(missionRepository, never()).saveAutomaticExclusion(any(), any());
    }

    @Test
    void excludesRestoredMissionAgainAfterThreeNewMinimumScores() {
        UUID userId = UUID.randomUUID();
        UUID sessionId = UUID.randomUUID();
        SmokingContext home = context("HOME", "집", SmokingContextType.LOCATION);
        SmokingContext meal = context("AFTER_MEAL", "밥을 먹고 나서", SmokingContextType.TRIGGER);
        NextTimeSession session = contextSavedSession(home, meal);
        Mission brush = mission("BRUSH_OR_RINSE", "양치", LOW_EFFORT);
        Mission gum = mission("GUM_OR_CANDY", "껌이나 사탕", LOW_EFFORT);
        Instant restoredAt = Instant.parse("2026-08-17T03:00:00Z");
        List<NextTimeSession> history = List.of(
                history(brush, home, meal, NOT_FIT, SMOKED),
                history(brush, home, meal, NOT_FIT, SMOKED),
                history(brush, home, meal, NOT_FIT, SMOKED)
        );
        history.forEach(past -> when(past.getResultRecordedAt())
                .thenReturn(Instant.parse("2026-08-17T04:00:00Z")));
        stubRequest(userId, sessionId, session, home, List.of(brush, gum), history);
        UUID brushId = brush.getId();
        MissionRepository.RestoredMissionView restored = mock(MissionRepository.RestoredMissionView.class);
        when(restored.getMissionId()).thenReturn(brushId);
        when(restored.getRestoredAt()).thenReturn(restoredAt);
        when(missionRepository.findRestoredMissions(userId)).thenReturn(List.of(restored));

        var response = service.recommend(userId, sessionId);

        assertThat(response.mission().code()).isEqualTo("GUM_OR_CANDY");
        verify(missionRepository).saveAutomaticExclusion(userId, brushId);
    }

    @Test
    void returnsSavedRecommendationWithoutRecalculating() {
        UUID userId = UUID.randomUUID();
        UUID sessionId = UUID.randomUUID();
        SmokingContext home = context("HOME", "집", SmokingContextType.LOCATION);
        SmokingContext meal = context("AFTER_MEAL", "밥을 먹고 나서", SmokingContextType.TRIGGER);
        NextTimeSession session = contextSavedSession(home, meal);
        Mission brush = mission("BRUSH_OR_RINSE", "양치", LOW_EFFORT);
        session.recommend(brush, "기존 이유", com.nextime.nexttime.domain.RecommendationSource.RULE, Instant.now());
        when(sessionRepository.findWithRecommendationByIdAndUser_Id(sessionId, userId))
                .thenReturn(Optional.of(session));

        var response = service.recommend(userId, sessionId);

        assertThat(response.mission().code()).isEqualTo("BRUSH_OR_RINSE");
        verify(missionRepository, never()).findActiveAvailableAt(any());
    }

    @Test
    void rejectsRecommendationBeforeContextIsSaved() {
        UUID userId = UUID.randomUUID();
        UUID sessionId = UUID.randomUUID();
        NextTimeSession created = new NextTimeSession(mock(User.class));
        when(sessionRepository.findWithRecommendationByIdAndUser_Id(sessionId, userId))
                .thenReturn(Optional.of(created));

        assertThatThrownBy(() -> service.recommend(userId, sessionId))
                .isInstanceOf(BusinessException.class)
                .hasMessage("현재 상황을 먼저 저장해 주세요.");
    }

    private void stubRequest(
            UUID userId,
            UUID sessionId,
            NextTimeSession session,
            SmokingContext location,
            List<Mission> missions,
            List<NextTimeSession> history
    ) {
        when(sessionRepository.findWithRecommendationByIdAndUser_Id(sessionId, userId))
                .thenReturn(Optional.of(session));
        when(missionRepository.findExcludedMissionIds(userId)).thenReturn(List.of());
        when(missionRepository.findRestoredMissions(userId)).thenReturn(List.of());
        when(missionRepository.findActiveAvailableAt(location.getId())).thenReturn(missions);
        when(copingProfileRepository.findFirstByUserIdOrderByCreatedAtDesc(userId))
                .thenReturn(Optional.empty());
        when(sessionRepository
                .findByUser_IdAndStatusAndResultRecordedAtGreaterThanEqualOrderByResultRecordedAtDesc(
                        eq(userId), eq(RESULT_RECORDED), any(Instant.class)
                )).thenReturn(history);
    }

    private NextTimeSession contextSavedSession(SmokingContext location, SmokingContext trigger) {
        NextTimeSession session = new NextTimeSession(mock(User.class));
        session.saveContext(MEDIUM, location, trigger, Instant.now());
        return session;
    }

    private NextTimeSession history(
            Mission mission,
            SmokingContext location,
            SmokingContext trigger,
            com.nextime.nexttime.domain.MissionHelpfulness helpfulness,
            NextTimeResult result
    ) {
        NextTimeSession session = mock(NextTimeSession.class);
        when(session.getRecommendedMission()).thenReturn(mission);
        lenient().when(session.getContexts()).thenReturn(java.util.Set.of(location, trigger));
        when(session.getMissionHelpfulness()).thenReturn(helpfulness);
        when(session.getResult()).thenReturn(result);
        return session;
    }

    private Mission mission(String code, String name, com.nextime.mission.domain.MissionEffortType effort) {
        Mission mission = mock(Mission.class);
        lenient().when(mission.getId()).thenReturn(UUID.randomUUID());
        lenient().when(mission.getCode()).thenReturn(code);
        lenient().when(mission.getName()).thenReturn(name);
        lenient().when(mission.getDescription()).thenReturn(code + " 설명");
        lenient().when(mission.getCompletionCriteria()).thenReturn(code + " 완료 기준");
        lenient().when(mission.getEstimatedSeconds()).thenReturn(120);
        lenient().when(mission.getDefaultReason()).thenReturn(code + " 기본 이유");
        lenient().when(mission.getEffortType()).thenReturn(effort);
        return mission;
    }

    private SmokingContext context(String code, String name, SmokingContextType type) {
        SmokingContext context = mock(SmokingContext.class);
        lenient().when(context.getId()).thenReturn(UUID.randomUUID());
        lenient().when(context.getCode()).thenReturn(code);
        lenient().when(context.getName()).thenReturn(name);
        lenient().when(context.getContextType()).thenReturn(type);
        return context;
    }
}
