package com.nextime.nexttime.api;

import com.nextime.common.config.WebConfig;
import com.nextime.common.error.GlobalExceptionHandler;
import com.nextime.nexttime.application.MissionExecutionService;
import com.nextime.nexttime.application.MissionRecommendationService;
import com.nextime.nexttime.application.NextTimeService;
import com.nextime.nexttime.application.ResultRecordingService;
import com.nextime.nexttime.domain.CravingAfter;
import com.nextime.nexttime.domain.CravingBefore;
import com.nextime.nexttime.domain.CravingChange;
import com.nextime.nexttime.domain.MissionHelpfulness;
import com.nextime.nexttime.domain.NextTimeResult;
import com.nextime.nexttime.domain.NextTimeSessionStatus;
import com.nextime.nexttime.domain.ResultMemorySource;
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

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(NextTimeController.class)
@Import({SecurityConfig.class, RestAuthenticationEntryPoint.class, CurrentUserArgumentResolver.class,
        WebConfig.class, GlobalExceptionHandler.class})
class ResultRecordingControllerTest {

    private static final UUID USER_ID = UUID.fromString("30000000-0000-0000-0000-000000000001");
    private static final UUID SESSION_ID = UUID.fromString("40000000-0000-0000-0000-000000000001");
    private static final UUID MISSION_ID = UUID.fromString("20000000-0000-0000-0000-000000000003");

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
    private UserRepository userRepository;
    @MockitoBean
    private JwtDecoder jwtDecoder;

    @Test
    void unauthenticatedRequestReturns401() throws Exception {
        mockMvc.perform(post(path())
                        .contentType(APPLICATION_JSON)
                        .content(validBody()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void recordsResult() throws Exception {
        authenticate();
        when(resultRecordingService.record(eq(USER_ID), eq(SESSION_ID), any()))
                .thenReturn(response());

        mockMvc.perform(post(path())
                        .with(jwt().jwt(token -> token.subject("cognito-sub")))
                        .contentType(APPLICATION_JSON)
                        .content(validBody()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("RESULT_RECORDED"))
                .andExpect(jsonPath("$.data.result").value("NOT_SMOKED"))
                .andExpect(jsonPath("$.data.cravingAfter").value("NONE"))
                .andExpect(jsonPath("$.data.cravingChange").value("DECREASED"))
                .andExpect(jsonPath("$.data.missionHelpfulness").value("HELPFUL"))
                .andExpect(jsonPath("$.data.memorySource").value("FALLBACK"));
    }

    @Test
    void missingRequiredFieldsReturns400() throws Exception {
        authenticate();

        mockMvc.perform(post(path())
                        .with(jwt().jwt(token -> token.subject("cognito-sub")))
                        .contentType(APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("INVALID_REQUEST"))
                .andExpect(jsonPath("$.fieldErrors.length()").value(3));
    }

    @Test
    void feedbackLongerThan500CharactersReturns400() throws Exception {
        authenticate();
        String body = validBody().replace("좋았어요", "가".repeat(501));

        mockMvc.perform(post(path())
                        .with(jwt().jwt(token -> token.subject("cognito-sub")))
                        .contentType(APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors[0].field").value("feedback"));
    }

    private NextTimeResultResponse response() {
        return new NextTimeResultResponse(
                SESSION_ID,
                NextTimeSessionStatus.RESULT_RECORDED,
                new NextTimeResultResponse.MissionSummary(MISSION_ID, "SHORT_WALK", "잠깐 걷기"),
                NextTimeResult.NOT_SMOKED,
                CravingBefore.HIGH,
                CravingAfter.NONE,
                CravingChange.DECREASED,
                MissionHelpfulness.HELPFUL,
                "좋았어요",
                "밥을 먹고 나서에서 잠깐 걷기 행동을 했고 결과를 기록했어요.",
                ResultMemorySource.FALLBACK,
                Instant.parse("2026-08-17T00:30:00Z")
        );
    }

    private void authenticate() {
        User user = mock(User.class);
        when(user.getId()).thenReturn(USER_ID);
        when(userRepository.findByCognitoSub("cognito-sub")).thenReturn(Optional.of(user));
    }

    private String path() {
        return "/next-time/sessions/" + SESSION_ID + "/result";
    }

    private String validBody() {
        return """
                {
                  "result": "NOT_SMOKED",
                  "cravingAfter": "NONE",
                  "missionHelpfulness": "HELPFUL",
                  "feedback": "좋았어요"
                }
                """;
    }
}
