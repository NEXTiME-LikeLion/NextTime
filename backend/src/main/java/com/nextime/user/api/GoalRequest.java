package com.nextime.user.api;

import com.nextime.user.domain.OnboardingGoal;
import jakarta.validation.constraints.Size;

public record GoalRequest(
        OnboardingGoal changeGoal,
        @Size(max = 500) String nextMe,
        @Size(max = 500) String motivation,
        @Size(max = 500) String leftMessage
) {
}
