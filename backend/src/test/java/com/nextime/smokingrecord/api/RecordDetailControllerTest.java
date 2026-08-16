package com.nextime.smokingrecord.api;

import com.nextime.common.config.WebConfig;
import com.nextime.common.error.GlobalExceptionHandler;
import com.nextime.nexttime.domain.NextTimeResult;
import com.nextime.smokingrecord.application.RecordDetailService;
import com.nextime.smokingrecord.application.SmokingRecordService;
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
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(SmokingRecordController.class)
@Import({SecurityConfig.class, RestAuthenticationEntryPoint.class, CurrentUserArgumentResolver.class,
        WebConfig.class, GlobalExceptionHandler.class})
class RecordDetailControllerTest {

    private static final UUID USER_ID = UUID.fromString("30000000-0000-0000-0000-000000000001");
    private static final UUID RECORD_ID = UUID.fromString("40000000-0000-0000-0000-000000000001");
    private static final String PATH = "/records/" + RECORD_ID;

    @Autowired
    private MockMvc mockMvc;
    @MockitoBean
    private RecordDetailService recordDetailService;
    @MockitoBean
    private SmokingRecordService smokingRecordService;
    @MockitoBean
    private UserRepository userRepository;
    @MockitoBean
    private JwtDecoder jwtDecoder;

    @Test
    void unauthenticatedRequestReturns401() throws Exception {
        mockMvc.perform(get(PATH)).andExpect(status().isUnauthorized());
    }

    @Test
    void returnsManualSmokingRecordDetail() throws Exception {
        authenticate();
        RecordDetailResponse response = new RecordDetailResponse(
                RECORD_ID,
                RecordDetailResponse.RecordType.MANUAL_SMOKING,
                Instant.parse("2026-08-16T21:04:13Z"),
                new RecordDetailResponse.ContextResponse(
                        UUID.fromString("10000000-0000-0000-0000-000000000001"),
                        "AFTER_MEAL",
                        "밥을 먹고 나서"
                ),
                null,
                null,
                NextTimeResult.SMOKED,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null
        );
        when(recordDetailService.getDetail(USER_ID, RECORD_ID)).thenReturn(response);

        mockMvc.perform(get(PATH).with(jwt().jwt(token -> token.subject("cognito-sub"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.recordId").value(RECORD_ID.toString()))
                .andExpect(jsonPath("$.data.recordType").value("MANUAL_SMOKING"))
                .andExpect(jsonPath("$.data.trigger.code").value("AFTER_MEAL"))
                .andExpect(jsonPath("$.data.result").value("SMOKED"))
                .andExpect(jsonPath("$.data.mission").doesNotExist());

        verify(recordDetailService).getDetail(USER_ID, RECORD_ID);
    }

    private void authenticate() {
        User user = mock(User.class);
        when(user.getId()).thenReturn(USER_ID);
        when(userRepository.findByCognitoSub("cognito-sub")).thenReturn(Optional.of(user));
    }
}
