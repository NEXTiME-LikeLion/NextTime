package com.nextime.ai.resultmemory.client;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(prefix = "app.ai", name = "provider", havingValue = "mock", matchIfMissing = true)
public class MockResultMemoryAiClient implements ResultMemoryAiClient {

    @Override
    public ResultMemoryClientResult generate(ResultMemoryPromptInput input) {
        return ResultMemoryClientResult.fallback();
    }
}
