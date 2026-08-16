package com.nextime.home.api;

import com.nextime.ai.nextme.domain.NextBudTheme;
import com.nextime.common.config.WebConfig;
import com.nextime.common.error.GlobalExceptionHandler;
import com.nextime.home.application.HomeService;
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

import java.util.Optional;
import java.util.UUID;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(HomeController.class)
@Import({SecurityConfig.class, RestAuthenticationEntryPoint.class, CurrentUserArgumentResolver.class,
        WebConfig.class, GlobalExceptionHandler.class})
class HomeControllerTest {

    private static final UUID USER_ID = UUID.fromString("30000000-0000-0000-0000-000000000001");

    @Autowired
    private MockMvc mockMvc;
    @MockitoBean
    private HomeService homeService;
    @MockitoBean
    private UserRepository userRepository;
    @MockitoBean
    private JwtDecoder jwtDecoder;

    @Test
    void unauthenticatedRequestReturns401() throws Exception {
        mockMvc.perform(get("/home")).andExpect(status().isUnauthorized());
    }

    @Test
    void returnsHomeData() throws Exception {
        authenticate();
        HomeResponse response = new HomeResponse(
                new HomeResponse.NextMe(
                        "먼저 멈추지 않는 나",
                        "내 체력 때문에 포기하고 싶지 않아.",
                        NextBudTheme.NEXTBUD_HEALTH_01
                ),
                null,
                new HomeResponse.TodaySummary(5, 3, 1, 1, null)
        );
        when(homeService.getHome(USER_ID)).thenReturn(response);

        mockMvc.perform(get("/home").with(jwt().jwt(token -> token.subject("cognito-sub"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.nextMe.headline").value("먼저 멈추지 않는 나"))
                .andExpect(jsonPath("$.data.nextMe.nextBudTheme").value("NEXTBUD_HEALTH_01"))
                .andExpect(jsonPath("$.data.activeNextTimeSession").doesNotExist())
                .andExpect(jsonPath("$.data.todaySummary.totalAttemptCount").value(5))
                .andExpect(jsonPath("$.data.todaySummary.overcomeCount").value(3));

        verify(homeService).getHome(USER_ID);
    }

    private void authenticate() {
        User user = mock(User.class);
        when(user.getId()).thenReturn(USER_ID);
        when(userRepository.findByCognitoSub("cognito-sub")).thenReturn(Optional.of(user));
    }
}
