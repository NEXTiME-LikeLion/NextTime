package com.nextime.nexttime.mission.api;

import com.nextime.nexttime.domain.NextTimeSession;
import com.nextime.nexttime.domain.NextTimeSessionStatus;

import java.time.Instant;
import java.util.UUID;

public record MissionSkipResponse(
        UUID sessionId,
        NextTimeSessionStatus status,
        MissionSummary mission,
        Instant skippedAt
) {
    public static MissionSkipResponse from(NextTimeSession session) {
        return new MissionSkipResponse(
                session.getId(),
                session.getStatus(),
                new MissionSummary(
                        session.getRecommendedMission().getId(),
                        session.getMissionCodeSnapshot(),
                        session.getMissionNameSnapshot()
                ),
                session.getMissionSkippedAt()
        );
    }

    public record MissionSummary(UUID id, String code, String name) {
    }
}
