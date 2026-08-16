package com.nextime.pattern.application;

import com.nextime.common.error.BusinessException;
import com.nextime.common.error.ErrorCode;
import com.nextime.mission.domain.Mission;
import com.nextime.nexttime.domain.CravingChange;
import com.nextime.nexttime.domain.MissionHelpfulness;
import com.nextime.nexttime.domain.NextTimeResult;
import com.nextime.nexttime.domain.NextTimeSession;
import com.nextime.nexttime.domain.NextTimeSessionRepository;
import com.nextime.pattern.api.PatternOverviewResponse;
import com.nextime.pattern.api.PatternOverviewResponse.*;
import com.nextime.smokingcontext.domain.SmokingContext;
import com.nextime.smokingcontext.domain.SmokingContextType;
import com.nextime.user.domain.User;
import com.nextime.user.domain.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static com.nextime.nexttime.domain.NextTimeSessionStatus.RESULT_RECORDED;

@Service
@RequiredArgsConstructor
public class PatternOverviewService {

    private static final String SUPPORTED_PERIOD = "7d";
    private static final ZoneId SERVICE_ZONE = ZoneId.of("Asia/Seoul");
    private static final int MINIMUM_PATTERN_RECORD_COUNT = 3;
    private static final int EFFECTIVE_ACTION_LIMIT = 2;
    private static final int FREQUENT_TRIGGER_LIMIT = 5;

    private final UserRepository userRepository;
    private final NextTimeSessionRepository sessionRepository;

    @Transactional(readOnly = true)
    public PatternOverviewResponse getOverview(UUID userId) {
        validateUser(userId);

        PeriodWindows windows = PeriodWindows.now();
        List<NextTimeSession> recentThirtyDayResults =
                sessionRepository.findByUser_IdAndStatusAndResultRecordedAtGreaterThanEqualOrderByResultRecordedAtDesc(
                        userId,
                        RESULT_RECORDED,
                        windows.thirtyDayStart()
                );
        List<NextTimeSession> recentThirtyDaySessions =
                sessionRepository.findByUser_IdAndCreatedAtGreaterThanEqualOrderByCreatedAtDesc(
                        userId,
                        windows.thirtyDayStart()
                );
        List<NextTimeSession> current = inResultWindow(
                recentThirtyDayResults,
                windows.currentStart(),
                windows.currentEnd()
        );
        List<NextTimeSession> previous = inResultWindow(
                recentThirtyDayResults,
                windows.previousStart(),
                windows.currentStart()
        );

        if (current.size() < MINIMUM_PATTERN_RECORD_COUNT) {
            return insufficientOverview(windows, current.size());
        }

        List<NextTimeSession> recentRecords =
                sessionRepository.findTop3ByUser_IdAndStatusOrderByResultRecordedAtDesc(userId, RESULT_RECORDED);

        return new PatternOverviewResponse(
                new Period(SUPPORTED_PERIOD, windows.currentStart(), windows.currentEnd()),
                DataStatus.AVAILABLE,
                current.size(),
                buildInsight(current, recentThirtyDaySessions),
                buildBehaviorChange(current, previous),
                buildEffectiveActions(recentThirtyDayResults),
                rankContexts(current, SmokingContextType.TRIGGER, FREQUENT_TRIGGER_LIMIT),
                recentRecords.stream().map(this::toRecentRecord).toList()
        );
    }

    private PatternOverviewResponse insufficientOverview(PeriodWindows windows, int recentResultCount) {
        return new PatternOverviewResponse(
                new Period(SUPPORTED_PERIOD, windows.currentStart(), windows.currentEnd()),
                DataStatus.INSUFFICIENT,
                recentResultCount,
                null,
                null,
                List.of(),
                List.of(),
                List.of()
        );
    }

    private void validateUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_REGISTERED));
        if (!user.isOnboardingCompleted()) {
            throw new BusinessException(
                    ErrorCode.CONFLICT,
                    "온보딩을 완료한 후 내 패턴을 확인할 수 있습니다."
            );
        }
    }

    private List<NextTimeSession> inResultWindow(
            List<NextTimeSession> sessions,
            Instant fromInclusive,
            Instant toExclusive
    ) {
        return sessions.stream()
                .filter(session -> isInWindow(session.getResultRecordedAt(), fromInclusive, toExclusive))
                .toList();
    }

    private boolean isInWindow(Instant value, Instant fromInclusive, Instant toExclusive) {
        return value != null && !value.isBefore(fromInclusive) && value.isBefore(toExclusive);
    }

    private Insight buildInsight(
            List<NextTimeSession> current,
            List<NextTimeSession> recentThirtyDaySessions
    ) {
        if (current.isEmpty()) {
            return null;
        }

        ContextCount topTrigger = current.size() >= 2
                ? firstOrNull(rankContexts(current, SmokingContextType.TRIGGER, 1))
                : null;
        ContextCount topLocation = current.size() >= 2
                ? firstOrNull(rankContexts(current, SmokingContextType.LOCATION, 1))
                : null;
        TimeSlot topTimeSlot = calculateTopTimeSlot(recentThirtyDaySessions);

        return new Insight(current.size(), topTrigger, topLocation, topTimeSlot);
    }

    private ContextCount firstOrNull(List<ContextCount> contexts) {
        return contexts.isEmpty() ? null : contexts.getFirst();
    }

    private BehaviorChange buildBehaviorChange(
            List<NextTimeSession> current,
            List<NextTimeSession> previous
    ) {
        if (current.isEmpty() && previous.isEmpty()) {
            return null;
        }

        PeriodResult currentResult = summarizeResults(current);
        PeriodResult previousResult = summarizeResults(previous);
        return new BehaviorChange(previousResult, currentResult, compare(previousResult, currentResult));
    }

    private PeriodResult summarizeResults(List<NextTimeSession> sessions) {
        long avoided = sessions.stream()
                .filter(session -> avoidsImmediateSmoking(session.getResult()))
                .count();
        return new PeriodResult(sessions.size(), avoided);
    }

    private ChangeDirection compare(PeriodResult previous, PeriodResult current) {
        if (previous.totalCount() == 0 || current.totalCount() == 0) {
            return ChangeDirection.NO_COMPARISON;
        }

        double previousRate = (double) previous.avoidedImmediateSmokingCount() / previous.totalCount();
        double currentRate = (double) current.avoidedImmediateSmokingCount() / current.totalCount();
        int comparison = Double.compare(currentRate, previousRate);
        if (comparison > 0) {
            return ChangeDirection.INCREASED;
        }
        if (comparison < 0) {
            return ChangeDirection.DECREASED;
        }
        return ChangeDirection.SAME;
    }

    private boolean avoidsImmediateSmoking(NextTimeResult result) {
        return result == NextTimeResult.NOT_SMOKED || result == NextTimeResult.DELAYED;
    }

    private List<ContextCount> rankContexts(
            List<NextTimeSession> sessions,
            SmokingContextType type,
            int limit
    ) {
        Map<ContextIdentity, ContextStat> stats = new HashMap<>();
        for (NextTimeSession session : sessions) {
            SmokingContext context = session.contextOf(type);
            ContextIdentity identity = new ContextIdentity(context.getId(), context.getCode(), context.getName());
            ContextStat stat = stats.computeIfAbsent(identity, ignored -> new ContextStat());
            stat.count++;
            Instant occurredAt = session.getResultRecordedAt();
            if (stat.latest == null || occurredAt.isAfter(stat.latest)) {
                stat.latest = occurredAt;
            }
        }

        return stats.entrySet().stream()
                .sorted(Comparator
                        .<Map.Entry<ContextIdentity, ContextStat>>comparingLong(entry -> entry.getValue().count)
                        .reversed()
                        .thenComparing(entry -> entry.getValue().latest, Comparator.reverseOrder()))
                .limit(limit)
                .map(entry -> new ContextCount(
                        entry.getKey().id(),
                        entry.getKey().code(),
                        entry.getKey().name(),
                        entry.getValue().count
                ))
                .toList();
    }

    private TimeSlot calculateTopTimeSlot(List<NextTimeSession> sessions) {
        List<NextTimeSession> sessionsWithTime = sessions.stream()
                .filter(session -> session.getCreatedAt() != null)
                .toList();
        if (sessionsWithTime.size() < 3) {
            return null;
        }

        Map<Integer, TimeSlotStat> stats = new HashMap<>();
        for (NextTimeSession session : sessionsWithTime) {
            ZonedDateTime occurredAt = session.getCreatedAt().atZone(SERVICE_ZONE);
            int startHour = (occurredAt.getHour() / 2) * 2;
            TimeSlotStat stat = stats.computeIfAbsent(startHour, ignored -> new TimeSlotStat());
            stat.count++;
            if (stat.latest == null || session.getCreatedAt().isAfter(stat.latest)) {
                stat.latest = session.getCreatedAt();
            }
        }

        Map.Entry<Integer, TimeSlotStat> top = stats.entrySet().stream()
                .sorted(Comparator
                        .<Map.Entry<Integer, TimeSlotStat>>comparingLong(entry -> entry.getValue().count)
                        .reversed()
                        .thenComparing(entry -> entry.getValue().latest, Comparator.reverseOrder()))
                .findFirst()
                .orElseThrow();

        return new TimeSlot(top.getKey(), top.getKey() + 2, top.getValue().count);
    }

    private List<EffectiveAction> buildEffectiveActions(List<NextTimeSession> sessions) {
        Map<MissionIdentity, ActionStat> stats = new HashMap<>();
        for (NextTimeSession session : sessions) {
            if (session.getMissionHelpfulness() == null || session.getRecommendedMission() == null) {
                continue;
            }
            Mission mission = session.getRecommendedMission();
            MissionIdentity identity = new MissionIdentity(
                    mission.getId(),
                    session.getMissionCodeSnapshot(),
                    session.getMissionNameSnapshot()
            );
            ActionStat stat = stats.computeIfAbsent(identity, ignored -> new ActionStat());
            stat.evaluationCount++;
            stat.resultCount++;
            if (session.getMissionHelpfulness() == MissionHelpfulness.HELPFUL) {
                stat.helpfulCount++;
                if (stat.latestHelpful == null || session.getResultRecordedAt().isAfter(stat.latestHelpful)) {
                    stat.latestHelpful = session.getResultRecordedAt();
                }
            }
            if (avoidsImmediateSmoking(session.getResult())) {
                stat.avoidedImmediateSmokingCount++;
            }
        }

        List<ActionRanking> rankings = new ArrayList<>();
        for (Map.Entry<MissionIdentity, ActionStat> entry : stats.entrySet()) {
            ActionStat stat = entry.getValue();
            double helpfulRate = (double) stat.helpfulCount / stat.evaluationCount;
            if (stat.evaluationCount >= 2 && helpfulRate > 0.5) {
                rankings.add(new ActionRanking(entry.getKey(), stat, helpfulRate));
            }
        }

        return rankings.stream()
                .sorted(Comparator
                        .comparingDouble(ActionRanking::helpfulRate)
                        .reversed()
                        .thenComparing(
                                ranking -> ranking.stat().evaluationCount,
                                Comparator.reverseOrder()
                        )
                        .thenComparing(
                                ranking -> ranking.stat().latestHelpful,
                                Comparator.nullsLast(Comparator.reverseOrder())
                        ))
                .limit(EFFECTIVE_ACTION_LIMIT)
                .map(this::toEffectiveAction)
                .toList();
    }

    private EffectiveAction toEffectiveAction(ActionRanking ranking) {
        MissionIdentity mission = ranking.mission();
        ActionStat stat = ranking.stat();
        double roundedRate = Math.round(ranking.helpfulRate() * 10_000.0) / 10_000.0;
        return new EffectiveAction(
                mission.id(),
                mission.code(),
                mission.name(),
                stat.evaluationCount,
                stat.helpfulCount,
                roundedRate,
                stat.resultCount,
                stat.avoidedImmediateSmokingCount
        );
    }

    private RecentRecord toRecentRecord(NextTimeSession session) {
        SmokingContext trigger = session.contextOf(SmokingContextType.TRIGGER);
        Mission mission = session.getRecommendedMission();
        return new RecentRecord(
                session.getId(),
                session.getResultRecordedAt(),
                new ContextSummary(trigger.getId(), trigger.getCode(), trigger.getName()),
                new MissionSummary(
                        mission.getId(),
                        session.getMissionCodeSnapshot(),
                        session.getMissionNameSnapshot()
                ),
                session.getResult(),
                session.getCravingBefore(),
                session.getCravingAfter(),
                CravingChange.between(session.getCravingBefore(), session.getCravingAfter())
        );
    }

    private record ContextIdentity(UUID id, String code, String name) {
    }

    private record MissionIdentity(UUID id, String code, String name) {
    }

    private record ActionRanking(MissionIdentity mission, ActionStat stat, double helpfulRate) {
    }

    private static final class ContextStat {
        private long count;
        private Instant latest;
    }

    private static final class TimeSlotStat {
        private long count;
        private Instant latest;
    }

    private static final class ActionStat {
        private long evaluationCount;
        private long helpfulCount;
        private long resultCount;
        private long avoidedImmediateSmokingCount;
        private Instant latestHelpful;
    }

    private record PeriodWindows(
            Instant previousStart,
            Instant currentStart,
            Instant currentEnd,
            Instant thirtyDayStart
    ) {
        private static PeriodWindows now() {
            LocalDate today = LocalDate.now(SERVICE_ZONE);
            Instant currentStart = today.minusDays(6).atStartOfDay(SERVICE_ZONE).toInstant();
            Instant currentEnd = today.plusDays(1).atStartOfDay(SERVICE_ZONE).toInstant();
            Instant previousStart = today.minusDays(13).atStartOfDay(SERVICE_ZONE).toInstant();
            Instant thirtyDayStart = today.minusDays(29).atStartOfDay(SERVICE_ZONE).toInstant();
            return new PeriodWindows(previousStart, currentStart, currentEnd, thirtyDayStart);
        }
    }
}
