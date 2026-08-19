package com.nextime.user.api;

import com.nextime.user.domain.OnboardingGoal;
import com.nextime.ai.nextme.domain.NextBudTheme;

public record GoalResponse(
        OnboardingGoal changeGoal,
        String nextMe,
        NextBudTheme nextBudTheme,
        String motivation,
        String leftMessage
) {
}
