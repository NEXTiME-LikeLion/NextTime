package com.nextime.ai.nextme.api;

import com.nextime.ai.nextme.domain.GenerationSource;
import com.nextime.ai.nextme.domain.NextMeGeneration;
import com.nextime.ai.nextme.domain.NextBudTheme;

import java.time.Instant;
import java.util.UUID;

public record NextMeResponse(
        UUID generationId,
        String headline,
        String start_reason,
        NextBudTheme nextbud_theme,
        GenerationSource source,
        Instant createdAt
) {
    static NextMeResponse from(NextMeGeneration generation) {
        return new NextMeResponse(
                generation.getId(),
                generation.getHeadline(),
                generation.getStartReason(),
                generation.getNextBudTheme(),
                generation.getSource(),
                generation.getCreatedAt()
        );
    }
}
