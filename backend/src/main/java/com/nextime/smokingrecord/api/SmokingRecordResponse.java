package com.nextime.smokingrecord.api;

import com.nextime.smokingcontext.domain.SmokingContext;
import com.nextime.smokingrecord.domain.SmokingRecord;

import java.time.Instant;
import java.util.UUID;

public record SmokingRecordResponse(
        UUID recordId,
        Instant smokedAt,
        TriggerResponse trigger,
        Instant createdAt
) {
    public static SmokingRecordResponse from(SmokingRecord record) {
        SmokingContext trigger = record.triggerOrNull();
        return new SmokingRecordResponse(
                record.getId(),
                record.getSmokedAt(),
                trigger == null ? null : TriggerResponse.from(trigger),
                record.getCreatedAt()
        );
    }

    public record TriggerResponse(UUID id, String code, String name) {
        private static TriggerResponse from(SmokingContext context) {
            return new TriggerResponse(context.getId(), context.getCode(), context.getName());
        }
    }
}
