package com.nextime.pattern.api;

import com.nextime.nexttime.domain.CravingAfter;
import com.nextime.nexttime.domain.CravingBefore;
import com.nextime.nexttime.domain.CravingChange;
import com.nextime.nexttime.domain.NextTimeResult;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record PatternOverviewResponse(
        Period period,
        DataStatus dataStatus,
        int recentResultCount,
        Insight insight,
        BehaviorChange behaviorChange,
        List<EffectiveAction> effectiveActions,
        List<ContextCount> frequentTriggers,
        List<RecentRecord> recentRecords
) {
    public enum DataStatus {
        AVAILABLE,
        INSUFFICIENT
    }

    public enum ChangeDirection {
        INCREASED,
        DECREASED,
        SAME,
        NO_COMPARISON
    }

    public record Period(String value, Instant from, Instant to) {
    }

    public record Insight(
            int recentResultCount,
            ContextCount topTrigger,
            ContextCount topLocation,
            TimeSlot topTimeSlot
    ) {
    }

    public record ContextCount(UUID id, String code, String name, long count) {
    }

    public record TimeSlot(int startHour, int endHour, long count) {
    }

    public record BehaviorChange(
            PeriodResult previousPeriod,
            PeriodResult currentPeriod,
            ChangeDirection change
    ) {
    }

    public record PeriodResult(long totalCount, long avoidedImmediateSmokingCount) {
    }

    public record EffectiveAction(
            UUID missionId,
            String code,
            String name,
            long evaluationCount,
            long helpfulCount,
            double helpfulRate,
            long resultCount,
            long avoidedImmediateSmokingCount
    ) {
    }

    public record RecentRecord(
            UUID recordId,
            Instant recordedAt,
            ContextSummary trigger,
            MissionSummary mission,
            NextTimeResult result,
            CravingBefore cravingBefore,
            CravingAfter cravingAfter,
            CravingChange cravingChange
    ) {
    }

    public record ContextSummary(UUID id, String code, String name) {
    }

    public record MissionSummary(UUID id, String code, String name) {
    }
}
