package com.nextime.pattern.api;

import com.nextime.nexttime.domain.CravingAfter;
import com.nextime.nexttime.domain.CravingBefore;
import com.nextime.nexttime.domain.CravingChange;
import com.nextime.nexttime.domain.NextTimeResult;
import com.nextime.smokingrecord.api.RecordDetailResponse.RecordType;

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
            boolean patternReady,
            String periodLabel,
            ContextCount topTrigger,
            ContextCount topLocation,
            CravingBefore representativeCraving,
            RecommendedAction recommendedAction,
            ActionEvidence actionEvidence,
            InsightMessages messages,
            TimeSlot topTimeSlot
    ) {
        public Insight(ContextCount topTrigger, ContextCount topLocation, TimeSlot topTimeSlot) {
            this(true, "최근 7일", topTrigger, topLocation, null, null, null, null, topTimeSlot);
        }
    }

    public record RecommendedAction(UUID id, String code, String name) {
    }

    public record ActionEvidence(
            long sampleCount,
            long notImmediateSmokingCount,
            String message
    ) {
    }

    public record InsightMessages(
            String mainPattern,
            String frequency,
            String representativeLocation,
            String nextAction
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
            RecordType recordType,
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
