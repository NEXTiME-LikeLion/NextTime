package com.nextime.nexttime.mission.api;

import com.nextime.nexttime.domain.NextTimeSession;
import com.nextime.nexttime.domain.NextTimeSessionStatus;

import java.time.Instant;
import java.util.UUID;

public record MissionCompletionResponse(
        UUID sessionId,
        NextTimeSessionStatus status,
        MissionSummary mission,
        Instant startedAt,
        Instant completedAt
) {
    public static MissionCompletionResponse from(NextTimeSession session) {
        return new MissionCompletionResponse(
                session.getId(),
                session.getStatus(),
                new MissionSummary(
                        session.getRecommendedMission().getId(),
                        session.getMissionCodeSnapshot(),
                        session.getMissionNameSnapshot(),
                        session.getCompletionCriteriaSnapshot()
                ),
                session.getMissionStartedAt(),
                session.getMissionCompletedAt()
        );
    }

    public record MissionSummary(
            UUID id,
            String code,
            String name,
            String completionCriteria
    ) {
    }
}
