package com.nextime.pattern.api;

import com.nextime.common.config.WebConfig;
import com.nextime.common.error.GlobalExceptionHandler;
import com.nextime.pattern.application.PatternOverviewService;
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
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PatternOverviewController.class)
@Import({SecurityConfig.class, RestAuthenticationEntryPoint.class, CurrentUserArgumentResolver.class,
        WebConfig.class, GlobalExceptionHandler.class})
class PatternOverviewControllerTest {

    private static final UUID USER_ID = UUID.fromString("30000000-0000-0000-0000-000000000001");
    private static final String PATH = "/patterns/overview";

    @Autowired
    private MockMvc mockMvc;
    @MockitoBean
    private PatternOverviewService patternOverviewService;
    @MockitoBean
    private UserRepository userRepository;
    @MockitoBean
    private JwtDecoder jwtDecoder;

    @Test
    void unauthenticatedRequestReturns401() throws Exception {
        mockMvc.perform(get(PATH)).andExpect(status().isUnauthorized());
    }

    @Test
    void returnsSevenDayOverview() throws Exception {
        authenticate();
        when(patternOverviewService.getOverview(USER_ID)).thenReturn(response());

        mockMvc.perform(get(PATH).with(jwt().jwt(token -> token.subject("cognito-sub"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.dataStatus").value("AVAILABLE"))
                .andExpect(jsonPath("$.data.completedResultCount").value(5))
                .andExpect(jsonPath("$.data.period.timezone").value("Asia/Seoul"))
                .andExpect(jsonPath("$.data.smokingAmount.direction").value("DECREASED"))
                .andExpect(jsonPath("$.data.smokingTime.currentPrimarySlot.startHour").value(18))
                .andExpect(jsonPath("$.data.easyReductionContexts[0].context.code").value("AFTER_WORK"))
                .andExpect(jsonPath("$.data.effectiveActions[0].mission.code").value("SHORT_WALK"))
                .andExpect(jsonPath("$.data.actionCatalog[0].name").value("잠깐 걷기"));

        verify(patternOverviewService).getOverview(USER_ID);
    }

    private void authenticate() {
        User user = mock(User.class);
        when(user.getId()).thenReturn(USER_ID);
        when(userRepository.findByCognitoSub("cognito-sub")).thenReturn(Optional.of(user));
    }

    private PatternOverviewResponse response() {
        UUID triggerId = UUID.fromString("10000000-0000-0000-0000-000000000001");
        UUID missionId = UUID.fromString("20000000-0000-0000-0000-000000000003");
        var context = new PatternOverviewResponse.ContextSummary(
                triggerId, "AFTER_WORK", "일·공부가 끝난 뒤");
        var mission = new PatternOverviewResponse.MissionSummary(
                missionId, "SHORT_WALK", "잠깐 걷기");
        Instant currentFrom = Instant.parse("2026-08-17T15:00:00Z");
        Instant currentTo = Instant.parse("2026-08-20T12:00:00Z");

        return new PatternOverviewResponse(
                PatternOverviewResponse.DataStatus.AVAILABLE,
                5,
                5,
                new PatternOverviewResponse.Period(
                        "Asia/Seoul", currentFrom, currentTo,
                        currentFrom.minusSeconds(604800), currentTo.minusSeconds(604800)
                ),
                new PatternOverviewResponse.SmokingAmount(
                        true, 3, 3, 1.0, 2.0, 1.0,
                        PatternOverviewResponse.ChangeDirection.DECREASED,
                        "지난주보다 줄었어요.", List.of()
                ),
                new PatternOverviewResponse.SmokingTime(
                        true,
                        new PatternOverviewResponse.TimeSlot(21, 24, 2),
                        new PatternOverviewResponse.TimeSlot(18, 21, 3),
                        List.of(), List.of(), "주요 시간대가 바뀌었어요."
                ),
                new PatternOverviewResponse.ReductionBriefing(context, mission, "잠깐 걸어보세요."),
                List.of(new PatternOverviewResponse.RankedContext(1, context, 2, 3, 66.7)),
                List.of(new PatternOverviewResponse.RankedAction(1, mission, 2, 3, 66.7)),
                List.of(new PatternOverviewResponse.ActionCatalogItem(
                        missionId, "SHORT_WALK", "잠깐 걷기", true, (short) 1))
        );
    }
}
