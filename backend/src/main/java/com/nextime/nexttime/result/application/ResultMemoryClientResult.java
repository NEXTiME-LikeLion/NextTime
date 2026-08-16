package com.nextime.nexttime.result.application;

public record ResultMemoryClientResult(String memorySummary, boolean fallbackUsed) {

    public static ResultMemoryClientResult ai(String memorySummary) {
        return new ResultMemoryClientResult(memorySummary, false);
    }

    public static ResultMemoryClientResult fallback() {
        return new ResultMemoryClientResult(null, true);
    }
}
