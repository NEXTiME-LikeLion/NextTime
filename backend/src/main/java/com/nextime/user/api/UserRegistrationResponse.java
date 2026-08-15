package com.nextime.user.api;

import com.nextime.user.application.UserRegistrationResult;
import com.nextime.user.domain.User;

import java.time.Instant;
import java.util.UUID;

public record UserRegistrationResponse(
        UUID id,
        String email,
        boolean onboardingCompleted,
        Instant createdAt,
        boolean newlyRegistered
) {
    public static UserRegistrationResponse from(UserRegistrationResult result) {
        User user = result.user();
        return new UserRegistrationResponse(
                user.getId(),
                user.getEmail(),
                user.isOnboardingCompleted(),
                user.getCreatedAt(),
                result.newlyRegistered()
        );
    }
}
