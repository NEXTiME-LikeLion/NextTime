package com.nextime.nexttime.api;

import com.nextime.nexttime.domain.NextTimeSession;
import com.nextime.nexttime.domain.NextTimeSessionStatus;
import com.nextime.nexttime.domain.CravingBefore;
import com.nextime.smokingcontext.domain.SmokingContext;

import java.time.Instant;
import java.util.UUID;

public record NextTimeContextResponse(
        UUID sessionId,
        NextTimeSessionStatus status,
        CravingBefore cravingBefore,
        ContextSummaryResponse location,
        ContextSummaryResponse trigger,
        Instant contextSavedAt
) {
    public static NextTimeContextResponse from(
            NextTimeSession session,
            SmokingContext location,
            SmokingContext trigger
    ) {
        return new NextTimeContextResponse(
                session.getId(),
                session.getStatus(),
                session.getCravingBefore(),
                ContextSummaryResponse.from(location),
                ContextSummaryResponse.from(trigger),
                session.getContextSavedAt()
        );
    }
}
