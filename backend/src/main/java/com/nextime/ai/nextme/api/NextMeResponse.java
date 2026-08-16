package com.nextime.ai.nextme.api;

import com.nextime.ai.nextme.domain.GenerationSource;
import com.nextime.ai.nextme.domain.NextMeGeneration;

import java.time.Instant;
import java.util.UUID;

public record NextMeResponse(
        UUID generationId,
        String message,
        GenerationSource source,
        Instant createdAt
) {
    static NextMeResponse from(NextMeGeneration generation) {
        return new NextMeResponse(
                generation.getId(),
                generation.getGeneratedMessage(),
                generation.getSource(),
                generation.getCreatedAt()
        );
    }
}
