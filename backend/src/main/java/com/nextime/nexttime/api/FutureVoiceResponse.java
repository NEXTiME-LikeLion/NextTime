package com.nextime.nexttime.api;

import com.nextime.nexttime.domain.FutureVoiceSource;
import com.nextime.nexttime.domain.NextTimeSession;
import com.nextime.nexttime.domain.NextTimeSessionStatus;

import java.time.Instant;
import java.util.UUID;

public record FutureVoiceResponse(
        UUID sessionId,
        NextTimeSessionStatus status,
        String futureHook,
        String acknowledge,
        String futureReason,
        String closing,
        FutureVoiceSource source,
        Instant generatedAt
) {
    public static FutureVoiceResponse from(NextTimeSession session) {
        return new FutureVoiceResponse(
                session.getId(),
                session.getStatus(),
                session.getFutureVoiceHook(),
                session.getFutureVoiceAcknowledge(),
                session.getFutureVoiceReason(),
                session.getFutureVoiceClosing(),
                session.getFutureVoiceSource(),
                session.getFutureVoiceGeneratedAt()
        );
    }
}
