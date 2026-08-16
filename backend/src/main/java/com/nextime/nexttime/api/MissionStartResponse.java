package com.nextime.nexttime.api;

import com.nextime.nexttime.domain.NextTimeSession;
import com.nextime.nexttime.domain.NextTimeSessionStatus;

import java.time.Instant;
import java.util.UUID;

public record MissionStartResponse(
        UUID sessionId,
        NextTimeSessionStatus status,
        MissionSummary mission,
        Instant startedAt
) {
    public static MissionStartResponse from(NextTimeSession session) {
        return new MissionStartResponse(
                session.getId(),
                session.getStatus(),
                new MissionSummary(
                        session.getRecommendedMission().getId(),
                        session.getMissionCodeSnapshot(),
                        session.getMissionNameSnapshot(),
                        session.getMissionDescriptionSnapshot(),
                        session.getCompletionCriteriaSnapshot(),
                        session.getEstimatedSecondsSnapshot()
                ),
                session.getMissionStartedAt()
        );
    }

    public record MissionSummary(
            UUID id,
            String code,
            String name,
            String description,
            String completionCriteria,
            int estimatedSeconds
    ) {
    }
}
