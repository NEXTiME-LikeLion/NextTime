package com.nextime.ai.nextme.client;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.client.ExpectedCount.once;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

class OpenAiNextMeClientTest {

    @Test
    void parsesStructuredResponseMessage() {
        RestClient.Builder builder = RestClient.builder()
                .baseUrl("https://api.openai.com")
                .defaultHeader("Authorization", "Bearer test-key");
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        OpenAiNextMeClient client = new OpenAiNextMeClient(
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
                                  "text": "{\\\"message\\\":\\\"건강한 미래를 선택하는 나\\\"}"
                                }
                              ]
                            }
                          ]
                        }
                        """, MediaType.APPLICATION_JSON));

        NextMeClientResult result = client.generate(new NextMePromptInput(
                List.of("체력·건강"),
                "계단을 오를 때 숨이 찼어요.",
                "건강하게 사는 사람",
                "오늘의 선택을 기억하자."
        ));

        assertThat(result.message()).isEqualTo("건강한 미래를 선택하는 나");
        assertThat(result.fallbackUsed()).isFalse();
        server.verify();
    }
}
