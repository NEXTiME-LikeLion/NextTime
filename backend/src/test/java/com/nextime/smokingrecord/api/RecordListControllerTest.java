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
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static com.nextime.smokingrecord.api.RecordDetailResponse.RecordType.MANUAL_SMOKING;
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
class RecordListControllerTest {

    private static final UUID USER_ID = UUID.fromString("30000000-0000-0000-0000-000000000001");

    @Autowired
    private MockMvc mockMvc;
    @MockitoBean
    private RecordListService recordListService;
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
        mockMvc.perform(get("/records")).andExpect(status().isUnauthorized());
    }

    @Test
    void returnsRecordsUsingDefaultLimit() throws Exception {
        authenticate();
        UUID recordId = UUID.randomUUID();
        var item = new RecordListResponse.RecordItem(
                recordId,
                MANUAL_SMOKING,
                Instant.parse("2026-08-16T21:04:13Z"),
                null,
                null,
                null,
                com.nextime.nexttime.domain.NextTimeResult.SMOKED,
                null,
                null,
                null
        );
        when(recordListService.getRecords(USER_ID, 10))
                .thenReturn(new RecordListResponse(List.of(item)));

        mockMvc.perform(get("/records").with(jwt().jwt(token -> token.subject("cognito-sub"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.records[0].recordId").value(recordId.toString()))
                .andExpect(jsonPath("$.data.records[0].recordType").value("MANUAL_SMOKING"))
                .andExpect(jsonPath("$.data.records[0].result").value("SMOKED"));

        verify(recordListService).getRecords(USER_ID, 10);
    }

    @Test
    void passesRequestedLimit() throws Exception {
        authenticate();
        when(recordListService.getRecords(USER_ID, 20))
                .thenReturn(new RecordListResponse(List.of()));

        mockMvc.perform(get("/records")
                        .param("limit", "20")
                        .with(jwt().jwt(token -> token.subject("cognito-sub"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.records").isEmpty());

        verify(recordListService).getRecords(USER_ID, 20);
    }

    private void authenticate() {
        User user = mock(User.class);
        when(user.getId()).thenReturn(USER_ID);
        when(userRepository.findByCognitoSub("cognito-sub")).thenReturn(Optional.of(user));
    }
}
