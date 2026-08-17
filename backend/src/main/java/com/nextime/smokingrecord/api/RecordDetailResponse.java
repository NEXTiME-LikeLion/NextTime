package com.nextime.smokingrecord.api;

import com.nextime.mission.domain.Mission;
import com.nextime.nexttime.domain.CravingAfter;
import com.nextime.nexttime.domain.CravingBefore;
import com.nextime.nexttime.domain.CravingChange;
import com.nextime.nexttime.domain.MissionHelpfulness;
import com.nextime.nexttime.domain.NextTimeResult;
import com.nextime.nexttime.domain.NextTimeSession;
import com.nextime.smokingcontext.domain.SmokingContext;
import com.nextime.smokingcontext.domain.SmokingContextType;
import com.nextime.smokingrecord.domain.SmokingRecord;

import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

public record RecordDetailResponse(
        UUID recordId,
        RecordType recordType,
        Instant recordedAt,
        ContextResponse trigger,
        ContextResponse location,
        MissionResponse mission,
        NextTimeResult result,
        CravingBefore cravingBefore,
        CravingAfter cravingAfter,
        CravingChange cravingChange,
        Instant missionStartedAt,
        Instant missionCompletedAt,
        Long missionDurationSeconds,
        MissionHelpfulness missionHelpfulness,
        String feedback
) {
    public enum RecordType {
        NEXT_TIME,
        MANUAL_SMOKING
    }

    public static RecordDetailResponse from(SmokingRecord record) {
        return new RecordDetailResponse(
                record.getId(),
                RecordType.MANUAL_SMOKING,
                record.getSmokedAt(),
                ContextResponse.from(record.triggerOrNull()),
                null,
                null,
                NextTimeResult.SMOKED,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null
        );
    }

    public static RecordDetailResponse from(NextTimeSession session) {
        SmokingContext trigger = contextOrNull(session, SmokingContextType.TRIGGER);
        SmokingContext location = contextOrNull(session, SmokingContextType.LOCATION);
        return new RecordDetailResponse(
                session.getId(),
                RecordType.NEXT_TIME,
                session.getResultRecordedAt(),
                ContextResponse.from(trigger),
                ContextResponse.from(location),
                MissionResponse.from(session),
                session.getResult(),
                session.getCravingBefore(),
                session.getCravingAfter(),
                CravingChange.between(session.getCravingBefore(), session.getCravingAfter()),
                session.getMissionStartedAt(),
                session.getMissionCompletedAt(),
                durationSeconds(session.getMissionStartedAt(), session.getMissionCompletedAt()),
                session.getMissionHelpfulness(),
                session.getResultFeedback()
        );
    }

    private static SmokingContext contextOrNull(NextTimeSession session, SmokingContextType type) {
        return session.getContexts().stream()
                .filter(context -> context.getContextType() == type)
                .findFirst()
                .orElse(null);
    }

    private static Long durationSeconds(Instant startedAt, Instant completedAt) {
        if (startedAt == null || completedAt == null) {
            return null;
        }
        return Math.max(0, Duration.between(startedAt, completedAt).getSeconds());
    }

    public record ContextResponse(UUID id, String code, String name) {
        private static ContextResponse from(SmokingContext context) {
            return context == null
                    ? null
                    : new ContextResponse(context.getId(), context.getCode(), context.getName());
        }
    }

    public record MissionResponse(UUID id, String code, String name) {
        private static MissionResponse from(NextTimeSession session) {
            Mission mission = session.getRecommendedMission();
            if (mission == null) {
                return null;
            }
            return new MissionResponse(
                    mission.getId(),
                    session.getMissionCodeSnapshot(),
                    session.getMissionNameSnapshot()
            );
        }
    }
}
