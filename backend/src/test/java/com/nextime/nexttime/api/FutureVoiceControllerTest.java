package com.nextime.nexttime.api;

import com.nextime.common.config.WebConfig;
import com.nextime.common.error.GlobalExceptionHandler;
import com.nextime.nexttime.application.FutureVoiceService;
import com.nextime.nexttime.application.MissionExecutionService;
import com.nextime.nexttime.application.MissionRecommendationService;
import com.nextime.nexttime.application.NextTimeService;
import com.nextime.nexttime.application.ResultRecordingService;
import com.nextime.nexttime.domain.FutureVoiceSource;
import com.nextime.nexttime.domain.NextTimeSessionStatus;
import com.nextime.security.CurrentUserArgumentResolver;
import com.nextime.security.RestAuthenticationEntryPoint;
import com.nextime.security.SecurityConfig;
import com.nextime.user.domain.User;
import com.nextime.user.domain.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(NextTimeController.class)
@Import({SecurityConfig.class, RestAuthenticationEntryPoint.class, CurrentUserArgumentResolver.class,
        WebConfig.class, GlobalExceptionHandler.class})
class FutureVoiceControllerTest {

    private static final UUID USER_ID = UUID.fromString("30000000-0000-0000-0000-000000000001");
    private static final UUID SESSION_ID = UUID.fromString("40000000-0000-0000-0000-000000000001");
    private static final String PATH = "/next-time/sessions/" + SESSION_ID + "/future-voice";

    @Autowired
    private MockMvc mockMvc;
    @MockitoBean
    private NextTimeService nextTimeService;
    @MockitoBean
    private MissionRecommendationService missionRecommendationService;
    @MockitoBean
    private MissionExecutionService missionExecutionService;
    @MockitoBean
    private ResultRecordingService resultRecordingService;
    @MockitoBean
    private FutureVoiceService futureVoiceService;
    @MockitoBean
    private UserRepository userRepository;
    @MockitoBean
    private JwtDecoder jwtDecoder;

    @Test
    void unauthenticatedRequestReturns401() throws Exception {
        mockMvc.perform(post(PATH)).andExpect(status().isUnauthorized());
    }

    @Test
    void generatesFutureVoice() throws Exception {
        authenticate();
        when(futureVoiceService.generate(USER_ID, SESSION_ID)).thenReturn(response());

        mockMvc.perform(post(PATH).with(jwt().jwt(token -> token.subject("cognito-sub"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.sessionId").value(SESSION_ID.toString()))
                .andExpect(jsonPath("$.data.status").value("CONTEXT_SAVED"))
                .andExpect(jsonPath("$.data.futureHook").value("나 오늘 저녁에도 달릴 거잖아"))
                .andExpect(jsonPath("$.data.source").value("AI"));
    }

    private void authenticate() {
        User user = mock(User.class);
        when(user.getId()).thenReturn(USER_ID);
        when(userRepository.findByCognitoSub("cognito-sub")).thenReturn(Optional.of(user));
    }

    private FutureVoiceResponse response() {
        return new FutureVoiceResponse(
                SESSION_ID,
                NextTimeSessionStatus.CONTEXT_SAVED,
                "나 오늘 저녁에도 달릴 거잖아",
                "지금 한 대가 너무 당기는 거 알아",
                "몇 시간 뒤의 나는 숨이 차서 멈추고 싶지 않아.",
                "이번 한 번만, 나를 먼저 선택해줘",
                FutureVoiceSource.AI,
                Instant.parse("2026-08-17T00:00:00Z")
        );
    }
}
