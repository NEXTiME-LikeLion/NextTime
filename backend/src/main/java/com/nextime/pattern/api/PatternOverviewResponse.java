package com.nextime.pattern.api;

import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record PatternOverviewResponse(
        DataStatus dataStatus, long completedResultCount, int requiredResultCount, Period period,
        SmokingAmount smokingAmount, SmokingTime smokingTime, ReductionBriefing reductionBriefing,
        List<RankedContext> easyReductionContexts, List<RankedAction> effectiveActions,
        List<ActionCatalogItem> actionCatalog
) {
    public enum DataStatus { AVAILABLE, INSUFFICIENT }
    public enum ChangeDirection { INCREASED, DECREASED, SAME, NO_COMPARISON }
    public record Period(String timezone, Instant currentFrom, Instant currentTo,
                         Instant previousFrom, Instant previousTo) {}
    public record SmokingAmount(boolean comparisonAvailable, int currentTrackedDayCount,
                                int previousTrackedDayCount, double currentDailyAverage,
                                Double previousDailyAverage, Double reducedDailyAverage,
                                ChangeDirection direction, String comparisonMessage,
                                List<DailySmokingCount> dailyCounts) {}
    public record DailySmokingCount(LocalDate date, DayOfWeek dayOfWeek, boolean tracked, Long count) {}
    public record SmokingTime(boolean comparisonAvailable, TimeSlot previousPrimarySlot,
                              TimeSlot currentPrimarySlot, List<TimeSlot> currentSlots,
                              List<DailyPrimaryHour> dailyPrimaryHours, String comparisonMessage) {}
    public record TimeSlot(int startHour, int endHour, long count) {}
    public record DailyPrimaryHour(LocalDate date, DayOfWeek dayOfWeek, Integer hour, long count) {}
    public record ContextSummary(UUID id, String code, String name) {}
    public record MissionSummary(UUID id, String code, String name) {}
    public record ReductionBriefing(ContextSummary context, MissionSummary recommendedAction, String message) {}
    public record RankedContext(int rank, ContextSummary context, long successCount,
                                long totalCount, double successRatePercent) {}
    public record RankedAction(int rank, MissionSummary mission, long successCount,
                               long totalCount, double successRatePercent) {}
    public record ActionCatalogItem(UUID missionId, String code, String name,
                                    boolean active, short displayOrder) {}
}
