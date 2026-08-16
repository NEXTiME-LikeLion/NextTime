package com.nextime.nexttime.result.api;

import com.nextime.nexttime.domain.CravingAfter;
import com.nextime.nexttime.domain.CravingBefore;
import com.nextime.nexttime.domain.CravingChange;
import com.nextime.nexttime.domain.MissionHelpfulness;
import com.nextime.nexttime.domain.NextTimeResult;
import com.nextime.nexttime.domain.NextTimeSession;
import com.nextime.nexttime.domain.NextTimeSessionStatus;
import com.nextime.nexttime.domain.ResultMemorySource;

import java.time.Instant;
import java.util.UUID;

public record NextTimeResultResponse(
        UUID sessionId,
        NextTimeSessionStatus status,
        MissionSummary mission,
        NextTimeResult result,
        CravingBefore cravingBefore,
        CravingAfter cravingAfter,
        CravingChange cravingChange,
        MissionHelpfulness missionHelpfulness,
        String feedback,
        String memorySummary,
        ResultMemorySource memorySource,
        Instant resultRecordedAt
) {
    public static NextTimeResultResponse from(NextTimeSession session) {
        return new NextTimeResultResponse(
                session.getId(),
                session.getStatus(),
                new MissionSummary(
                        session.getRecommendedMission().getId(),
                        session.getMissionCodeSnapshot(),
                        session.getMissionNameSnapshot()
                ),
                session.getResult(),
                session.getCravingBefore(),
                session.getCravingAfter(),
                CravingChange.between(session.getCravingBefore(), session.getCravingAfter()),
                session.getMissionHelpfulness(),
                session.getResultFeedback(),
                session.getResultMemorySummary(),
                session.getResultMemorySource(),
                session.getResultRecordedAt()
        );
    }

    public record MissionSummary(UUID id, String code, String name) {
    }
}
