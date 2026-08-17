package com.nextime.nexttime.futurevoice.application;

public record FutureVoiceClientResult(
        String futureHook,
        String acknowledge,
        String futureReason,
        String closing,
        boolean fallbackUsed
) {
    public static FutureVoiceClientResult ai(
            String futureHook,
            String acknowledge,
            String futureReason,
            String closing
    ) {
        return new FutureVoiceClientResult(futureHook, acknowledge, futureReason, closing, false);
    }

    public static FutureVoiceClientResult fallback() {
        return new FutureVoiceClientResult(null, null, null, null, true);
    }
}
