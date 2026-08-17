package com.nextime.home.api;

import com.nextime.ai.nextme.domain.NextBudTheme;
import com.nextime.ai.nextme.domain.NextMeGeneration;
import com.nextime.mission.domain.Mission;
import com.nextime.nexttime.domain.CravingBefore;
import com.nextime.nexttime.domain.NextTimeSession;
import com.nextime.nexttime.domain.NextTimeSessionStatus;
import com.nextime.smokingcontext.domain.SmokingContext;
import com.nextime.smokingcontext.domain.SmokingContextType;

import java.time.Instant;
import java.util.UUID;

public record HomeResponse(
        NextMe nextMe,
        ActiveNextTimeSession activeNextTimeSession,
        TodaySummary todaySummary
) {
    public record NextMe(
            String headline,
            String messageToFutureSelf,
            NextBudTheme nextBudTheme
    ) {
        public static NextMe from(NextMeGeneration generation) {
            return new NextMe(
                    generation.getHeadline(),
                    generation.getMessageToFutureSelf(),
                    generation.getNextBudTheme()
            );
        }
    }

    public record ActiveNextTimeSession(
            UUID sessionId,
            NextTimeSessionStatus status,
            CravingBefore cravingBefore,
            Context location,
            Context trigger,
            MissionSummary mission,
            Instant missionStartedAt
    ) {
        public static ActiveNextTimeSession from(NextTimeSession session) {
            return new ActiveNextTimeSession(
                    session.getId(),
                    session.getStatus(),
                    session.getCravingBefore(),
                    Context.from(contextOrNull(session, SmokingContextType.LOCATION)),
                    Context.from(contextOrNull(session, SmokingContextType.TRIGGER)),
                    MissionSummary.from(session),
                    session.getMissionStartedAt()
            );
        }

        private static SmokingContext contextOrNull(NextTimeSession session, SmokingContextType type) {
            return session.getContexts().stream()
                    .filter(context -> context.getContextType() == type)
                    .findFirst()
                    .orElse(null);
        }
    }

    public record Context(UUID id, String code, String name) {
        private static Context from(SmokingContext context) {
            return context == null ? null : new Context(context.getId(), context.getCode(), context.getName());
        }
    }

    public record MissionSummary(
            UUID id,
            String code,
            String name,
            String description,
            String completionCriteria,
            Integer estimatedSeconds
    ) {
        private static MissionSummary from(NextTimeSession session) {
            Mission mission = session.getRecommendedMission();
            if (mission == null) {
                return null;
            }
            return new MissionSummary(
                    mission.getId(),
                    session.getMissionCodeSnapshot(),
                    session.getMissionNameSnapshot(),
                    session.getMissionDescriptionSnapshot(),
                    session.getCompletionCriteriaSnapshot(),
                    session.getEstimatedSecondsSnapshot()
            );
        }
    }

    public record TodaySummary(
            int totalAttemptCount,
            int overcomeCount,
            int delayedCount,
            int smokedCount,
            NextAction nextAction
    ) {
    }

    public record NextAction(
            UUID missionId,
            String code,
            String name,
            String description,
            String reason
    ) {
    }
}
