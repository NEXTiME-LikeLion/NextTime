package com.nextime.ai.client;

import java.util.Map;

public record AiResponse(
        String provider,
        boolean fallbackUsed,
        Map<String, Object> output
) {
}
