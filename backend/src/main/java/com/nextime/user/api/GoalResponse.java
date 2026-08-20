package com.nextime.user.api;

import com.nextime.user.domain.OnboardingGoal;
import com.nextime.ai.nextme.domain.NextBudTheme;

public record GoalResponse(
        OnboardingGoal changeGoal,
        String future_self,
        String decision_trigger,
        String message_to_future_self,
        String headline,
        String start_reason,
        NextBudTheme nextbud_theme
) {
}
