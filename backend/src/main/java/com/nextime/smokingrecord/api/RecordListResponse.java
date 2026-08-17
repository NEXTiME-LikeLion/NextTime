package com.nextime.smokingrecord.api;

import com.nextime.mission.domain.Mission;
import com.nextime.nexttime.domain.CravingAfter;
import com.nextime.nexttime.domain.CravingBefore;
import com.nextime.nexttime.domain.CravingChange;
import com.nextime.nexttime.domain.NextTimeResult;
import com.nextime.nexttime.domain.NextTimeSession;
import com.nextime.smokingcontext.domain.SmokingContext;
import com.nextime.smokingcontext.domain.SmokingContextType;
import com.nextime.smokingrecord.domain.SmokingRecord;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record RecordListResponse(List<RecordItem> records) {

    public record RecordItem(
            UUID recordId,
            RecordDetailResponse.RecordType recordType,
            Instant recordedAt,
            ContextResponse trigger,
            ContextResponse location,
            MissionResponse mission,
            NextTimeResult result,
            CravingBefore cravingBefore,
            CravingAfter cravingAfter,
            CravingChange cravingChange
    ) {
        public static RecordItem from(SmokingRecord record) {
            return new RecordItem(
                    record.getId(),
                    RecordDetailResponse.RecordType.MANUAL_SMOKING,
                    record.getSmokedAt(),
                    ContextResponse.from(record.triggerOrNull()),
                    null,
                    null,
                    NextTimeResult.SMOKED,
                    null,
                    null,
                    null
            );
        }

        public static RecordItem from(NextTimeSession session) {
            return new RecordItem(
                    session.getId(),
                    RecordDetailResponse.RecordType.NEXT_TIME,
                    session.getResultRecordedAt(),
                    ContextResponse.from(contextOrNull(session, SmokingContextType.TRIGGER)),
                    ContextResponse.from(contextOrNull(session, SmokingContextType.LOCATION)),
                    MissionResponse.from(session),
                    session.getResult(),
                    session.getCravingBefore(),
                    session.getCravingAfter(),
                    CravingChange.between(session.getCravingBefore(), session.getCravingAfter())
            );
        }

        private static SmokingContext contextOrNull(NextTimeSession session, SmokingContextType type) {
            return session.getContexts().stream()
                    .filter(context -> context.getContextType() == type)
                    .findFirst()
                    .orElse(null);
        }
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
            return mission == null
                    ? null
                    : new MissionResponse(
                            mission.getId(),
                            session.getMissionCodeSnapshot(),
                            session.getMissionNameSnapshot()
                    );
        }
    }
}
