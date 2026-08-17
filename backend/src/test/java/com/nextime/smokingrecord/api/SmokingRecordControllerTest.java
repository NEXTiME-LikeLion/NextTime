package com.nextime.smokingrecord.api;

import com.nextime.common.config.WebConfig;
import com.nextime.common.error.GlobalExceptionHandler;
import com.nextime.security.CurrentUserArgumentResolver;
import com.nextime.security.RestAuthenticationEntryPoint;
import com.nextime.security.SecurityConfig;
import com.nextime.smokingrecord.application.RecordDetailService;
import com.nextime.smokingrecord.application.RecordListService;
import com.nextime.smokingrecord.application.SmokingRecordService;
import com.nextime.user.domain.User;
import com.nextime.user.domain.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(SmokingRecordController.class)
@Import({SecurityConfig.class, RestAuthenticationEntryPoint.class, CurrentUserArgumentResolver.class,
        WebConfig.class, GlobalExceptionHandler.class})
class SmokingRecordControllerTest {

    private static final UUID USER_ID = UUID.fromString("30000000-0000-0000-0000-000000000001");
    private static final UUID TRIGGER_ID = UUID.fromString("10000000-0000-0000-0000-000000000001");
    private static final String PATH = "/records/smoking";

    @Autowired
    private MockMvc mockMvc;
    @MockitoBean
    private SmokingRecordService smokingRecordService;
    @MockitoBean
    private RecordDetailService recordDetailService;
    @MockitoBean
    private RecordListService recordListService;
    @MockitoBean
    private UserRepository userRepository;
    @MockitoBean
    private JwtDecoder jwtDecoder;

    @Test
    void unauthenticatedRequestReturns401() throws Exception {
        mockMvc.perform(post(PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void createsSmokingRecord() throws Exception {
        authenticate();
        Instant recordedAt = Instant.parse("2026-08-17T05:54:00Z");
        SmokingRecordResponse response = new SmokingRecordResponse(
                UUID.fromString("40000000-0000-0000-0000-000000000001"),
                recordedAt,
                new SmokingRecordResponse.TriggerResponse(TRIGGER_ID, "AFTER_MEAL", "밥을 먹고 나서"),
                recordedAt
        );
        when(smokingRecordService.create(eq(USER_ID), any(CreateSmokingRecordRequest.class)))
                .thenReturn(response);

        mockMvc.perform(post(PATH)
                        .with(jwt().jwt(token -> token.subject("cognito-sub")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"triggerContextId\":\"" + TRIGGER_ID + "\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.recordId").value("40000000-0000-0000-0000-000000000001"))
                .andExpect(jsonPath("$.data.smokedAt").value("2026-08-17T05:54:00Z"))
                .andExpect(jsonPath("$.data.trigger.code").value("AFTER_MEAL"));

        verify(smokingRecordService).create(eq(USER_ID), any(CreateSmokingRecordRequest.class));
    }

    private void authenticate() {
        User user = mock(User.class);
        when(user.getId()).thenReturn(USER_ID);
        when(userRepository.findByCognitoSub("cognito-sub")).thenReturn(Optional.of(user));
    }
}
