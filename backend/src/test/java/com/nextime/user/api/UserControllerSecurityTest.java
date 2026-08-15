package com.nextime.user.api;

import com.nextime.common.config.WebConfig;
import com.nextime.common.error.GlobalExceptionHandler;
import com.nextime.security.CurrentUserArgumentResolver;
import com.nextime.security.RestAuthenticationEntryPoint;
import com.nextime.security.SecurityConfig;
import com.nextime.user.application.UserRegistrationResult;
import com.nextime.user.application.UserRegistrationService;
import com.nextime.user.application.OnboardingService;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.http.MediaType.APPLICATION_JSON;

@WebMvcTest(UserController.class)
@Import({
        SecurityConfig.class,
        RestAuthenticationEntryPoint.class,
        CurrentUserArgumentResolver.class,
        WebConfig.class,
        GlobalExceptionHandler.class
})
class UserControllerSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserRepository userRepository;

    @MockitoBean
    private UserRegistrationService userRegistrationService;

    @MockitoBean
    private OnboardingService onboardingService;

    @MockitoBean
    private JwtDecoder jwtDecoder;

    @Test
    void unauthenticatedRequestReturns401() throws Exception {
        mockMvc.perform(get("/users/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("UNAUTHENTICATED"));
    }

    @Test
    void unauthenticatedRegistrationReturns401() throws Exception {
        mockMvc.perform(post("/users"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("UNAUTHENTICATED"));
    }

    @Test
    void registrationPreflightAllowsConfiguredFrontendOrigin() throws Exception {
        mockMvc.perform(options("/users")
                        .header("Origin", "http://localhost:5173")
                        .header("Access-Control-Request-Method", "POST")
                        .header("Access-Control-Request-Headers", "Authorization, Content-Type"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"))
                .andExpect(header().string(
                        "Access-Control-Allow-Methods",
                        org.hamcrest.Matchers.containsString("POST")
                ))
                .andExpect(header().string(
                        "Access-Control-Allow-Headers",
                        org.hamcrest.Matchers.containsString("Authorization")
                ));
    }

    @Test
    void newCognitoUserRegistrationReturns201() throws Exception {
        User user = userFixture();
        when(userRegistrationService.register("cognito-sub-123", "test-token"))
                .thenReturn(UserRegistrationResult.created(user));

        mockMvc.perform(post("/users").with(jwt().jwt(token -> token
                        .tokenValue("test-token")
                        .subject("cognito-sub-123"))))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", "/users/me"))
                .andExpect(jsonPath("$.data.id").value(user.getId().toString()))
                .andExpect(jsonPath("$.data.email").value("test@nextime.local"))
                .andExpect(jsonPath("$.data.onboardingCompleted").value(false))
                .andExpect(jsonPath("$.data.newlyRegistered").value(true));
    }

    @Test
    void repeatedRegistrationReturnsExistingUserWith200() throws Exception {
        User user = userFixture();
        when(userRegistrationService.register("cognito-sub-123", "test-token"))
                .thenReturn(UserRegistrationResult.existing(user));

        mockMvc.perform(post("/users").with(jwt().jwt(token -> token
                        .tokenValue("test-token")
                        .subject("cognito-sub-123"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.newlyRegistered").value(false));
    }

    @Test
    void onboardingWithoutAuthenticationReturns401() throws Exception {
        mockMvc.perform(put("/users/me/onboarding")
                        .contentType(APPLICATION_JSON)
                        .content(validOnboardingBody()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void onboardingReturns200() throws Exception {
        User user = userFixture();
        when(user.isOnboardingCompleted()).thenReturn(true);
        when(user.getUpdatedAt()).thenReturn(Instant.parse("2026-08-16T01:00:00Z"));
        when(userRepository.findByCognitoSub("cognito-sub-123")).thenReturn(Optional.of(user));
        when(onboardingService.complete(
                org.mockito.ArgumentMatchers.eq(user.getId()),
                org.mockito.ArgumentMatchers.any(OnboardingRequest.class)
        ))
                .thenReturn(user);

        mockMvc.perform(put("/users/me/onboarding")
                        .with(jwt().jwt(token -> token.subject("cognito-sub-123")))
                        .contentType(APPLICATION_JSON)
                        .content(validOnboardingBody()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.onboardingCompleted").value(true))
                .andExpect(jsonPath("$.data.updatedAt").value("2026-08-16T01:00:00Z"));
    }

    @Test
    void onboardingRejectsMoreThanTwoContexts() throws Exception {
        User user = userFixture();
        when(userRepository.findByCognitoSub("cognito-sub-123")).thenReturn(Optional.of(user));

        mockMvc.perform(put("/users/me/onboarding")
                        .with(jwt().jwt(token -> token.subject("cognito-sub-123")))
                        .contentType(APPLICATION_JSON)
                        .content("""
                                {
                                  "baseline": {
                                    "smokingFrequency": "SIX_TO_TEN",
                                    "smokingContextCodes": ["STRESS", "AFTER_MEAL", "OTHER"],
                                    "otherContext": "야근할 때"
                                  }
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("INVALID_REQUEST"))
                .andExpect(jsonPath("$.fieldErrors[0].field")
                        .value("baseline.smokingContextCodes"));
    }

    @Test
    void jwtSubjectResolvesInternalUser() throws Exception {
        UUID userId = UUID.fromString("30000000-0000-0000-0000-000000000001");
        User user = mock(User.class);
        when(user.getId()).thenReturn(userId);
        when(user.getEmail()).thenReturn("test@nextime.local");
        when(user.isOnboardingCompleted()).thenReturn(false);
        when(user.getCreatedAt()).thenReturn(Instant.parse("2026-08-09T00:00:00Z"));
        when(userRepository.findByCognitoSub("cognito-sub-123")).thenReturn(Optional.of(user));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        mockMvc.perform(get("/users/me").with(jwt().jwt(token -> token.subject("cognito-sub-123"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(userId.toString()))
                .andExpect(jsonPath("$.data.email").value("test@nextime.local"))
                .andExpect(jsonPath("$.data.onboardingCompleted").value(false));
    }

    @Test
    void registeredJwtWithoutInternalUserReturns401() throws Exception {
        when(userRepository.findByCognitoSub("unknown-sub")).thenReturn(Optional.empty());

        mockMvc.perform(get("/users/me").with(jwt().jwt(token -> token.subject("unknown-sub"))))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("USER_NOT_REGISTERED"));
    }

    private User userFixture() {
        User user = mock(User.class);
        when(user.getId()).thenReturn(UUID.fromString("30000000-0000-0000-0000-000000000001"));
        when(user.getEmail()).thenReturn("test@nextime.local");
        when(user.isOnboardingCompleted()).thenReturn(false);
        when(user.getCreatedAt()).thenReturn(Instant.parse("2026-08-16T00:00:00Z"));
        return user;
    }

    private String validOnboardingBody() {
        return """
                {
                  "baseline": {
                    "smokingFrequency": "SIX_TO_TEN",
                    "smokingContextCodes": ["STRESS", "OTHER"],
                    "otherContext": "야근할 때"
                  }
                }
                """;
    }
}
