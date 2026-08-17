package com.nextime.nexttime.futurevoice.infrastructure;

import com.nextime.nexttime.futurevoice.application.FutureVoiceAiClient;
import com.nextime.nexttime.futurevoice.application.FutureVoiceClientResult;
import com.nextime.nexttime.futurevoice.application.FutureVoicePromptInput;

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
