package com.nextime.nexttime.futurevoice.api;

import com.nextime.ai.nextme.domain.NextBudTheme;
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
        NextBudTheme nextBudTheme,
        FutureVoiceSource source,
        Instant generatedAt
) {
    public static FutureVoiceResponse from(
            NextTimeSession session,
            NextBudTheme nextBudTheme
    ) {
        return new FutureVoiceResponse(
                session.getId(),
                session.getStatus(),
                session.getFutureVoiceHook(),
                session.getFutureVoiceAcknowledge(),
                session.getFutureVoiceReason(),
                session.getFutureVoiceClosing(),
                nextBudTheme,
                session.getFutureVoiceSource(),
                session.getFutureVoiceGeneratedAt()
        );
    }
}