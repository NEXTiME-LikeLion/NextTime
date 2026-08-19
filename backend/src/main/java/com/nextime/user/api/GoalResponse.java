package com.nextime.user.api;

import com.nextime.user.domain.OnboardingGoal;

public record GoalResponse(
        OnboardingGoal changeGoal,
        String nextMe,
        String motivation,
        String leftMessage
) {
}
