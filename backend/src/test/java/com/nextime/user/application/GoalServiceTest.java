package com.nextime.user.application;

import com.nextime.ai.nextme.application.NextMeService;
import com.nextime.ai.nextme.domain.NextMeGeneration;
import com.nextime.ai.nextme.domain.NextBudTheme;
import com.nextime.common.error.BusinessException;
import com.nextime.user.api.GoalRequest;
import com.nextime.user.api.GoalResponse;
import com.nextime.user.domain.OnboardingGoal;
import com.nextime.user.domain.UserProfile;
import com.nextime.user.domain.UserProfileRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class GoalServiceTest {

    private static final UUID USER_ID = UUID.fromString("30000000-0000-0000-0000-000000000001");

    @Mock
    private UserProfileRepository userProfileRepository;
    @Mock
    private NextMeService nextMeService;
    @InjectMocks
    private GoalService service;

    @Test
    void updatesOnlyProvidedValues() {
        UserProfile profile = mock(UserProfile.class);
        NextMeGeneration current = mock(NextMeGeneration.class);
        NextMeGeneration generated = mock(NextMeGeneration.class);
        when(userProfileRepository.findById(USER_ID)).thenReturn(Optional.of(profile));
        when(nextMeService.getLatest(USER_ID)).thenReturn(current);
        when(profile.getGoal()).thenReturn(OnboardingGoal.QUIT);
        when(current.getDecisionTrigger()).thenReturn("기존 동기");
        when(current.getMessageToFutureSelf()).thenReturn("기존 메시지");
        when(nextMeService.regenerateGoal(
                USER_ID,
                OnboardingGoal.QUIT,
                current,
                "새로운 NEXT ME",
                "기존 동기",
                "기존 메시지",
                java.util.List.of("changeGoal", "nextMe")
        )).thenReturn(generated);
        when(generated.getHeadline()).thenReturn("AI가 다듬은 NEXT ME");
        when(generated.getStartReason()).thenReturn("AI가 요약한 동기");
        when(generated.getNextBudTheme()).thenReturn(NextBudTheme.NEXTBUD_HEALTH_01);
        when(generated.getFutureSelf()).thenReturn("새로운 NEXT ME");
        when(generated.getDecisionTrigger()).thenReturn("기존 동기");
        when(generated.getMessageToFutureSelf()).thenReturn("기존 메시지");

        GoalResponse response = service.update(
                USER_ID,
                new GoalRequest(OnboardingGoal.QUIT, " 새로운 NEXT ME ", null, null)
        );

        verify(profile).updateGoal(OnboardingGoal.QUIT);
        verify(nextMeService).regenerateGoal(
                USER_ID,
                OnboardingGoal.QUIT,
                current,
                "새로운 NEXT ME",
                "기존 동기",
                "기존 메시지",
                java.util.List.of("changeGoal", "nextMe")
        );
        assertThat(response.future_self()).isEqualTo("새로운 NEXT ME");
        assertThat(response.decision_trigger()).isEqualTo("기존 동기");
        assertThat(response.message_to_future_self()).isEqualTo("기존 메시지");
        assertThat(response.headline()).isEqualTo("AI가 다듬은 NEXT ME");
        assertThat(response.start_reason()).isEqualTo("AI가 요약한 동기");
        assertThat(response.nextbud_theme()).isEqualTo(NextBudTheme.NEXTBUD_HEALTH_01);
    }

    @Test
    void rejectsRequestWithoutChanges() {
        assertThrows(
                BusinessException.class,
                () -> service.update(USER_ID, new GoalRequest(null, null, null, null))
        );
    }
}
