package com.nextime.nexttime.session.api;

import com.nextime.common.config.WebConfig;
import com.nextime.common.error.GlobalExceptionHandler;
import com.nextime.nexttime.session.application.NextTimeService;
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
class NextTimeControllerTest {

    private static final UUID USER_ID = UUID.fromString("30000000-0000-0000-0000-000000000001");
    private static final UUID SESSION_ID = UUID.fromString("40000000-0000-0000-0000-000000000001");

    @Autowired
    private MockMvc mockMvc;
    @MockitoBean
    private NextTimeService nextTimeService;
    @MockitoBean
    private UserRepository userRepository;
    @MockitoBean
    private JwtDecoder jwtDecoder;

    @Test
    void rewindsSession() throws Exception {
        authenticate();
        when(nextTimeService.rewind(USER_ID, SESSION_ID)).thenReturn(new NextTimeSessionResponse(
                SESSION_ID,
                NextTimeSessionStatus.CREATED,
                Instant.parse("2026-08-16T14:20:00Z")
        ));

        mockMvc.perform(post(path("rewind")).with(jwt().jwt(token -> token.subject("cognito-sub"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.sessionId").value(SESSION_ID.toString()))
                .andExpect(jsonPath("$.data.status").value("CREATED"));
    }

    private void authenticate() {
        User user = mock(User.class);
        when(user.getId()).thenReturn(USER_ID);
        when(userRepository.findByCognitoSub("cognito-sub")).thenReturn(Optional.of(user));
    }

    private String path(String action) {
        return "/next-time/sessions/" + SESSION_ID + "/" + action;
    }
}
