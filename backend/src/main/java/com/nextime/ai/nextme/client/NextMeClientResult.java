package com.nextime.ai.nextme.client;

public record NextMeClientResult(
        String message,
        boolean fallbackUsed
) {
    public static NextMeClientResult ai(String message) {
        return new NextMeClientResult(message, false);
    }

    public static NextMeClientResult fallback(String message) {
        return new NextMeClientResult(message, true);
    }
}
