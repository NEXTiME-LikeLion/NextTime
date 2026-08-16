package com.nextime.home.application;

import com.nextime.ai.nextme.domain.NextMeGeneration;
import com.nextime.ai.nextme.domain.NextMeGenerationRepository;
import com.nextime.common.error.BusinessException;
import com.nextime.common.error.ErrorCode;
import com.nextime.home.api.HomeResponse;
import com.nextime.home.api.HomeResponse.NextAction;
import com.nextime.home.api.HomeResponse.TodaySummary;
import com.nextime.nexttime.domain.NextTimeResult;
import com.nextime.nexttime.domain.NextTimeSession;
import com.nextime.nexttime.domain.NextTimeSessionRepository;
import com.nextime.nexttime.domain.NextTimeSessionStatus;
import com.nextime.user.domain.User;
import com.nextime.user.domain.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Collection;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static com.nextime.nexttime.domain.MissionHelpfulness.HELPFUL;
import static com.nextime.nexttime.domain.NextTimeResult.DELAYED;
import static com.nextime.nexttime.domain.NextTimeResult.NOT_SMOKED;
import static com.nextime.nexttime.domain.NextTimeResult.SMOKED;
import static com.nextime.nexttime.domain.NextTimeSessionStatus.CONTEXT_SAVED;
import static com.nextime.nexttime.domain.NextTimeSessionStatus.CREATED;
import static com.nextime.nexttime.domain.NextTimeSessionStatus.MISSION_COMPLETED;
import static com.nextime.nexttime.domain.NextTimeSessionStatus.MISSION_RECOMMENDED;
import static com.nextime.nexttime.domain.NextTimeSessionStatus.MISSION_STARTED;
import static com.nextime.nexttime.domain.NextTimeSessionStatus.RESULT_RECORDED;

@Service
@RequiredArgsConstructor
public class HomeService {

    private static final ZoneId SERVICE_ZONE = ZoneId.of("Asia/Seoul");
    private static final Collection<NextTimeSessionStatus> ACTIVE_STATUSES = List.of(
            CREATED,
            CONTEXT_SAVED,
            MISSION_RECOMMENDED,
            MISSION_STARTED,
            MISSION_COMPLETED
    );

    private final UserRepository userRepository;
    private final NextMeGenerationRepository nextMeGenerationRepository;
    private final NextTimeSessionRepository nextTimeSessionRepository;

    @Transactional(readOnly = true)
    public HomeResponse getHome(UUID userId) {
        validateUser(userId);
        NextMeGeneration nextMe = nextMeGenerationRepository.findFirstByUserIdOrderByCreatedAtDesc(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NEXT_ME_NOT_FOUND));
        NextTimeSession activeSession = nextTimeSessionRepository
                .findFirstByUser_IdAndStatusInOrderByUpdatedAtDesc(userId, ACTIVE_STATUSES)
                .orElse(null);

        TodayWindow today = TodayWindow.now();
        List<NextTimeSession> todayResults = nextTimeSessionRepository
                .findByUser_IdAndStatusAndResultRecordedAtGreaterThanEqualAndResultRecordedAtLessThanOrderByResultRecordedAtDesc(
                        userId,
                        RESULT_RECORDED,
                        today.start(),
                        today.end()
                );

        return new HomeResponse(
                HomeResponse.NextMe.from(nextMe),
                activeSession == null ? null : HomeResponse.ActiveNextTimeSession.from(activeSession),
                summarize(todayResults)
        );
    }

    private void validateUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_REGISTERED));
        if (!user.isOnboardingCompleted()) {
            throw new BusinessException(ErrorCode.CONFLICT, "온보딩을 먼저 완료해 주세요.");
        }
    }

    private TodaySummary summarize(List<NextTimeSession> sessions) {
        int overcomeCount = countResult(sessions, NOT_SMOKED);
        int delayedCount = countResult(sessions, DELAYED);
        int smokedCount = countResult(sessions, SMOKED);
        return new TodaySummary(
                sessions.size(),
                overcomeCount,
                delayedCount,
                smokedCount,
                selectNextAction(sessions)
        );
    }

    private int countResult(List<NextTimeSession> sessions, NextTimeResult result) {
        return (int) sessions.stream().filter(session -> session.getResult() == result).count();
    }

    private NextAction selectNextAction(List<NextTimeSession> sessions) {
        Map<UUID, ActionStats> statsByMission = new HashMap<>();
        sessions.stream()
                .filter(session -> session.getMissionCompletedAt() != null)
                .filter(session -> session.getMissionHelpfulness() == HELPFUL)
                .filter(session -> session.getRecommendedMission() != null)
                .forEach(session -> statsByMission
                        .computeIfAbsent(
                                session.getRecommendedMission().getId(),
                                ignored -> ActionStats.from(session)
                        )
                        .add(session));

        return statsByMission.values().stream()
                .max(Comparator.comparingInt(ActionStats::helpfulCount)
                        .thenComparingInt(ActionStats::avoidedImmediateSmokingCount)
                        .thenComparing(ActionStats::latestHelpfulAt))
                .map(ActionStats::toResponse)
                .orElse(null);
    }

    private record TodayWindow(Instant start, Instant end) {
        private static TodayWindow now() {
            LocalDate today = LocalDate.now(SERVICE_ZONE);
            return new TodayWindow(
                    today.atStartOfDay(SERVICE_ZONE).toInstant(),
                    today.plusDays(1).atStartOfDay(SERVICE_ZONE).toInstant()
            );
        }
    }

    private static final class ActionStats {
        private final UUID missionId;
        private final String code;
        private final String name;
        private final String description;
        private int helpfulCount;
        private int avoidedImmediateSmokingCount;
        private Instant latestHelpfulAt;

        private ActionStats(NextTimeSession session) {
            this.missionId = session.getRecommendedMission().getId();
            this.code = session.getMissionCodeSnapshot();
            this.name = session.getMissionNameSnapshot();
            this.description = session.getMissionDescriptionSnapshot();
            this.latestHelpfulAt = Instant.MIN;
        }

        private static ActionStats from(NextTimeSession session) {
            return new ActionStats(session);
        }

        private void add(NextTimeSession session) {
            helpfulCount++;
            if (session.getResult() == NOT_SMOKED || session.getResult() == DELAYED) {
                avoidedImmediateSmokingCount++;
            }
            if (session.getResultRecordedAt().isAfter(latestHelpfulAt)) {
                latestHelpfulAt = session.getResultRecordedAt();
            }
        }

        private int helpfulCount() {
            return helpfulCount;
        }

        private int avoidedImmediateSmokingCount() {
            return avoidedImmediateSmokingCount;
        }

        private Instant latestHelpfulAt() {
            return latestHelpfulAt;
        }

        private NextAction toResponse() {
            return new NextAction(
                    missionId,
                    code,
                    name,
                    description,
                    "오늘은 " + name + " 행동이 흡연 욕구를 넘기는 데 가장 도움이 됐어요."
            );
        }
    }
}
