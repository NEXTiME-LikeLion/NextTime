package com.nextime.ai.nextme.client;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.ObjectMapper;
import com.nextime.ai.nextme.domain.NextBudTheme;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.client.ExpectedCount.once;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

class OpenAiNextMeClientTest {

    @Test
    void parsesStructuredCardResponse() {
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
                                  "text": "{\\\"headline\\\":\\\"건강한 미래의 나\\\",\\\"start_reason\\\":\\\"숨이 차서 시작한 변화\\\",\\\"nextbud_theme\\\":\\\"NEXTBUD_HEALTH_01\\\"}"
                                }
                              ]
                            }
                          ]
                        }
                        """, MediaType.APPLICATION_JSON));

        NextMeClientResult result = client.generate(new NextMePromptInput(
                List.of("체력·건강"),
                "REDUCE",
                "계단을 오를 때 숨이 찼어요.",
                "건강하게 사는 사람",
                "오늘의 선택을 기억하자."
        ));

        assertThat(result.headline()).isEqualTo("건강한 미래의 나");
        assertThat(result.startReason()).isEqualTo("숨이 차서 시작한 변화");
        assertThat(result.nextBudTheme()).isEqualTo(NextBudTheme.NEXTBUD_HEALTH_01);
        assertThat(result.fallbackUsed()).isFalse();
        server.verify();
    }
}
