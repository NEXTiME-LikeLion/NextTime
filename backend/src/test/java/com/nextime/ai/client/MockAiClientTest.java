package com.nextime.ai.client;

import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class MockAiClientTest {

    private final MockAiClient aiClient = new MockAiClient();

    @Test
    void returnsDeterministicMissionRecommendation() {
        AiResponse response = aiClient.generate(
                new AiRequest("NEXT_TIME_RECOMMEND", "v1", Map.of("craving", 4))
        );

        assertThat(response.provider()).isEqualTo("mock");
        assertThat(response.fallbackUsed()).isTrue();
        assertThat(response.output()).containsEntry("missionCode", "DRINK_WATER");
    }
}
