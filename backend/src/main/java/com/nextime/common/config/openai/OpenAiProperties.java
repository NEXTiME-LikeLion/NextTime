package com.nextime.common.config.openai;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.ai.openai")
public record OpenAiProperties(
        String apiKey,
        String model,
        String baseUrl
) {
    public OpenAiProperties {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalArgumentException("AI_PROVIDER=openai일 때 OPENAI_API_KEY가 필요합니다.");
        }
    }
}
