package com.nextime.nexttime.session.application;

import com.nextime.common.error.BusinessException;
import com.nextime.nexttime.session.api.NextTimeContextResponse;
import com.nextime.nexttime.session.api.SaveNextTimeContextRequest;
import com.nextime.nexttime.domain.NextTimeSession;
import com.nextime.nexttime.domain.NextTimeSessionRepository;
import com.nextime.smokingcontext.domain.SmokingContext;
import com.nextime.smokingcontext.domain.SmokingContextRepository;
import com.nextime.smokingcontext.domain.SmokingContextType;
import com.nextime.user.domain.User;
import com.nextime.user.domain.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static com.nextime.nexttime.domain.NextTimeSessionStatus.CONTEXT_SAVED;
import static com.nextime.nexttime.domain.CravingBefore.HIGH;
import static com.nextime.nexttime.domain.CravingBefore.MEDIUM;
import static com.nextime.smokingcontext.domain.SmokingContextType.LOCATION;
import static com.nextime.smokingcontext.domain.SmokingContextType.TRIGGER;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NextTimeServiceTest {

    @Mock
    private NextTimeSessionRepository nextTimeSessionRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SmokingContextRepository smokingContextRepository;

    private NextTimeService nextTimeService;

    @BeforeEach
    void setUp() {
        nextTimeService = new NextTimeService(
                nextTimeSessionRepository,
                userRepository,
                smokingContextRepository
        );
    }

    @Test
    void createsSessionForRegisteredUser() {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);

        when(user.isOnboardingCompleted()).thenReturn(true);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(nextTimeSessionRepository.save(any(NextTimeSession.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        var response = nextTimeService.createNextTimeSession(userId);

        assertThat(response.getStatus().name()).isEqualTo("CREATED");
        assertThat(response.getCreatedAt()).isNotNull();
        verify(nextTimeSessionRepository).save(any(NextTimeSession.class));
    }

    @Test
    void savesRequiredLocationAndTrigger() {
        UUID userId = UUID.randomUUID();
        UUID sessionId = UUID.randomUUID();
        UUID locationId = UUID.randomUUID();
        UUID triggerId = UUID.randomUUID();
        NextTimeSession session = new NextTimeSession(mock(User.class));
        SmokingContext location = context(locationId, "HOME", "집");
        SmokingContext trigger = context(triggerId, "STRESS", "스트레스");

        when(nextTimeSessionRepository.findByIdAndUser_Id(sessionId, userId))
                .thenReturn(Optional.of(session));
        stubContext(locationId, LOCATION, location);
        stubContext(triggerId, TRIGGER, trigger);

        NextTimeContextResponse response = nextTimeService.saveContext(
                userId,
                sessionId,
                new SaveNextTimeContextRequest(HIGH, locationId, triggerId)
        );

        assertThat(response.status()).isEqualTo(CONTEXT_SAVED);
        assertThat(response.cravingBefore()).isEqualTo(HIGH);
        assertThat(response.location().id()).isEqualTo(locationId);
        assertThat(response.trigger().id()).isEqualTo(triggerId);
        assertThat(session.getContexts()).containsExactlyInAnyOrder(location, trigger);
        assertThat(response.contextSavedAt()).isNotNull();
    }

    @Test
    void rejectsContextSaveWhenSessionIsNoLongerCreated() {
        UUID userId = UUID.randomUUID();
        UUID sessionId = UUID.randomUUID();
        UUID locationId = UUID.randomUUID();
        UUID triggerId = UUID.randomUUID();
        NextTimeSession session = new NextTimeSession(mock(User.class));
        session.saveContext(
                MEDIUM,
                mock(SmokingContext.class),
                mock(SmokingContext.class),
                java.time.Instant.now()
        );
        when(nextTimeSessionRepository.findByIdAndUser_Id(sessionId, userId))
                .thenReturn(Optional.of(session));

        assertThatThrownBy(() -> nextTimeService.saveContext(
                userId,
                sessionId,
                new SaveNextTimeContextRequest(HIGH, locationId, triggerId)
        ))
                .isInstanceOf(BusinessException.class)
                .hasMessage("현재 상태에서는 흡연 상황을 저장할 수 없습니다.");
    }

    private void stubContext(
            UUID contextId,
            SmokingContextType type,
            SmokingContext context
    ) {
        when(smokingContextRepository.findByIdAndContextTypeAndActiveTrue(contextId, type))
                .thenReturn(Optional.of(context));
    }

    private SmokingContext context(UUID id, String code, String name) {
        SmokingContext context = mock(SmokingContext.class);
        when(context.getId()).thenReturn(id);
        when(context.getCode()).thenReturn(code);
        when(context.getName()).thenReturn(name);
        return context;
    }
}
