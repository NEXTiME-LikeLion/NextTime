package com.nextime.ai.nextme.client;

import com.nextime.ai.nextme.domain.NextBudTheme;

public record NextMeClientResult(
        String headline,
        String startReason,
        NextBudTheme nextBudTheme,
        boolean fallbackUsed
) {
    public static NextMeClientResult ai(
            String headline,
            String startReason,
            NextBudTheme nextBudTheme
    ) {
        return new NextMeClientResult(headline, startReason, nextBudTheme, false);
    }

    public static NextMeClientResult fallback(
            String headline,
            String startReason,
            NextBudTheme nextBudTheme
    ) {
        return new NextMeClientResult(headline, startReason, nextBudTheme, true);
    }
}
