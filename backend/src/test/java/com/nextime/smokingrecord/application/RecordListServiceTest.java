package com.nextime.smokingrecord.application;

import com.nextime.common.error.BusinessException;
import com.nextime.nexttime.domain.NextTimeSession;
import com.nextime.nexttime.domain.NextTimeSessionRepository;
import com.nextime.smokingrecord.api.RecordDetailResponse.RecordType;
import com.nextime.smokingrecord.domain.SmokingRecord;
import com.nextime.smokingrecord.domain.SmokingRecordRepository;
import com.nextime.user.domain.User;
import com.nextime.user.domain.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Pageable;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static com.nextime.nexttime.domain.NextTimeResult.NOT_SMOKED;
import static com.nextime.nexttime.domain.NextTimeSessionStatus.RESULT_RECORDED;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RecordListServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private SmokingRecordRepository smokingRecordRepository;
    @Mock
    private NextTimeSessionRepository nextTimeSessionRepository;

    private RecordListService service;

    @BeforeEach
    void setUp() {
        service = new RecordListService(userRepository, smokingRecordRepository, nextTimeSessionRepository);
    }

    @Test
    void combinesRecordsAndReturnsNewestFirst() {
        UUID userId = UUID.randomUUID();
        User user = onboardedUser();
        SmokingRecord oldManual = manualRecord(
                UUID.randomUUID(),
                Instant.parse("2026-08-16T10:00:00Z")
        );
        NextTimeSession newestNextTime = nextTimeRecord(
                UUID.randomUUID(),
                Instant.parse("2026-08-16T12:00:00Z")
        );
        SmokingRecord middleManual = manualRecord(
                UUID.randomUUID(),
                Instant.parse("2026-08-16T11:00:00Z")
        );
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(smokingRecordRepository.findByUser_IdOrderBySmokedAtDesc(
                org.mockito.ArgumentMatchers.eq(userId), any(Pageable.class)
        )).thenReturn(List.of(middleManual, oldManual));
        when(nextTimeSessionRepository.findByUser_IdAndStatusOrderByResultRecordedAtDesc(
                org.mockito.ArgumentMatchers.eq(userId),
                org.mockito.ArgumentMatchers.eq(RESULT_RECORDED),
                any(Pageable.class)
        )).thenReturn(List.of(newestNextTime));

        var response = service.getRecords(userId, 10);

        assertThat(response.records()).hasSize(3);
        assertThat(response.records()).extracting(item -> item.recordedAt())
                .containsExactly(
                        Instant.parse("2026-08-16T12:00:00Z"),
                        Instant.parse("2026-08-16T11:00:00Z"),
                        Instant.parse("2026-08-16T10:00:00Z")
                );
        assertThat(response.records().get(0).recordType()).isEqualTo(RecordType.NEXT_TIME);
        assertThat(response.records().get(1).recordType()).isEqualTo(RecordType.MANUAL_SMOKING);
    }

    @Test
    void limitsCombinedRecords() {
        UUID userId = UUID.randomUUID();
        User user = onboardedUser();
        SmokingRecord newestManual = manualRecord(
                UUID.randomUUID(), Instant.parse("2026-08-16T12:00:00Z")
        );
        SmokingRecord oldestManual = manualRecord(
                UUID.randomUUID(), Instant.parse("2026-08-16T10:00:00Z")
        );
        NextTimeSession middleNextTime = nextTimeRecord(
                UUID.randomUUID(), Instant.parse("2026-08-16T11:00:00Z")
        );
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(smokingRecordRepository.findByUser_IdOrderBySmokedAtDesc(
                org.mockito.ArgumentMatchers.eq(userId), any(Pageable.class)
        )).thenReturn(List.of(newestManual, oldestManual));
        when(nextTimeSessionRepository.findByUser_IdAndStatusOrderByResultRecordedAtDesc(
                org.mockito.ArgumentMatchers.eq(userId),
                org.mockito.ArgumentMatchers.eq(RESULT_RECORDED),
                any(Pageable.class)
        )).thenReturn(List.of(middleNextTime));

        var response = service.getRecords(userId, 2);

        assertThat(response.records()).hasSize(2);
        assertThat(response.records()).extracting(item -> item.recordedAt())
                .containsExactly(
                        Instant.parse("2026-08-16T12:00:00Z"),
                        Instant.parse("2026-08-16T11:00:00Z")
                );
    }

    @Test
    void returnsEmptyListWhenThereAreNoRecords() {
        UUID userId = UUID.randomUUID();
        User user = onboardedUser();
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(smokingRecordRepository.findByUser_IdOrderBySmokedAtDesc(
                org.mockito.ArgumentMatchers.eq(userId), any(Pageable.class)
        )).thenReturn(List.of());
        when(nextTimeSessionRepository.findByUser_IdAndStatusOrderByResultRecordedAtDesc(
                org.mockito.ArgumentMatchers.eq(userId),
                org.mockito.ArgumentMatchers.eq(RESULT_RECORDED),
                any(Pageable.class)
        )).thenReturn(List.of());

        assertThat(service.getRecords(userId, 10).records()).isEmpty();
    }

    @Test
    void rejectsInvalidLimit() {
        UUID userId = UUID.randomUUID();
        User user = onboardedUser();
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        assertThatThrownBy(() -> service.getRecords(userId, 0))
                .isInstanceOf(BusinessException.class)
                .hasMessage("limit은 1 이상 50 이하여야 합니다.");
    }

    @Test
    void rejectsUserWhoHasNotCompletedOnboarding() {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(user.isOnboardingCompleted()).thenReturn(false);

        assertThatThrownBy(() -> service.getRecords(userId, 10))
                .isInstanceOf(BusinessException.class)
                .hasMessage("온보딩을 완료한 후 흡연 기록을 조회할 수 있습니다.");
    }

    private User onboardedUser() {
        User user = mock(User.class);
        when(user.isOnboardingCompleted()).thenReturn(true);
        return user;
    }

    private SmokingRecord manualRecord(UUID id, Instant recordedAt) {
        SmokingRecord record = mock(SmokingRecord.class);
        when(record.getId()).thenReturn(id);
        when(record.getSmokedAt()).thenReturn(recordedAt);
        when(record.triggerOrNull()).thenReturn(null);
        return record;
    }

    private NextTimeSession nextTimeRecord(UUID id, Instant recordedAt) {
        NextTimeSession session = mock(NextTimeSession.class);
        when(session.getId()).thenReturn(id);
        when(session.getResultRecordedAt()).thenReturn(recordedAt);
        when(session.getContexts()).thenReturn(Set.of());
        when(session.getRecommendedMission()).thenReturn(null);
        when(session.getResult()).thenReturn(NOT_SMOKED);
        when(session.getCravingBefore()).thenReturn(com.nextime.nexttime.domain.CravingBefore.HIGH);
        when(session.getCravingAfter()).thenReturn(com.nextime.nexttime.domain.CravingAfter.NONE);
        return session;
    }
}
