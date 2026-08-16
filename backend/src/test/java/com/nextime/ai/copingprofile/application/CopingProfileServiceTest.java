package com.nextime.ai.copingprofile.application;

import com.nextime.ai.copingprofile.api.CopingProfileRequest;
import com.nextime.ai.copingprofile.domain.CopingAction;
import com.nextime.ai.copingprofile.domain.CopingProfile;
import com.nextime.ai.copingprofile.domain.CopingProfileRepository;
import com.nextime.common.error.BusinessException;
import com.nextime.common.error.ErrorCode;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CopingProfileServiceTest {

    private static final UUID USER_ID = UUID.fromString("30000000-0000-0000-0000-000000000001");

    @Mock
    private CopingProfileRepository repository;
    @InjectMocks
    private CopingProfileService service;

    @Test
    void savesSelectedActions() {
        when(repository.save(any(CopingProfile.class))).thenAnswer(invocation -> invocation.getArgument(0));

        CopingProfile result = service.create(USER_ID, new CopingProfileRequest(
                List.of(CopingAction.DRINK_WATER, CopingAction.TAKE_A_WALK),
                null
        ));

        assertThat(result.getActions()).containsExactly(CopingAction.DRINK_WATER, CopingAction.TAKE_A_WALK);
    }

    @Test
    void requiresCustomActionWhenOtherIsSelected() {
        BusinessException exception = assertThrows(BusinessException.class, () -> service.create(
                USER_ID,
                new CopingProfileRequest(List.of(CopingAction.OTHER), " ")
        ));

        assertThat(exception.errorCode()).isEqualTo(ErrorCode.INVALID_REQUEST);
        verify(repository, never()).save(any());
    }

    @Test
    void rejectsDuplicateActions() {
        BusinessException exception = assertThrows(BusinessException.class, () -> service.create(
                USER_ID,
                new CopingProfileRequest(List.of(CopingAction.DRINK_WATER, CopingAction.DRINK_WATER), null)
        ));

        assertThat(exception.errorCode()).isEqualTo(ErrorCode.INVALID_REQUEST);
    }
}
