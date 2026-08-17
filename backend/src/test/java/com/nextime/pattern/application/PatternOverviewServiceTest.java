package com.nextime.pattern.application;

import com.nextime.common.error.BusinessException;
import com.nextime.mission.domain.Mission;
import com.nextime.nexttime.domain.CravingAfter;
import com.nextime.nexttime.domain.CravingBefore;
import com.nextime.nexttime.domain.MissionHelpfulness;
import com.nextime.nexttime.domain.NextTimeResult;
import com.nextime.nexttime.domain.NextTimeSession;
import com.nextime.nexttime.domain.NextTimeSessionRepository;
import com.nextime.nexttime.recommendation.application.MissionRecommendationService;
import com.nextime.pattern.api.PatternOverviewResponse.ChangeDirection;
import com.nextime.pattern.api.PatternOverviewResponse.DataStatus;
import com.nextime.smokingcontext.domain.SmokingContext;
import com.nextime.smokingcontext.domain.SmokingContextType;
import com.nextime.user.domain.User;
import com.nextime.user.domain.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static com.nextime.nexttime.domain.NextTimeSessionStatus.RESULT_RECORDED;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PatternOverviewServiceTest {

    private static final UUID USER_ID = UUID.fromString("30000000-0000-0000-0000-000000000001");
    private static final ZoneId SERVICE_ZONE = ZoneId.of("Asia/Seoul");

    @Mock
    private UserRepository userRepository;
    @Mock
    private NextTimeSessionRepository sessionRepository;
    @Mock
    private MissionRecommendationService recommendationService;

    private PatternOverviewService service;
    private SmokingContext afterWork;
    private SmokingContext stress;
    private SmokingContext smokingArea;
    private SmokingContext home;
    private Mission walk;
    private Mission breathing;

    @BeforeEach
    void setUp() {
        afterWork = context("10000000-0000-0000-0000-000000000001", "AFTER_WORK", "일·공부가 끝난 뒤");
        stress = context("10000000-0000-0000-0000-000000000002", "STRESS", "스트레스");
        smokingArea = context("11000000-0000-0000-0000-000000000001", "NEAR_SMOKING_AREA", "흡연구역 근처");
        home = context("11000000-0000-0000-0000-000000000002", "HOME", "집");
        walk = mission("20000000-0000-0000-0000-000000000003", "SHORT_WALK", "잠깐 걷기");
        breathing = mission("20000000-0000-0000-0000-000000000002", "STEADY_BREATHING", "호흡 가다듬기");
        lenient().when(recommendationService.preview(eq(USER_ID), any(), any(), any()))
                .thenReturn(new MissionRecommendationService.RecommendationPreview(
                        walk,
                        "정책 추천",
                        com.nextime.nexttime.domain.RecommendationSource.RULE
                ));
        service = new PatternOverviewService(userRepository, sessionRepository, recommendationService);
    }

    @Test
    void aggregatesOverviewUsingPolicyWindowsAndThresholds() {
        authenticate(true);

        NextTimeSession current1 = session(
                1, afterWork, smokingArea, walk,
                NextTimeResult.NOT_SMOKED, MissionHelpfulness.HELPFUL
        );
        NextTimeSession current2 = session(
                2, afterWork, smokingArea, walk,
                NextTimeResult.DELAYED, MissionHelpfulness.HELPFUL
        );
        NextTimeSession current3 = session(
                3, stress, home, breathing,
                NextTimeResult.SMOKED, MissionHelpfulness.NEUTRAL
        );
        NextTimeSession current4 = session(
                4, afterWork, smokingArea, walk,
                NextTimeResult.NOT_SMOKED, MissionHelpfulness.HELPFUL
        );
        NextTimeSession current5 = session(
                5, stress, home, breathing,
                NextTimeResult.DELAYED, MissionHelpfulness.NEUTRAL
        );
        NextTimeSession previous1 = session(
                8, stress, home, breathing,
                NextTimeResult.SMOKED, MissionHelpfulness.HELPFUL
        );
        NextTimeSession previous2 = session(
                9, stress, home, breathing,
                NextTimeResult.SMOKED, MissionHelpfulness.NOT_FIT
        );
        NextTimeSession oldBreathing = session(
                20, stress, home, breathing,
                NextTimeResult.NOT_SMOKED, MissionHelpfulness.NEUTRAL
        );

        List<NextTimeSession> thirtyDayResults = List.of(
                current1, current2, current3, current4, current5,
                previous1, previous2, oldBreathing
        );
        when(sessionRepository
                .findByUser_IdAndStatusAndResultRecordedAtGreaterThanEqualOrderByResultRecordedAtDesc(
                        eq(USER_ID), eq(RESULT_RECORDED), any()
                ))
                .thenReturn(thirtyDayResults);
        when(sessionRepository.findByUser_IdAndCreatedAtGreaterThanEqualOrderByCreatedAtDesc(eq(USER_ID), any()))
                .thenReturn(List.of(current1, current2, current3, current4, current5));
        when(sessionRepository.findTop3ByUser_IdAndStatusOrderByResultRecordedAtDesc(USER_ID, RESULT_RECORDED))
                .thenReturn(List.of(current1, current2, current3));

        var response = service.getOverview(USER_ID);

        assertThat(response.dataStatus()).isEqualTo(DataStatus.AVAILABLE);
        assertThat(response.recentResultCount()).isEqualTo(5);
        assertThat(response.insight().topTrigger().code()).isEqualTo("AFTER_WORK");
        assertThat(response.insight().topTrigger().count()).isEqualTo(3);
        assertThat(response.insight().topLocation().code()).isEqualTo("NEAR_SMOKING_AREA");
        assertThat(response.insight().patternReady()).isTrue();
        assertThat(response.insight().periodLabel()).isEqualTo("최근 7일");
        assertThat(response.insight().representativeCraving()).isEqualTo(CravingBefore.HIGH);
        assertThat(response.insight().recommendedAction().code()).isEqualTo("SHORT_WALK");
        assertThat(response.insight().messages().mainPattern())
                .isEqualTo("일·공부가 끝난 뒤에 가장 흔들렸어요");
        assertThat(response.insight().messages().frequency())
                .isEqualTo("기록한 욕구 5번 중 3번");
        assertThat(response.insight().messages().representativeLocation())
                .isEqualTo("특히 흡연구역 근처에서 강했어요");
        assertThat(response.insight().messages().nextAction())
                .isEqualTo("이럴 때 잠깐 걷기 해보세요!");
        assertThat(response.insight().actionEvidence()).isNull();
        assertThat(response.insight().topTimeSlot().startHour()).isEqualTo(12);
        assertThat(response.insight().topTimeSlot().count()).isEqualTo(5);

        assertThat(response.behaviorChange().currentPeriod().totalCount()).isEqualTo(5);
        assertThat(response.behaviorChange().currentPeriod().avoidedImmediateSmokingCount()).isEqualTo(4);
        assertThat(response.behaviorChange().previousPeriod().totalCount()).isEqualTo(2);
        assertThat(response.behaviorChange().change()).isEqualTo(ChangeDirection.INCREASED);

        assertThat(response.effectiveActions()).hasSize(1);
        assertThat(response.effectiveActions().getFirst().code()).isEqualTo("SHORT_WALK");
        assertThat(response.effectiveActions().getFirst().helpfulRate()).isEqualTo(1.0);
        assertThat(response.frequentTriggers()).extracting("code")
                .containsExactly("AFTER_WORK", "STRESS");
        assertThat(response.recentRecords()).hasSize(3);
        assertThat(response.recentRecords().getFirst().recordId()).isEqualTo(current1.getId());
    }

    @Test
    void returnsInsufficientPayloadWhenOnlyOlderRecordsExist() {
        authenticate(true);
        NextTimeSession olderRecord = session(
                8, afterWork, smokingArea, walk,
                NextTimeResult.NOT_SMOKED, MissionHelpfulness.HELPFUL
        );
        when(sessionRepository
                .findByUser_IdAndStatusAndResultRecordedAtGreaterThanEqualOrderByResultRecordedAtDesc(
                        eq(USER_ID), eq(RESULT_RECORDED), any()
                ))
                .thenReturn(List.of(olderRecord));
        when(sessionRepository.findByUser_IdAndCreatedAtGreaterThanEqualOrderByCreatedAtDesc(eq(USER_ID), any()))
                .thenReturn(List.of(olderRecord));

        var response = service.getOverview(USER_ID);

        assertThat(response.dataStatus()).isEqualTo(DataStatus.INSUFFICIENT);
        assertThat(response.recentResultCount()).isEqualTo(1);
        assertThat(response.insight()).isNull();
        assertThat(response.behaviorChange()).isNull();
        assertThat(response.effectiveActions()).isEmpty();
        assertThat(response.frequentTriggers()).isEmpty();
        assertThat(response.recentRecords()).isEmpty();
    }

    @Test
    void excludesActionWhenHelpfulRateIsExactlyFiftyPercent() {
        authenticate(true);
        NextTimeSession helpful = session(
                1, afterWork, smokingArea, breathing,
                NextTimeResult.NOT_SMOKED, MissionHelpfulness.HELPFUL
        );
        NextTimeSession notFit = session(
                2, afterWork, smokingArea, breathing,
                NextTimeResult.SMOKED, MissionHelpfulness.NOT_FIT
        );
        NextTimeSession singleWalk = session(
                3, stress, home, walk,
                NextTimeResult.NOT_SMOKED, MissionHelpfulness.HELPFUL
        );
        NextTimeSession walkNotFit1 = session(
                4, stress, home, walk,
                NextTimeResult.SMOKED, MissionHelpfulness.NOT_FIT
        );
        NextTimeSession walkNotFit2 = session(
                5, stress, home, walk,
                NextTimeResult.SMOKED, MissionHelpfulness.NOT_FIT
        );
        List<NextTimeSession> results = List.of(
                helpful, notFit, singleWalk, walkNotFit1, walkNotFit2
        );

        when(sessionRepository
                .findByUser_IdAndStatusAndResultRecordedAtGreaterThanEqualOrderByResultRecordedAtDesc(
                        eq(USER_ID), eq(RESULT_RECORDED), any()
                ))
                .thenReturn(results);
        when(sessionRepository.findByUser_IdAndCreatedAtGreaterThanEqualOrderByCreatedAtDesc(eq(USER_ID), any()))
                .thenReturn(results);
        when(sessionRepository.findTop3ByUser_IdAndStatusOrderByResultRecordedAtDesc(USER_ID, RESULT_RECORDED))
                .thenReturn(results);

        var response = service.getOverview(USER_ID);

        assertThat(response.effectiveActions()).isEmpty();
    }

    @Test
    void returnsInsufficientPayloadWhenRecentRecordsAreFewerThanFive() {
        authenticate(true);
        NextTimeSession first = session(
                1, afterWork, smokingArea, walk,
                NextTimeResult.NOT_SMOKED, MissionHelpfulness.HELPFUL
        );
        NextTimeSession second = session(
                2, stress, home, breathing,
                NextTimeResult.DELAYED, MissionHelpfulness.HELPFUL
        );
        NextTimeSession third = session(
                3, afterWork, smokingArea, walk,
                NextTimeResult.NOT_SMOKED, MissionHelpfulness.HELPFUL
        );
        NextTimeSession fourth = session(
                4, stress, home, breathing,
                NextTimeResult.SMOKED, MissionHelpfulness.NEUTRAL
        );
        List<NextTimeSession> results = List.of(first, second, third, fourth);

        when(sessionRepository
                .findByUser_IdAndStatusAndResultRecordedAtGreaterThanEqualOrderByResultRecordedAtDesc(
                        eq(USER_ID), eq(RESULT_RECORDED), any()
                ))
                .thenReturn(results);
        when(sessionRepository.findByUser_IdAndCreatedAtGreaterThanEqualOrderByCreatedAtDesc(eq(USER_ID), any()))
                .thenReturn(results);

        var response = service.getOverview(USER_ID);

        assertThat(response.dataStatus()).isEqualTo(DataStatus.INSUFFICIENT);
        assertThat(response.recentResultCount()).isEqualTo(4);
        assertThat(response.insight()).isNull();
        assertThat(response.behaviorChange()).isNull();
        assertThat(response.effectiveActions()).isEmpty();
        assertThat(response.frequentTriggers()).isEmpty();
        assertThat(response.recentRecords()).isEmpty();
    }

    @Test
    void rejectsUserWhoHasNotCompletedOnboarding() {
        authenticate(false);

        assertThatThrownBy(() -> service.getOverview(USER_ID))
                .isInstanceOf(BusinessException.class)
                .hasMessage("온보딩을 완료한 후 내 패턴을 확인할 수 있습니다.");
    }

    private void authenticate(boolean onboardingCompleted) {
        User user = mock(User.class);
        when(user.isOnboardingCompleted()).thenReturn(onboardingCompleted);
        when(userRepository.findById(USER_ID)).thenReturn(Optional.of(user));
    }

    private NextTimeSession session(
            int daysAgo,
            SmokingContext trigger,
            SmokingContext location,
            Mission mission,
            NextTimeResult result,
            MissionHelpfulness helpfulness
    ) {
        NextTimeSession session = mock(NextTimeSession.class);
        Instant occurredAt = LocalDate.now(SERVICE_ZONE)
                .minusDays(daysAgo)
                .atTime(12, 30)
                .atZone(SERVICE_ZONE)
                .toInstant();
        String missionCode = mission.getCode();
        String missionName = mission.getName();
        UUID sessionId = UUID.nameUUIDFromBytes((missionCode + daysAgo).getBytes());

        lenient().when(session.getId()).thenReturn(sessionId);
        lenient().when(session.getResultRecordedAt()).thenReturn(occurredAt);
        lenient().when(session.getCreatedAt()).thenReturn(occurredAt);
        lenient().when(session.getResult()).thenReturn(result);
        lenient().when(session.getMissionHelpfulness()).thenReturn(helpfulness);
        lenient().when(session.getRecommendedMission()).thenReturn(mission);
        lenient().when(session.getMissionCodeSnapshot()).thenReturn(missionCode);
        lenient().when(session.getMissionNameSnapshot()).thenReturn(missionName);
        lenient().when(session.getCravingBefore()).thenReturn(CravingBefore.HIGH);
        lenient().when(session.getCravingAfter()).thenReturn(CravingAfter.MEDIUM);
        lenient().when(session.contextOf(SmokingContextType.TRIGGER)).thenReturn(trigger);
        lenient().when(session.contextOf(SmokingContextType.LOCATION)).thenReturn(location);
        return session;
    }

    private SmokingContext context(String id, String code, String name) {
        SmokingContext context = mock(SmokingContext.class);
        lenient().when(context.getId()).thenReturn(UUID.fromString(id));
        lenient().when(context.getCode()).thenReturn(code);
        lenient().when(context.getName()).thenReturn(name);
        return context;
    }

    private Mission mission(String id, String code, String name) {
        Mission mission = mock(Mission.class);
        lenient().when(mission.getId()).thenReturn(UUID.fromString(id));
        lenient().when(mission.getCode()).thenReturn(code);
        lenient().when(mission.getName()).thenReturn(name);
        return mission;
    }
}
