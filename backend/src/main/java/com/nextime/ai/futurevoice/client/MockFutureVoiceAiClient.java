package com.nextime.ai.futurevoice.client;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(prefix = "app.ai", name = "provider", havingValue = "mock", matchIfMissing = true)
public class MockFutureVoiceAiClient implements FutureVoiceAiClient {
    @Override
    public FutureVoiceClientResult generate(FutureVoicePromptInput input) {
        return FutureVoiceClientResult.fallback();
    }
}
