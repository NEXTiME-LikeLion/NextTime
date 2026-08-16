package com.nextime.ai.nextme.client;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(prefix = "app.ai", name = "provider", havingValue = "mock", matchIfMissing = true)
public class MockNextMeAiClient implements NextMeAiClient {

    @Override
    public NextMeClientResult generate(NextMePromptInput input) {
        return NextMeClientResult.fallback("내가 바라는 미래를 향해 오늘의 변화를 선택하는 나");
    }
}
