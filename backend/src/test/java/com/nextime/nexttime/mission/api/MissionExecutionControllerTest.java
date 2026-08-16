package com.nextime.nexttime.mission.api;

import com.nextime.common.config.WebConfig;
import com.nextime.common.error.GlobalExceptionHandler;
import com.nextime.nexttime.mission.application.MissionExecutionService;
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

@WebMvcTest(MissionExecutionController.class)
@Import({SecurityConfig.class, RestAuthenticationEntryPoint.class, CurrentUserArgumentResolver.class,
        WebConfig.class, GlobalExceptionHandler.class})
class MissionExecutionControllerTest {

    private static final UUID USER_ID = UUID.fromString("30000000-0000-0000-0000-000000000001");
    private static final UUID SESSION_ID = UUID.fromString("40000000-0000-0000-0000-000000000001");
    private static final UUID MISSION_ID = UUID.fromString("20000000-0000-0000-0000-000000000007");
    private static final Instant STARTED_AT = Instant.parse("2026-08-16T14:20:00Z");
    private static final Instant COMPLETED_AT = Instant.parse("2026-08-16T14:22:10Z");

    @Autowired
    private MockMvc mockMvc;
    @MockitoBean
    private MissionExecutionService missionExecutionService;
    @MockitoBean
    private UserRepository userRepository;
    @MockitoBean
    private JwtDecoder jwtDecoder;

    @Test
    void unauthenticatedStartReturns401() throws Exception {
        mockMvc.perform(post(path("start")))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void startsMission() throws Exception {
        authenticate();
        when(missionExecutionService.start(USER_ID, SESSION_ID)).thenReturn(new MissionStartResponse(
                SESSION_ID,
                NextTimeSessionStatus.MISSION_STARTED,
                new MissionStartResponse.MissionSummary(
                        MISSION_ID, "BRUSH_OR_RINSE", "양치하거나 입 헹구기",
                        "미션 설명", "완료 기준", 120
                ),
                STARTED_AT
        ));

        mockMvc.perform(post(path("start")).with(jwt().jwt(token -> token.subject("cognito-sub"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.sessionId").value(SESSION_ID.toString()))
                .andExpect(jsonPath("$.data.status").value("MISSION_STARTED"))
                .andExpect(jsonPath("$.data.mission.code").value("BRUSH_OR_RINSE"))
                .andExpect(jsonPath("$.data.mission.estimatedSeconds").value(120))
                .andExpect(jsonPath("$.data.startedAt").value("2026-08-16T14:20:00Z"));
    }

    @Test
    void completesMission() throws Exception {
        authenticate();
        when(missionExecutionService.complete(USER_ID, SESSION_ID)).thenReturn(new MissionCompletionResponse(
                SESSION_ID,
                NextTimeSessionStatus.MISSION_COMPLETED,
                new MissionCompletionResponse.MissionSummary(
                        MISSION_ID, "BRUSH_OR_RINSE", "양치하거나 입 헹구기", "완료 기준"
                ),
                STARTED_AT,
                COMPLETED_AT
        ));

        mockMvc.perform(post(path("complete")).with(jwt().jwt(token -> token.subject("cognito-sub"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("MISSION_COMPLETED"))
                .andExpect(jsonPath("$.data.completedAt").value("2026-08-16T14:22:10Z"));
    }

    @Test
    void skipsMission() throws Exception {
        authenticate();
        when(missionExecutionService.skip(USER_ID, SESSION_ID)).thenReturn(new MissionSkipResponse(
                SESSION_ID,
                NextTimeSessionStatus.CANCELLED,
                new MissionSkipResponse.MissionSummary(
                        MISSION_ID, "BRUSH_OR_RINSE", "양치하거나 입 헹구기"
                ),
                STARTED_AT
        ));

        mockMvc.perform(post(path("skip")).with(jwt().jwt(token -> token.subject("cognito-sub"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("CANCELLED"))
                .andExpect(jsonPath("$.data.skippedAt").value("2026-08-16T14:20:00Z"));
    }

    private void authenticate() {
        User user = mock(User.class);
        when(user.getId()).thenReturn(USER_ID);
        when(userRepository.findByCognitoSub("cognito-sub")).thenReturn(Optional.of(user));
    }

    private String path(String action) {
        return "/next-time/sessions/" + SESSION_ID + "/mission/" + action;
    }
}
