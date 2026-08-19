package com.nextime.device.demo;

import com.nextime.push.WebPushAudience;
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
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Optional;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(MqttDemoController.class)
@Import({SecurityConfig.class, RestAuthenticationEntryPoint.class})
class MqttDemoControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @MockitoBean
    private MqttButtonSubscriber subscriber;
    @MockitoBean
    private ButtonEventStream eventStream;
    @MockitoBean
    private JwtDecoder jwtDecoder;
    @MockitoBean
    private UserRepository userRepository;
    @MockitoBean
    private WebPushAudience audience;

    @Test
    void buttonEventsRequiresAuthentication() throws Exception {
        mockMvc.perform(get("/api/demo/button-events"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void authenticatedUserCanOpenEventStream() throws Exception {
        User user = mock(User.class);
        when(user.getEmail()).thenReturn("test2@example.com");
        when(userRepository.findByCognitoSub("cognito-sub")).thenReturn(Optional.of(user));
        when(audience.allows("test2@example.com")).thenReturn(true);
        when(eventStream.connect()).thenReturn(new SseEmitter());

        mockMvc.perform(get("/api/demo/button-events")
                        .with(jwt().jwt(token -> token.subject("cognito-sub"))))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Type", "text/event-stream"))
                .andExpect(header().string("Cache-Control", "no-cache"))
                .andExpect(header().string("X-Accel-Buffering", "no"));
    }
}
