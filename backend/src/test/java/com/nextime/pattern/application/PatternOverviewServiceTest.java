package com.nextime.pattern.application;

import com.nextime.common.error.BusinessException;
import com.nextime.mission.domain.MissionRepository;
import com.nextime.nexttime.domain.NextTimeSessionRepository;
import com.nextime.nexttime.recommendation.application.MissionRecommendationService;
import com.nextime.pattern.api.PatternOverviewResponse.DataStatus;
import com.nextime.smokingrecord.domain.SmokingRecordRepository;
import com.nextime.user.domain.User;
import com.nextime.user.domain.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static com.nextime.nexttime.domain.NextTimeSessionStatus.RESULT_RECORDED;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PatternOverviewServiceTest {

    private static final UUID USER_ID = UUID.fromString("30000000-0000-0000-0000-000000000001");

    @Mock private UserRepository userRepository;
    @Mock private NextTimeSessionRepository sessionRepository;
    @Mock private SmokingRecordRepository smokingRecordRepository;
    @Mock private MissionRepository missionRepository;
    @Mock private MissionRecommendationService recommendationService;

    private PatternOverviewService service;

    @BeforeEach
    void setUp() {
        service = new PatternOverviewService(
                userRepository, sessionRepository, smokingRecordRepository,
                missionRepository, recommendationService
        );
    }

    @Test
    void returnsInsufficientUntilFiveResultsHaveBeenRecorded() {
        authenticate(true);
        when(sessionRepository.countByUser_IdAndStatus(USER_ID, RESULT_RECORDED)).thenReturn(4L);
        when(missionRepository.findAllByOrderByDisplayOrderAsc()).thenReturn(List.of());

        var response = service.getOverview(USER_ID);

        assertThat(response.dataStatus()).isEqualTo(DataStatus.INSUFFICIENT);
        assertThat(response.completedResultCount()).isEqualTo(4);
        assertThat(response.requiredResultCount()).isEqualTo(5);
        assertThat(response.smokingAmount()).isNull();
        assertThat(response.easyReductionContexts()).isEmpty();
    }

    @Test
    void returnsAvailableOverviewAfterFiveCumulativeResults() {
        authenticate(true);
        when(sessionRepository.countByUser_IdAndStatus(USER_ID, RESULT_RECORDED)).thenReturn(5L);
        when(missionRepository.findAllByOrderByDisplayOrderAsc()).thenReturn(List.of());
        when(sessionRepository
                .findByUser_IdAndStatusAndResultRecordedAtGreaterThanEqualAndResultRecordedAtLessThanOrderByResultRecordedAtDesc(
                        eq(USER_ID), eq(RESULT_RECORDED), any(Instant.class), any(Instant.class)))
                .thenReturn(List.of());
        when(smokingRecordRepository.findByUser_IdAndSmokedAtGreaterThanEqualAndSmokedAtLessThan(
                eq(USER_ID), any(Instant.class), any(Instant.class)))
                .thenReturn(List.of());

        var response = service.getOverview(USER_ID);

        assertThat(response.dataStatus()).isEqualTo(DataStatus.AVAILABLE);
        assertThat(response.period().timezone()).isEqualTo("Asia/Seoul");
        assertThat(response.smokingAmount().comparisonAvailable()).isFalse();
        assertThat(response.smokingAmount().dailyCounts()).hasSize(7);
        assertThat(response.smokingTime().currentSlots()).hasSize(8);
        assertThat(response.reductionBriefing()).isNull();
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
}
