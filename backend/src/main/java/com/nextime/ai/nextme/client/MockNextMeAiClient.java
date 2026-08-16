package com.nextime.ai.nextme.client;

import com.nextime.ai.nextme.domain.NextBudTheme;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(prefix = "app.ai", name = "provider", havingValue = "mock", matchIfMissing = true)
public class MockNextMeAiClient implements NextMeAiClient {

    @Override
    public NextMeClientResult generate(NextMePromptInput input) {
        return NextMeClientResult.fallback(
                "내가 바라는 미래의 나",
                "변화를 시작한 오늘",
                NextBudTheme.NEXTBUD_DEFAULT_01
        );
    }
}
