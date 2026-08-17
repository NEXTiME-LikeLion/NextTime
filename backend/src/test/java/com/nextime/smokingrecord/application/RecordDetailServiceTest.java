package com.nextime.smokingrecord.application;

import com.nextime.common.error.BusinessException;
import com.nextime.mission.domain.Mission;
import com.nextime.nexttime.domain.NextTimeSession;
import com.nextime.nexttime.domain.NextTimeSessionRepository;
import com.nextime.smokingrecord.api.RecordDetailResponse.RecordType;
import com.nextime.smokingcontext.domain.SmokingContext;
import com.nextime.smokingrecord.domain.SmokingRecord;
import com.nextime.smokingrecord.domain.SmokingRecordRepository;
import com.nextime.user.domain.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static com.nextime.nexttime.domain.CravingAfter.MEDIUM;
import static com.nextime.nexttime.domain.CravingBefore.HIGH;
import static com.nextime.nexttime.domain.MissionHelpfulness.HELPFUL;
import static com.nextime.nexttime.domain.NextTimeResult.NOT_SMOKED;
import static com.nextime.nexttime.domain.NextTimeSessionStatus.RESULT_RECORDED;
import static com.nextime.smokingcontext.domain.SmokingContextType.LOCATION;
import static com.nextime.smokingcontext.domain.SmokingContextType.TRIGGER;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RecordDetailServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private SmokingRecordRepository smokingRecordRepository;
    @Mock
    private NextTimeSessionRepository nextTimeSessionRepository;

    private RecordDetailService service;

    @BeforeEach
    void setUp() {
        service = new RecordDetailService(
                userRepository,
                smokingRecordRepository,
                nextTimeSessionRepository
        );
    }

    @Test
    void returnsManualSmokingRecordDetail() {
        UUID userId = UUID.randomUUID();
        UUID recordId = UUID.randomUUID();
        Instant smokedAt = Instant.parse("2026-08-16T21:04:13Z");
        SmokingContext trigger = context(UUID.randomUUID(), "AFTER_MEAL", "밥을 먹고 나서", TRIGGER);
        SmokingRecord record = mock(SmokingRecord.class);
        when(record.getId()).thenReturn(recordId);
        when(record.getSmokedAt()).thenReturn(smokedAt);
        when(record.triggerOrNull()).thenReturn(trigger);
        when(userRepository.existsById(userId)).thenReturn(true);
        when(smokingRecordRepository.findByIdAndUser_Id(recordId, userId))
                .thenReturn(Optional.of(record));

        var response = service.getDetail(userId, recordId);

        assertThat(response.recordType()).isEqualTo(RecordType.MANUAL_SMOKING);
        assertThat(response.recordedAt()).isEqualTo(smokedAt);
        assertThat(response.trigger().code()).isEqualTo("AFTER_MEAL");
        assertThat(response.result().name()).isEqualTo("SMOKED");
        assertThat(response.mission()).isNull();
        assertThat(response.location()).isNull();
    }

    @Test
    void returnsNextTimeResultDetail() {
        UUID userId = UUID.randomUUID();
        UUID recordId = UUID.randomUUID();
        Instant startedAt = Instant.parse("2026-08-16T09:45:00Z");
        Instant completedAt = Instant.parse("2026-08-16T09:50:00Z");
        SmokingContext trigger = context(UUID.randomUUID(), "AFTER_MEAL", "밥을 먹고 나서", TRIGGER);
        SmokingContext location = context(UUID.randomUUID(), "HOME", "집", LOCATION);
        Mission mission = mock(Mission.class);
        when(mission.getId()).thenReturn(UUID.randomUUID());
        NextTimeSession session = mock(NextTimeSession.class);
        when(session.getId()).thenReturn(recordId);
        when(session.getResultRecordedAt()).thenReturn(completedAt.plusSeconds(30));
        when(session.getContexts()).thenReturn(Set.of(trigger, location));
        when(session.getRecommendedMission()).thenReturn(mission);
        when(session.getMissionCodeSnapshot()).thenReturn("SHORT_WALK");
        when(session.getMissionNameSnapshot()).thenReturn("잠깐 걷기");
        when(session.getResult()).thenReturn(NOT_SMOKED);
        when(session.getCravingBefore()).thenReturn(HIGH);
        when(session.getCravingAfter()).thenReturn(MEDIUM);
        when(session.getMissionStartedAt()).thenReturn(startedAt);
        when(session.getMissionCompletedAt()).thenReturn(completedAt);
        when(session.getMissionHelpfulness()).thenReturn(HELPFUL);
        when(session.getResultFeedback()).thenReturn("도움이 됐어요.");
        when(userRepository.existsById(userId)).thenReturn(true);
        when(smokingRecordRepository.findByIdAndUser_Id(recordId, userId))
                .thenReturn(Optional.empty());
        when(nextTimeSessionRepository.findByIdAndUser_IdAndStatus(recordId, userId, RESULT_RECORDED))
                .thenReturn(Optional.of(session));

        var response = service.getDetail(userId, recordId);

        assertThat(response.recordType()).isEqualTo(RecordType.NEXT_TIME);
        assertThat(response.trigger().code()).isEqualTo("AFTER_MEAL");
        assertThat(response.location().code()).isEqualTo("HOME");
        assertThat(response.mission().code()).isEqualTo("SHORT_WALK");
        assertThat(response.cravingChange().name()).isEqualTo("DECREASED");
        assertThat(response.missionDurationSeconds()).isEqualTo(300);
        assertThat(response.feedback()).isEqualTo("도움이 됐어요.");
    }

    @Test
    void hidesMissingOrOtherUsersRecordAsNotFound() {
        UUID userId = UUID.randomUUID();
        UUID recordId = UUID.randomUUID();
        when(userRepository.existsById(userId)).thenReturn(true);
        when(smokingRecordRepository.findByIdAndUser_Id(recordId, userId)).thenReturn(Optional.empty());
        when(nextTimeSessionRepository.findByIdAndUser_IdAndStatus(recordId, userId, RESULT_RECORDED))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.getDetail(userId, recordId))
                .isInstanceOf(BusinessException.class)
                .hasMessage("흡연 기록을 찾을 수 없습니다.");
    }

    private SmokingContext context(
            UUID id,
            String code,
            String name,
            com.nextime.smokingcontext.domain.SmokingContextType type
    ) {
        SmokingContext context = mock(SmokingContext.class);
        when(context.getId()).thenReturn(id);
        when(context.getCode()).thenReturn(code);
        when(context.getName()).thenReturn(name);
        lenient().when(context.getContextType()).thenReturn(type);
        return context;
    }
}
