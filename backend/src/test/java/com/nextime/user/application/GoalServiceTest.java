package com.nextime.user.application;

import com.nextime.ai.nextme.domain.NextMeGeneration;
import com.nextime.ai.nextme.domain.NextMeGenerationRepository;
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
    private NextMeGenerationRepository generationRepository;
    @InjectMocks
    private GoalService service;

    @Test
    void updatesOnlyProvidedValues() {
        UserProfile profile = mock(UserProfile.class);
        NextMeGeneration generation = mock(NextMeGeneration.class);
        when(userProfileRepository.findById(USER_ID)).thenReturn(Optional.of(profile));
        when(generationRepository.findFirstByUserIdOrderByCreatedAtDesc(USER_ID))
                .thenReturn(Optional.of(generation));
        when(profile.getGoal()).thenReturn(OnboardingGoal.QUIT);
        when(generation.getFutureSelf()).thenReturn("새로운 NEXT ME");
        when(generation.getDecisionTrigger()).thenReturn("기존 동기");
        when(generation.getMessageToFutureSelf()).thenReturn("기존 메시지");

        GoalResponse response = service.update(
                USER_ID,
                new GoalRequest(OnboardingGoal.QUIT, " 새로운 NEXT ME ", null, null)
        );

        verify(profile).updateGoal(OnboardingGoal.QUIT);
        verify(generation).updateGoal("새로운 NEXT ME", null, null);
        assertThat(response.nextMe()).isEqualTo("새로운 NEXT ME");
        assertThat(response.motivation()).isEqualTo("기존 동기");
    }

    @Test
    void rejectsRequestWithoutChanges() {
        assertThrows(
                BusinessException.class,
                () -> service.update(USER_ID, new GoalRequest(null, null, null, null))
        );
    }
}
