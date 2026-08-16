package com.nextime.ai.copingprofile.api;

import com.nextime.ai.copingprofile.application.CopingProfileService;
import com.nextime.ai.copingprofile.domain.CopingAction;
import com.nextime.ai.copingprofile.domain.CopingProfile;
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

import java.util.List;
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

@WebMvcTest(CopingProfileController.class)
@Import({SecurityConfig.class, RestAuthenticationEntryPoint.class, CurrentUserArgumentResolver.class,
        WebConfig.class, GlobalExceptionHandler.class})
class CopingProfileControllerTest {

    private static final UUID USER_ID = UUID.fromString("30000000-0000-0000-0000-000000000001");

    @Autowired
    private MockMvc mockMvc;
    @MockitoBean
    private CopingProfileService service;
    @MockitoBean
    private UserRepository userRepository;
    @MockitoBean
    private JwtDecoder jwtDecoder;

    @Test
    void unauthenticatedRequestReturns401() throws Exception {
        mockMvc.perform(post("/ai/onboarding/coping-profile")
                        .contentType(APPLICATION_JSON)
                        .content(validBody()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void createsCopingProfile() throws Exception {
        authenticate();
        CopingProfile profile = mock(CopingProfile.class);
        when(profile.getId()).thenReturn(UUID.fromString("80000000-0000-0000-0000-000000000001"));
        when(profile.getActions()).thenReturn(List.of(CopingAction.DRINK_WATER, CopingAction.TAKE_A_WALK));
        when(service.create(eq(USER_ID), any(CopingProfileRequest.class))).thenReturn(profile);

        mockMvc.perform(post("/ai/onboarding/coping-profile")
                        .with(jwt().jwt(token -> token.subject("cognito-sub")))
                        .contentType(APPLICATION_JSON)
                        .content(validBody()))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.profileId").value("80000000-0000-0000-0000-000000000001"))
                .andExpect(jsonPath("$.data.actions[0]").value("DRINK_WATER"))
                .andExpect(jsonPath("$.data.actions[1]").value("TAKE_A_WALK"));
    }

    private void authenticate() {
        User user = mock(User.class);
        when(user.getId()).thenReturn(USER_ID);
        when(userRepository.findByCognitoSub("cognito-sub")).thenReturn(Optional.of(user));
    }

    private String validBody() {
        return """
                {
                  "actions": ["DRINK_WATER", "TAKE_A_WALK"],
                  "customAction": null
                }
                """;
    }
}
