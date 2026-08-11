package com.nextime.ai.client;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@ConditionalOnProperty(prefix = "app.ai", name = "provider", havingValue = "mock", matchIfMissing = true)
public class MockAiClient implements AiClient {

    @Override
    public AiResponse generate(AiRequest request) {
        Map<String, Object> output = switch (request.purpose()) {
            case "NEXT_TIME_RECOMMEND" -> Map.of(
                    "missionCode", "DRINK_WATER",
                    "reason", "지금 바로 짧게 실행할 수 있는 기본 미션입니다."
            );
            case "ONBOARDING_NEXT_ME", "NEXT_ME_REWRITE" -> Map.of(
                    "candidates", java.util.List.of(
                            "지금의 작은 선택이 내가 원하는 내일을 만듭니다.",
                            "담배 대신 나를 돌보는 시간을 선택해요."
                    )
            );
            case "COPING_PROFILE" -> Map.of("missionCodes", java.util.List.of());
            case "PATTERN_INSIGHT" -> Map.of(
                    "message", "기록이 쌓이면 반복 상황과 도움이 된 행동을 알려드릴게요."
            );
            default -> Map.of();
        };
        return new AiResponse("mock", true, output);
    }
}
