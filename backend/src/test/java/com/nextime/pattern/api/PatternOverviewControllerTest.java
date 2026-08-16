package com.nextime.pattern.api;

import com.nextime.common.config.WebConfig;
import com.nextime.common.error.GlobalExceptionHandler;
import com.nextime.nexttime.domain.CravingAfter;
import com.nextime.nexttime.domain.CravingBefore;
import com.nextime.nexttime.domain.CravingChange;
import com.nextime.nexttime.domain.NextTimeResult;
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
                .andExpect(jsonPath("$.data.period.value").value("7d"))
                .andExpect(jsonPath("$.data.dataStatus").value("AVAILABLE"))
                .andExpect(jsonPath("$.data.recentResultCount").value(3))
                .andExpect(jsonPath("$.data.insight.topTrigger.code").value("AFTER_WORK"))
                .andExpect(jsonPath("$.data.insight.topLocation.code").value("NEAR_SMOKING_AREA"))
                .andExpect(jsonPath("$.data.behaviorChange.change").value("INCREASED"))
                .andExpect(jsonPath("$.data.effectiveActions[0].code").value("SHORT_WALK"))
                .andExpect(jsonPath("$.data.recentRecords[0].result").value("NOT_SMOKED"));

        verify(patternOverviewService).getOverview(USER_ID);
    }

    private void authenticate() {
        User user = mock(User.class);
        when(user.getId()).thenReturn(USER_ID);
        when(userRepository.findByCognitoSub("cognito-sub")).thenReturn(Optional.of(user));
    }

    private PatternOverviewResponse response() {
        UUID triggerId = UUID.fromString("10000000-0000-0000-0000-000000000001");
        UUID locationId = UUID.fromString("11000000-0000-0000-0000-000000000001");
        UUID missionId = UUID.fromString("20000000-0000-0000-0000-000000000003");
        UUID recordId = UUID.fromString("40000000-0000-0000-0000-000000000001");

        PatternOverviewResponse.ContextCount trigger =
                new PatternOverviewResponse.ContextCount(triggerId, "AFTER_WORK", "일·공부가 끝난 뒤", 2);
        PatternOverviewResponse.ContextCount location =
                new PatternOverviewResponse.ContextCount(locationId, "NEAR_SMOKING_AREA", "흡연구역 근처", 2);

        return new PatternOverviewResponse(
                new PatternOverviewResponse.Period(
                        "7d",
                        Instant.parse("2026-08-10T15:00:00Z"),
                        Instant.parse("2026-08-17T15:00:00Z")
                ),
                PatternOverviewResponse.DataStatus.AVAILABLE,
                3,
                new PatternOverviewResponse.Insight(
                        trigger,
                        location,
                        new PatternOverviewResponse.TimeSlot(18, 20, 4)
                ),
                new PatternOverviewResponse.BehaviorChange(
                        new PatternOverviewResponse.PeriodResult(5, 1),
                        new PatternOverviewResponse.PeriodResult(5, 3),
                        PatternOverviewResponse.ChangeDirection.INCREASED
                ),
                List.of(new PatternOverviewResponse.EffectiveAction(
                        missionId, "SHORT_WALK", "잠깐 걷기", 3, 2, 0.6667, 3, 2
                )),
                List.of(trigger),
                List.of(new PatternOverviewResponse.RecentRecord(
                        recordId,
                        Instant.parse("2026-08-17T09:24:00Z"),
                        new PatternOverviewResponse.ContextSummary(triggerId, "AFTER_WORK", "일·공부가 끝난 뒤"),
                        new PatternOverviewResponse.MissionSummary(missionId, "SHORT_WALK", "잠깐 걷기"),
                        NextTimeResult.NOT_SMOKED,
                        CravingBefore.HIGH,
                        CravingAfter.MEDIUM,
                        CravingChange.DECREASED
                ))
        );
    }
}
