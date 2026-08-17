package com.nextime.nexttime.recommendation.api;

import com.nextime.common.config.WebConfig;
import com.nextime.common.error.GlobalExceptionHandler;
import com.nextime.nexttime.recommendation.application.MissionRecommendationService;
import com.nextime.nexttime.domain.NextTimeSessionStatus;
import com.nextime.nexttime.domain.RecommendationSource;
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

@WebMvcTest(MissionRecommendationController.class)
@Import({SecurityConfig.class, RestAuthenticationEntryPoint.class, CurrentUserArgumentResolver.class,
        WebConfig.class, GlobalExceptionHandler.class})
class MissionRecommendationControllerTest {

    private static final UUID USER_ID = UUID.fromString("30000000-0000-0000-0000-000000000001");
    private static final UUID SESSION_ID = UUID.fromString("40000000-0000-0000-0000-000000000001");
    private static final UUID MISSION_ID = UUID.fromString("20000000-0000-0000-0000-000000000003");
    private static final String PATH = "/next-time/sessions/" + SESSION_ID + "/recommendation";

    @Autowired
    private MockMvc mockMvc;
    @MockitoBean
    private MissionRecommendationService recommendationService;
    @MockitoBean
    private UserRepository userRepository;
    @MockitoBean
    private JwtDecoder jwtDecoder;

    @Test
    void unauthenticatedRequestReturns401() throws Exception {
        mockMvc.perform(post(PATH)).andExpect(status().isUnauthorized());
    }

    @Test
    void recommendsMission() throws Exception {
        authenticate();
        when(recommendationService.recommend(USER_ID, SESSION_ID)).thenReturn(response());

        mockMvc.perform(post(PATH).with(jwt().jwt(token -> token.subject("cognito-sub"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.sessionId").value(SESSION_ID.toString()))
                .andExpect(jsonPath("$.data.status").value("MISSION_RECOMMENDED"))
                .andExpect(jsonPath("$.data.mission.code").value("SHORT_WALK"))
                .andExpect(jsonPath("$.data.source").value("RULE"));
    }

    private void authenticate() {
        User user = mock(User.class);
        when(user.getId()).thenReturn(USER_ID);
        when(userRepository.findByCognitoSub("cognito-sub")).thenReturn(Optional.of(user));
    }

    private MissionRecommendationResponse response() {
        return new MissionRecommendationResponse(
                SESSION_ID,
                NextTimeSessionStatus.MISSION_RECOMMENDED,
                new MissionRecommendationResponse.MissionSummary(
                        MISSION_ID,
                        "SHORT_WALK",
                        "잠깐 걷기",
                        "현재 위치에서 벗어나 잠깐 걸어보세요.",
                        "5분 동안 걸으면 완료",
                        300
                ),
                "비슷한 상황에서 이 행동이 도움이 됐다고 기록한 적이 있어요.",
                RecommendationSource.RULE,
                Instant.parse("2026-08-17T00:00:00Z")
        );
    }
}
