package com.nextime.nexttime.api;

import com.nextime.nexttime.domain.NextTimeSession;
import com.nextime.nexttime.domain.NextTimeSessionStatus;
import com.nextime.nexttime.domain.RecommendationSource;

import java.time.Instant;
import java.util.UUID;

public record MissionRecommendationResponse(
        UUID sessionId,
        NextTimeSessionStatus status,
        MissionSummary mission,
        String reason,
        RecommendationSource source,
        Instant recommendedAt
) {
    public static MissionRecommendationResponse from(NextTimeSession session) {
        return new MissionRecommendationResponse(
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
                session.getRecommendationReason(),
                session.getRecommendationSource(),
                session.getRecommendedAt()
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
