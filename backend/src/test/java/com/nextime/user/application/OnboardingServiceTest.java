package com.nextime.user.application;

import com.nextime.common.error.BusinessException;
import com.nextime.common.error.ErrorCode;
import com.nextime.user.api.BaselineRequest;
import com.nextime.user.api.OnboardingRequest;
import com.nextime.smokingcontext.domain.SmokingContext;
import com.nextime.user.domain.OnboardingSmokingContextRepository;
import com.nextime.user.domain.SmokingFrequency;
import com.nextime.user.domain.OnboardingGoal;
import com.nextime.user.domain.TobaccoType;
import com.nextime.user.domain.User;
import com.nextime.user.domain.UserProfile;
import com.nextime.user.domain.UserProfileRepository;
import com.nextime.user.domain.UserRepository;
import com.nextime.user.domain.UserSmokingContext;
import com.nextime.user.domain.UserSmokingContextRepository;
import com.nextime.user.domain.UserTobaccoType;
import com.nextime.user.domain.UserTobaccoTypeRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OnboardingServiceTest {

    private static final UUID USER_ID = UUID.fromString("30000000-0000-0000-0000-000000000001");

    @Mock
    private UserRepository userRepository;
    @Mock
    private UserProfileRepository userProfileRepository;
    @Mock
    private OnboardingSmokingContextRepository smokingContextRepository;
    @Mock
    private UserSmokingContextRepository userSmokingContextRepository;
    @Mock
    private UserTobaccoTypeRepository userTobaccoTypeRepository;
    @InjectMocks
    private OnboardingService service;

    @Test
    void savesBaselineAndCompletesOnboarding() {
        User user = mock(User.class);
        SmokingContext stress = context("STRESS", "10000000-0000-0000-0000-000000000002", true);
        SmokingContext other = context("OTHER", "10000000-0000-0000-0000-000000000011", true);
        when(userRepository.findById(USER_ID)).thenReturn(Optional.of(user));
        when(userProfileRepository.findById(USER_ID)).thenReturn(Optional.empty());
        when(smokingContextRepository.findAllByCodeIn(List.of("STRESS", "OTHER")))
                .thenReturn(List.of(stress, other));

        User result = service.complete(USER_ID, request(List.of("STRESS", "OTHER"), "  야근할 때  "));

        assertThat(result).isSameAs(user);
        verify(userProfileRepository).save(any(UserProfile.class));
        verify(userSmokingContextRepository).deleteAllByUserId(USER_ID);
        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<UserSmokingContext>> selections = ArgumentCaptor.forClass(List.class);
        verify(userSmokingContextRepository).saveAll(selections.capture());
        assertThat(selections.getValue()).hasSize(2);
        assertThat(selections.getValue())
                .extracting(UserSmokingContext::getCustomText)
                .containsExactly(null, "야근할 때");
        verify(userTobaccoTypeRepository).deleteAllByUserId(USER_ID);
        verify(userTobaccoTypeRepository).saveAll(any());
        verify(user).completeOnboarding();
    }

    @Test
    void replacesExistingProfileFrequency() {
        User user = mock(User.class);
        UserProfile profile = mock(UserProfile.class);
        SmokingContext context = context("AFTER_MEAL", "10000000-0000-0000-0000-000000000001", true);
        when(userRepository.findById(USER_ID)).thenReturn(Optional.of(user));
        when(userProfileRepository.findById(USER_ID)).thenReturn(Optional.of(profile));
        when(smokingContextRepository.findAllByCodeIn(List.of("AFTER_MEAL"))).thenReturn(List.of(context));

        service.complete(USER_ID, request(List.of("AFTER_MEAL"), null));

        verify(profile).updateOnboarding(
                SmokingFrequency.SIX_TO_TEN,
                OnboardingGoal.REDUCE,
                "회의가 길어질 때"
        );
        verify(userSmokingContextRepository).deleteAllByUserId(USER_ID);
        verify(userSmokingContextRepository).saveAll(any());
    }

    @Test
    void rejectsDuplicateContexts() {
        when(userRepository.findById(USER_ID)).thenReturn(Optional.of(mock(User.class)));

        BusinessException exception = assertThrows(
                BusinessException.class,
                () -> service.complete(USER_ID, request(List.of("STRESS", "STRESS"), null))
        );

        assertThat(exception.errorCode()).isEqualTo(ErrorCode.INVALID_REQUEST);
        verify(smokingContextRepository, never()).findAllByCodeIn(any());
    }

    @Test
    void requiresCustomTextWhenOtherIsSelected() {
        when(userRepository.findById(USER_ID)).thenReturn(Optional.of(mock(User.class)));

        BusinessException exception = assertThrows(
                BusinessException.class,
                () -> service.complete(USER_ID, request(List.of("OTHER"), "  "))
        );

        assertThat(exception.errorCode()).isEqualTo(ErrorCode.INVALID_REQUEST);
        assertThat(exception.getMessage()).isEqualTo("기타 상황을 입력해 주세요.");
    }

    @Test
    void rejectsUnknownContext() {
        when(userRepository.findById(USER_ID)).thenReturn(Optional.of(mock(User.class)));
        when(smokingContextRepository.findAllByCodeIn(List.of("UNKNOWN"))).thenReturn(List.of());

        BusinessException exception = assertThrows(
                BusinessException.class,
                () -> service.complete(USER_ID, request(List.of("UNKNOWN"), null))
        );

        assertThat(exception.errorCode()).isEqualTo(ErrorCode.INVALID_REQUEST);
        verify(userProfileRepository, never()).save(any());
    }

    private OnboardingRequest request(List<String> codes, String otherContext) {
        return new OnboardingRequest(
                new BaselineRequest(
                        SmokingFrequency.SIX_TO_TEN,
                        codes,
                        otherContext
                ),
                List.of(TobaccoType.CIGARETTE, TobaccoType.HEATED_TOBACCO),
                OnboardingGoal.REDUCE,
                "  회의가 길어질 때  "
        );
    }

    private SmokingContext context(String code, String id, boolean active) {
        SmokingContext context = mock(SmokingContext.class);
        when(context.getCode()).thenReturn(code);
        when(context.getId()).thenReturn(UUID.fromString(id));
        when(context.isActive()).thenReturn(active);
        return context;
    }
}
