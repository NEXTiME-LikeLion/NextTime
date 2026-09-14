package com.nextime.pattern.application;

import com.nextime.common.error.BusinessException;
import com.nextime.common.error.ErrorCode;
import com.nextime.mission.domain.Mission;
import com.nextime.mission.domain.MissionRepository;
import com.nextime.nexttime.domain.CravingChange;
import com.nextime.nexttime.domain.NextTimeResult;
import com.nextime.nexttime.domain.NextTimeSession;
import com.nextime.nexttime.domain.NextTimeSessionRepository;
import com.nextime.nexttime.recommendation.application.MissionRecommendationService;
import com.nextime.pattern.api.PatternOverviewResponse;
import com.nextime.pattern.api.PatternOverviewResponse.*;
import com.nextime.smokingcontext.domain.SmokingContext;
import com.nextime.smokingcontext.domain.SmokingContextType;
import com.nextime.smokingrecord.domain.SmokingRecord;
import com.nextime.smokingrecord.domain.SmokingRecordRepository;
import com.nextime.user.domain.User;
import com.nextime.user.domain.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;

import static com.nextime.nexttime.domain.NextTimeSessionStatus.RESULT_RECORDED;

@Service
@RequiredArgsConstructor
public class PatternOverviewService {
    private static final ZoneId SERVICE_ZONE = ZoneId.of("Asia/Seoul");
    private static final int REQUIRED_RESULT_COUNT = 5;
    private static final int MINIMUM_RANKING_SAMPLE = 3;
    private static final int DETAIL_RANKING_LIMIT = 6;

    private final UserRepository userRepository;
    private final NextTimeSessionRepository sessionRepository;
    private final SmokingRecordRepository smokingRecordRepository;
    private final MissionRepository missionRepository;
    private final MissionRecommendationService recommendationService;

    @Transactional(readOnly = true)
    public PatternOverviewResponse getOverview(UUID userId) {
        validateUser(userId);
        PeriodWindows windows = PeriodWindows.now();
        long completedCount = sessionRepository.countByUser_IdAndStatus(userId, RESULT_RECORDED);
        List<ActionCatalogItem> catalog = buildActionCatalog();

        if (completedCount < REQUIRED_RESULT_COUNT) {
            return new PatternOverviewResponse(
                    DataStatus.INSUFFICIENT, completedCount, REQUIRED_RESULT_COUNT, windows.toResponse(),
                    null, null, null, List.of(), List.of(), catalog
            );
        }

        PeriodData current = loadPeriod(userId, windows.currentStart(), windows.currentEnd());
        PeriodData previous = loadPeriod(userId, windows.previousStart(), windows.previousEnd());
        boolean comparisonAvailable = current.trackedDays().size() >= 3 && previous.trackedDays().size() >= 3;
        List<RankedContext> contexts = rankContexts(current.sessions());
        List<RankedAction> actions = rankActions(current.sessions());

        return new PatternOverviewResponse(
                DataStatus.AVAILABLE, completedCount, REQUIRED_RESULT_COUNT, windows.toResponse(),
                buildSmokingAmount(current, previous, comparisonAvailable, windows.currentStartDate()),
                buildSmokingTime(current.events(), previous.events(), comparisonAvailable, windows.currentStartDate()),
                buildBriefing(userId, current.sessions(), contexts), contexts, actions, catalog
        );
    }

    private PeriodData loadPeriod(UUID userId, Instant from, Instant to) {
        List<NextTimeSession> sessions = sessionRepository
                .findByUser_IdAndStatusAndResultRecordedAtGreaterThanEqualAndResultRecordedAtLessThanOrderByResultRecordedAtDesc(
                        userId, RESULT_RECORDED, from, to);
        List<SmokingRecord> manual = smokingRecordRepository
                .findByUser_IdAndSmokedAtGreaterThanEqualAndSmokedAtLessThan(userId, from, to);
        return new PeriodData(sessions, manual, buildSmokingEvents(sessions, manual), trackedDays(sessions, manual));
    }

    private List<SmokingEvent> buildSmokingEvents(List<NextTimeSession> sessions, List<SmokingRecord> manual) {
        Stream<SmokingEvent> manualEvents = manual.stream().map(r -> new SmokingEvent(r.getSmokedAt()));
        Stream<SmokingEvent> sessionEvents = sessions.stream()
                .filter(s -> s.getResult() == NextTimeResult.SMOKED || s.getResult() == NextTimeResult.DELAYED)
                .filter(s -> s.getResultRecordedAt() != null)
                .map(s -> new SmokingEvent(s.getResultRecordedAt()));
        return Stream.concat(manualEvents, sessionEvents).sorted(Comparator.comparing(SmokingEvent::at)).toList();
    }

    private Set<LocalDate> trackedDays(List<NextTimeSession> sessions, List<SmokingRecord> manual) {
        return Stream.concat(
                sessions.stream().map(NextTimeSession::getResultRecordedAt),
                manual.stream().map(SmokingRecord::getSmokedAt)
        ).filter(Objects::nonNull).map(i -> i.atZone(SERVICE_ZONE).toLocalDate()).collect(Collectors.toSet());
    }

    private SmokingAmount buildSmokingAmount(PeriodData current, PeriodData previous,
                                               boolean comparable, LocalDate weekStart) {
        double currentAverage = average(current.events().size(), current.trackedDays().size());
        Double previousAverage = comparable ? average(previous.events().size(), previous.trackedDays().size()) : null;
        Double reduction = comparable ? round(previousAverage - currentAverage) : null;
        ChangeDirection direction = !comparable ? ChangeDirection.NO_COMPARISON
                : reduction > 0 ? ChangeDirection.DECREASED
                : reduction < 0 ? ChangeDirection.INCREASED : ChangeDirection.SAME;
        String message = comparable
                ? "지난주 평균 " + previousAverage + "개비에서 이번 주 평균 " + currentAverage + "개비로 "
                + (direction == ChangeDirection.DECREASED ? "줄었어요." : direction == ChangeDirection.INCREASED ? "늘었어요." : "같아요.")
                : null;
        return new SmokingAmount(comparable, current.trackedDays().size(), previous.trackedDays().size(),
                currentAverage, previousAverage, reduction, direction, message,
                dailyCounts(weekStart, current.events(), current.trackedDays()));
    }

    private List<DailySmokingCount> dailyCounts(LocalDate weekStart, List<SmokingEvent> events,
                                                 Set<LocalDate> trackedDays) {
        Map<LocalDate, Long> counts = events.stream().collect(Collectors.groupingBy(
                e -> e.at().atZone(SERVICE_ZONE).toLocalDate(), Collectors.counting()));
        LocalDate today = LocalDate.now(SERVICE_ZONE);
        return IntStream.range(0, 7).mapToObj(weekStart::plusDays).map(date -> {
            boolean tracked = !date.isAfter(today) && trackedDays.contains(date);
            return new DailySmokingCount(date, date.getDayOfWeek(), tracked,
                    tracked ? counts.getOrDefault(date, 0L) : null);
        }).toList();
    }

    private SmokingTime buildSmokingTime(List<SmokingEvent> current, List<SmokingEvent> previous,
                                          boolean comparable, LocalDate weekStart) {
        List<TimeSlot> slots = timeSlots(current);
        TimeSlot currentPeak = primarySlot(slots);
        TimeSlot previousPeak = comparable ? primarySlot(timeSlots(previous)) : null;
        String message = comparable && currentPeak != null && previousPeak != null
                ? "가장 많이 피운 시간대가 지난주 " + label(previousPeak) + "에서 이번 주 " + label(currentPeak) + "로 바뀌었어요."
                : null;
        return new SmokingTime(comparable, previousPeak, currentPeak, slots,
                dailyPrimaryHours(weekStart, current), message);
    }

    private List<TimeSlot> timeSlots(List<SmokingEvent> events) {
        Map<Integer, Long> counts = events.stream().collect(Collectors.groupingBy(
                e -> (e.at().atZone(SERVICE_ZONE).getHour() / 3) * 3, Collectors.counting()));
        return IntStream.range(0, 8).map(i -> i * 3)
                .mapToObj(h -> new TimeSlot(h, h + 3, counts.getOrDefault(h, 0L))).toList();
    }

    private TimeSlot primarySlot(List<TimeSlot> slots) {
        return slots.stream().filter(s -> s.count() > 0)
                .max(Comparator.comparingLong(TimeSlot::count).thenComparingInt(TimeSlot::startHour)).orElse(null);
    }

    private List<DailyPrimaryHour> dailyPrimaryHours(LocalDate weekStart, List<SmokingEvent> events) {
        Map<LocalDate, List<SmokingEvent>> byDate = events.stream().collect(Collectors.groupingBy(
                e -> e.at().atZone(SERVICE_ZONE).toLocalDate()));
        return IntStream.range(0, 7).mapToObj(weekStart::plusDays).map(date -> {
            Map<Integer, Long> hours = byDate.getOrDefault(date, List.of()).stream().collect(Collectors.groupingBy(
                    e -> e.at().atZone(SERVICE_ZONE).getHour(), Collectors.counting()));
            var peak = hours.entrySet().stream().max(Map.Entry.<Integer, Long>comparingByValue()
                    .thenComparing(Map.Entry.comparingByKey())).orElse(null);
            return new DailyPrimaryHour(date, date.getDayOfWeek(), peak == null ? null : peak.getKey(),
                    peak == null ? 0 : peak.getValue());
        }).toList();
    }

    private List<RankedContext> rankContexts(List<NextTimeSession> sessions) {
        Map<ContextIdentity, SuccessStat> stats = new HashMap<>();
        for (NextTimeSession session : sessions) {
            SmokingContext trigger = contextOrNull(session, SmokingContextType.TRIGGER);
            if (trigger == null) continue;
            SuccessStat stat = stats.computeIfAbsent(new ContextIdentity(trigger.getId(), trigger.getCode(), trigger.getName()), k -> new SuccessStat());
            stat.add(session.getResult() == NextTimeResult.NOT_SMOKED || session.getResult() == NextTimeResult.DELAYED,
                    session.getResultRecordedAt());
        }
        List<Map.Entry<ContextIdentity, SuccessStat>> ranked = rank(stats).stream().limit(DETAIL_RANKING_LIMIT).toList();
        return IntStream.range(0, ranked.size()).mapToObj(i -> {
            var e = ranked.get(i); var c = e.getKey(); var s = e.getValue();
            return new RankedContext(i + 1, new ContextSummary(c.id(), c.code(), c.name()),
                    s.success, s.total, percent(s));
        }).toList();
    }

    private List<RankedAction> rankActions(List<NextTimeSession> sessions) {
        Map<MissionIdentity, SuccessStat> stats = new HashMap<>();
        for (NextTimeSession session : sessions) {
            Mission mission = session.getRecommendedMission();
            if (mission == null || session.getMissionCompletedAt() == null) continue;
            CravingChange change = CravingChange.between(session.getCravingBefore(), session.getCravingAfter());
            SuccessStat stat = stats.computeIfAbsent(new MissionIdentity(mission.getId(), session.getMissionCodeSnapshot(), session.getMissionNameSnapshot()), k -> new SuccessStat());
            stat.add(change == CravingChange.DECREASED, session.getResultRecordedAt());
        }
        List<Map.Entry<MissionIdentity, SuccessStat>> ranked = rank(stats).stream().limit(DETAIL_RANKING_LIMIT).toList();
        return IntStream.range(0, ranked.size()).mapToObj(i -> {
            var e = ranked.get(i); var m = e.getKey(); var s = e.getValue();
            return new RankedAction(i + 1, new MissionSummary(m.id(), m.code(), m.name()),
                    s.success, s.total, percent(s));
        }).toList();
    }

    private <K> List<Map.Entry<K, SuccessStat>> rank(Map<K, SuccessStat> stats) {
        return stats.entrySet().stream().filter(e -> e.getValue().total >= MINIMUM_RANKING_SAMPLE)
                .sorted(Comparator.<Map.Entry<K, SuccessStat>>comparingDouble(e -> e.getValue().rate()).reversed()
                        .thenComparing(e -> e.getValue().total, Comparator.reverseOrder())
                        .thenComparing(e -> e.getValue().latest, Comparator.nullsLast(Comparator.reverseOrder())))
                .toList();
    }

    private ReductionBriefing buildBriefing(UUID userId, List<NextTimeSession> sessions,
                                              List<RankedContext> contexts) {
        if (contexts.isEmpty()) return null;
        UUID triggerId = contexts.getFirst().context().id();
        NextTimeSession representative = sessions.stream()
                .filter(s -> { SmokingContext c = contextOrNull(s, SmokingContextType.TRIGGER); return c != null && c.getId().equals(triggerId); })
                .filter(s -> contextOrNull(s, SmokingContextType.LOCATION) != null && s.getCravingBefore() != null)
                .findFirst().orElse(null);
        if (representative == null) return null;
        SmokingContext location = contextOrNull(representative, SmokingContextType.LOCATION);
        SmokingContext trigger = contextOrNull(representative, SmokingContextType.TRIGGER);
        Mission mission = recommendationService.preview(userId, location, trigger, representative.getCravingBefore()).mission();
        MissionSummary action = new MissionSummary(mission.getId(), mission.getCode(), mission.getName());
        return new ReductionBriefing(contexts.getFirst().context(), action,
                "이번 주에는 " + trigger.getName() + " " + mission.getName() + "로 감연해보세요.");
    }

    private List<ActionCatalogItem> buildActionCatalog() {
        return missionRepository.findAllByOrderByDisplayOrderAsc().stream()
                .map(m -> new ActionCatalogItem(m.getId(), m.getCode(), m.getName(), m.isActive(), m.getDisplayOrder()))
                .toList();
    }

    private SmokingContext contextOrNull(NextTimeSession session, SmokingContextType type) {
        return session.getContexts().stream().filter(c -> c.getContextType() == type).findFirst().orElse(null);
    }

    private void validateUser(UUID userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_REGISTERED));
        if (!user.isOnboardingCompleted()) throw new BusinessException(ErrorCode.CONFLICT, "온보딩을 완료한 후 내 패턴을 확인할 수 있습니다.");
    }

    private double average(long count, int days) { return days == 0 ? 0.0 : round((double) count / days); }
    private double round(double value) { return Math.round(value * 10.0) / 10.0; }
    private double percent(SuccessStat stat) { return round(stat.rate() * 100.0); }
    private String label(TimeSlot slot) { return slot.startHour() + "~" + slot.endHour() + "시"; }

    private record SmokingEvent(Instant at) {}
    private record PeriodData(List<NextTimeSession> sessions, List<SmokingRecord> manual,
                              List<SmokingEvent> events, Set<LocalDate> trackedDays) {}
    private record ContextIdentity(UUID id, String code, String name) {}
    private record MissionIdentity(UUID id, String code, String name) {}
    private static final class SuccessStat {
        long success; long total; Instant latest;
        void add(boolean succeeded, Instant at) { total++; if (succeeded) success++; if (at != null && (latest == null || at.isAfter(latest))) latest = at; }
        double rate() { return total == 0 ? 0.0 : (double) success / total; }
    }
    private record PeriodWindows(Instant previousStart, Instant previousEnd,
                                 Instant currentStart, Instant currentEnd) {
        static PeriodWindows now() {
            ZonedDateTime now = ZonedDateTime.now(SERVICE_ZONE);
            ZonedDateTime currentStart = now.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
                    .toLocalDate().atStartOfDay(SERVICE_ZONE);
            return new PeriodWindows(currentStart.minusWeeks(1).toInstant(), now.minusWeeks(1).toInstant(),
                    currentStart.toInstant(), now.toInstant());
        }
        LocalDate currentStartDate() { return currentStart.atZone(SERVICE_ZONE).toLocalDate(); }
        PatternOverviewResponse.Period toResponse() {
            return new PatternOverviewResponse.Period(
                    SERVICE_ZONE.getId(), currentStart, currentEnd, previousStart, previousEnd
            );
        }
    }
}
