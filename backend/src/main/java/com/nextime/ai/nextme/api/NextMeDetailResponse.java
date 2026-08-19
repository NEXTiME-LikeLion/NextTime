package com.nextime.ai.nextme.api;

import com.nextime.ai.nextme.domain.GenerationSource;
import com.nextime.ai.nextme.domain.NextBudTheme;
import com.nextime.ai.nextme.domain.NextMeGeneration;

import java.time.Instant;
import java.util.UUID;

public record NextMeDetailResponse(
        UUID generationId,
        String headline,
        String start_reason,
        NextBudTheme nextbud_theme,
        GenerationSource source,
        Instant createdAt,
        String decisionTrigger,
        String futureSelf,
        String messageToFutureSelf
) {
    static NextMeDetailResponse from(NextMeGeneration generation) {
        return new NextMeDetailResponse(
                generation.getId(),
                generation.getHeadline(),
                generation.getStartReason(),
                generation.getNextBudTheme(),
                generation.getSource(),
                generation.getCreatedAt(),
                generation.getDecisionTrigger(),
                generation.getFutureSelf(),
                generation.getMessageToFutureSelf()
        );
    }
}
