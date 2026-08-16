package com.nextime.nexttime.futurevoice.infrastructure;

import com.nextime.common.config.openai.OpenAiProperties;
import com.nextime.nexttime.futurevoice.application.FutureVoiceClientResult;
import com.nextime.nexttime.futurevoice.application.FutureVoicePromptInput;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.ObjectMapper;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.client.ExpectedCount.once;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

class OpenAiFutureVoiceClientTest {

    @Test
    void parsesStructuredFutureVoiceResponse() {
        RestClient.Builder builder = RestClient.builder()
                .baseUrl("https://api.openai.com")
                .defaultHeader("Authorization", "Bearer test-key");
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        OpenAiFutureVoiceClient client = new OpenAiFutureVoiceClient(
                builder.build(),
                new ObjectMapper(),
                new OpenAiProperties("test-key", "gpt-5.4-mini", "https://api.openai.com")
        );
        server.expect(once(), requestTo("https://api.openai.com/v1/responses"))
                .andExpect(header("Authorization", "Bearer test-key"))
                .andRespond(withSuccess("""
                        {
                          "output": [
                            {
                              "type": "message",
                              "content": [
                                {
                                  "type": "output_text",
                                  "text": "{\\\"future_hook\\\":\\\"나 오늘 저녁에도 달릴 거잖아\\\",\\\"acknowledge\\\":\\\"지금 한 대가 너무 당기는 거 알아\\\",\\\"future_reason\\\":\\\"몇 시간 뒤의 나는 숨이 차서 멈추고 싶지 않아.\\\",\\\"closing\\\":\\\"이번 한 번만, 나를 먼저 선택해줘\\\"}"
                                }
                              ]
                            }
                          ]
                        }
                        """, MediaType.APPLICATION_JSON));

        FutureVoiceClientResult result = client.generate(new FutureVoicePromptInput(
                "당장 피우고 싶음",
                "집",
                "밥을 먹고 나서",
                "완전히 끊고 싶어요",
                "러닝할 때 숨이 차서 먼저 멈추지 않는 나",
                "계단을 오를 때 숨이 찼어요.",
                "오래 달리는 나",
                "이번에는 나한테 3분만 먼저 줘."
        ));

        assertThat(result.futureHook()).isEqualTo("나 오늘 저녁에도 달릴 거잖아");
        assertThat(result.acknowledge()).contains("당기는 거 알아");
        assertThat(result.fallbackUsed()).isFalse();
        server.verify();
    }
}
