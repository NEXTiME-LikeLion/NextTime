package com.nextime.user.api;

import com.nextime.user.domain.User;

import java.time.Instant;

public record OnboardingResponse(
        boolean onboardingCompleted,
        Instant updatedAt
) {
    static OnboardingResponse from(User user) {
        return new OnboardingResponse(user.isOnboardingCompleted(), user.getUpdatedAt());
    }
}
