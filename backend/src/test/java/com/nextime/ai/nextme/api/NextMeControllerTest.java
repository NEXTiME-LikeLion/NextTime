package com.nextime.ai.nextme.api;

import com.nextime.ai.nextme.application.NextMeService;
import com.nextime.ai.nextme.domain.GenerationSource;
import com.nextime.ai.nextme.domain.NextMeGeneration;
import com.nextime.common.config.WebConfig;
import com.nextime.common.error.GlobalExceptionHandler;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(NextMeController.class)
@Import({
        SecurityConfig.class,
        RestAuthenticationEntryPoint.class,
        CurrentUserArgumentResolver.class,
        WebConfig.class,
        GlobalExceptionHandler.class
})
class NextMeControllerTest {

    private static final UUID USER_ID = UUID.fromString("30000000-0000-0000-0000-000000000001");

    @Autowired
    private MockMvc mockMvc;
    @MockitoBean
    private NextMeService nextMeService;
    @MockitoBean
    private UserRepository userRepository;
    @MockitoBean
    private JwtDecoder jwtDecoder;

    @Test
    void postWithoutAuthenticationReturns401() throws Exception {
        mockMvc.perform(post("/ai/onboarding/next-me")
                        .contentType(APPLICATION_JSON)
                        .content(validBody()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void postGeneratesOneMessage() throws Exception {
        User user = authenticatedUser();
        NextMeGeneration generation = generation();
        when(nextMeService.generate(eq(USER_ID), any(NextMeGenerateRequest.class)))
                .thenReturn(generation);

        mockMvc.perform(post("/ai/onboarding/next-me")
                        .with(jwt().jwt(token -> token.subject("cognito-sub")))
                        .contentType(APPLICATION_JSON)
                        .content(validBody()))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.message").value("건강한 일상을 선택하는 나"))
                .andExpect(jsonPath("$.data.source").value("AI"));
    }

    @Test
    void getReturnsLatestMessage() throws Exception {
        authenticatedUser();
        NextMeGeneration generation = generation();
        when(nextMeService.getLatest(USER_ID)).thenReturn(generation);

        mockMvc.perform(get("/ai/onboarding/next-me")
                        .with(jwt().jwt(token -> token.subject("cognito-sub"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.message").value("건강한 일상을 선택하는 나"));
    }

    @Test
    void postRejectsMoreThanTwoReasons() throws Exception {
        authenticatedUser();

        mockMvc.perform(post("/ai/onboarding/next-me")
                        .with(jwt().jwt(token -> token.subject("cognito-sub")))
                        .contentType(APPLICATION_JSON)
                        .content("""
                                {
                                  "changeReasons": ["HEALTH_FITNESS", "FREEDOM", "COST"],
                                  "customReason": null,
                                  "decisionTrigger": "계단을 오를 때 숨이 찼어요.",
                                  "futureSelf": "건강하게 생활하는 사람",
                                  "messageToFutureSelf": "오늘의 선택을 기억하자."
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("INVALID_REQUEST"));
    }

    private User authenticatedUser() {
        User user = mock(User.class);
        when(user.getId()).thenReturn(USER_ID);
        when(user.getEmail()).thenReturn("test@example.com");
        when(userRepository.findByCognitoSub("cognito-sub")).thenReturn(Optional.of(user));
        return user;
    }

    private NextMeGeneration generation() {
        NextMeGeneration generation = mock(NextMeGeneration.class);
        when(generation.getId()).thenReturn(UUID.fromString("70000000-0000-0000-0000-000000000001"));
        when(generation.getGeneratedMessage()).thenReturn("건강한 일상을 선택하는 나");
        when(generation.getSource()).thenReturn(GenerationSource.AI);
        when(generation.getCreatedAt()).thenReturn(Instant.parse("2026-08-16T00:00:00Z"));
        return generation;
    }

    private String validBody() {
        return """
                {
                  "changeReasons": ["HEALTH_FITNESS", "FREEDOM"],
                  "customReason": null,
                  "decisionTrigger": "계단을 오를 때 숨이 찼어요.",
                  "futureSelf": "건강하고 자유롭게 생활하는 사람",
                  "messageToFutureSelf": "오늘의 선택을 기억하자."
                }
                """;
    }
}
