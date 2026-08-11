package com.nextime.user.api;

import com.nextime.user.domain.User;

import java.time.Instant;
import java.util.UUID;

public record MeResponse(
        UUID id,
        String email,
        boolean onboardingCompleted,
        Instant createdAt
) {
    static MeResponse from(User user) {
        return new MeResponse(
                user.getId(),
                user.getEmail(),
                user.isOnboardingCompleted(),
                user.getCreatedAt()
        );
    }
}
