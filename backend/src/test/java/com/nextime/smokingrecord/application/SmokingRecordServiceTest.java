package com.nextime.smokingrecord.application;

import com.nextime.common.error.BusinessException;
import com.nextime.smokingcontext.domain.SmokingContext;
import com.nextime.smokingcontext.domain.SmokingContextRepository;
import com.nextime.smokingrecord.api.CreateSmokingRecordRequest;
import com.nextime.smokingrecord.domain.SmokingRecord;
import com.nextime.smokingrecord.domain.SmokingRecordRepository;
import com.nextime.user.domain.User;
import com.nextime.user.domain.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static com.nextime.smokingcontext.domain.SmokingContextType.TRIGGER;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SmokingRecordServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private SmokingContextRepository smokingContextRepository;
    @Mock
    private SmokingRecordRepository smokingRecordRepository;

    private SmokingRecordService service;

    @BeforeEach
    void setUp() {
        service = new SmokingRecordService(
                userRepository,
                smokingContextRepository,
                smokingRecordRepository
        );
    }

    @Test
    void createsRecordWithSelectedTrigger() {
        UUID userId = UUID.randomUUID();
        UUID triggerId = UUID.randomUUID();
        User user = onboardedUser(userId);
        SmokingContext trigger = context(triggerId, "AFTER_MEAL", "밥을 먹고 나서");
        when(smokingContextRepository.findByIdAndContextTypeAndActiveTrue(triggerId, TRIGGER))
                .thenReturn(Optional.of(trigger));
        when(smokingRecordRepository.save(any(SmokingRecord.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        var response = service.create(userId, new CreateSmokingRecordRequest(triggerId));

        assertThat(response.smokedAt()).isNotNull();
        assertThat(response.createdAt()).isEqualTo(response.smokedAt());
        assertThat(response.trigger().id()).isEqualTo(triggerId);
        assertThat(response.trigger().code()).isEqualTo("AFTER_MEAL");

        ArgumentCaptor<SmokingRecord> captor = ArgumentCaptor.forClass(SmokingRecord.class);
        verify(smokingRecordRepository).save(captor.capture());
        assertThat(captor.getValue().getUser()).isEqualTo(user);
        assertThat(captor.getValue().getContexts()).containsExactly(trigger);
    }

    @Test
    void createsRecordWithoutTrigger() {
        UUID userId = UUID.randomUUID();
        onboardedUser(userId);
        when(smokingRecordRepository.save(any(SmokingRecord.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        var response = service.create(userId, new CreateSmokingRecordRequest(null));

        assertThat(response.trigger()).isNull();
        verify(smokingRecordRepository).save(any(SmokingRecord.class));
    }

    @Test
    void rejectsInactiveMissingOrNonTriggerContext() {
        UUID userId = UUID.randomUUID();
        UUID contextId = UUID.randomUUID();
        onboardedUser(userId);
        when(smokingContextRepository.findByIdAndContextTypeAndActiveTrue(contextId, TRIGGER))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.create(userId, new CreateSmokingRecordRequest(contextId)))
                .isInstanceOf(BusinessException.class)
                .hasMessage("유효하지 않은 흡연 상황입니다.");
    }

    @Test
    void rejectsUserWhoHasNotCompletedOnboarding() {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        when(user.isOnboardingCompleted()).thenReturn(false);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        assertThatThrownBy(() -> service.create(userId, new CreateSmokingRecordRequest(null)))
                .isInstanceOf(BusinessException.class)
                .hasMessage("온보딩을 완료한 후 흡연 기록을 저장할 수 있습니다.");
    }

    private User onboardedUser(UUID userId) {
        User user = mock(User.class);
        when(user.isOnboardingCompleted()).thenReturn(true);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        return user;
    }

    private SmokingContext context(UUID id, String code, String name) {
        SmokingContext context = mock(SmokingContext.class);
        when(context.getId()).thenReturn(id);
        when(context.getCode()).thenReturn(code);
        when(context.getName()).thenReturn(name);
        return context;
    }
}
