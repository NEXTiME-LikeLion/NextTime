package com.nextime.user.application;

import com.nextime.common.error.BusinessException;
import com.nextime.common.error.ErrorCode;
import com.nextime.user.domain.User;
import com.nextime.user.domain.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserRegistrationServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private CognitoUserProfileReader cognitoUserProfileReader;

    @InjectMocks
    private UserRegistrationService service;

    @Test
    void returnsExistingUserWithoutCallingCognito() {
        User existing = user();
        when(userRepository.findByCognitoSub("cognito-sub")).thenReturn(Optional.of(existing));

        UserRegistrationResult result = service.register("cognito-sub", "access-token");

        assertThat(result.user()).isSameAs(existing);
        assertThat(result.newlyRegistered()).isFalse();
        verify(cognitoUserProfileReader, never()).readByAccessToken("access-token");
        verify(userRepository, never()).insertIfAbsent("cognito-sub", "test@example.com");
    }

    @Test
    void verifiesCognitoProfileAndCreatesNewUser() {
        User created = user();
        when(userRepository.findByCognitoSub("cognito-sub"))
                .thenReturn(Optional.empty())
                .thenReturn(Optional.of(created));
        when(cognitoUserProfileReader.readByAccessToken("access-token"))
                .thenReturn(new CognitoUserProfile("cognito-sub", " Test@Example.com ", true));
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());
        when(userRepository.insertIfAbsent("cognito-sub", "test@example.com")).thenReturn(1);

        UserRegistrationResult result = service.register("cognito-sub", "access-token");

        assertThat(result.user()).isSameAs(created);
        assertThat(result.newlyRegistered()).isTrue();
    }

    @Test
    void rejectsMismatchedCognitoSubject() {
        when(userRepository.findByCognitoSub("jwt-sub")).thenReturn(Optional.empty());
        when(cognitoUserProfileReader.readByAccessToken("access-token"))
                .thenReturn(new CognitoUserProfile("other-sub", "test@example.com", true));

        BusinessException exception = assertThrows(
                BusinessException.class,
                () -> service.register("jwt-sub", "access-token")
        );

        assertThat(exception.errorCode()).isEqualTo(ErrorCode.INVALID_COGNITO_PROFILE);
    }

    @Test
    void rejectsUnverifiedEmail() {
        when(userRepository.findByCognitoSub("cognito-sub")).thenReturn(Optional.empty());
        when(cognitoUserProfileReader.readByAccessToken("access-token"))
                .thenReturn(new CognitoUserProfile("cognito-sub", "test@example.com", false));

        BusinessException exception = assertThrows(
                BusinessException.class,
                () -> service.register("cognito-sub", "access-token")
        );

        assertThat(exception.errorCode()).isEqualTo(ErrorCode.EMAIL_NOT_VERIFIED);
    }

    @Test
    void rejectsEmailOwnedByAnotherCognitoUser() {
        User otherUser = user();
        when(otherUser.getCognitoSub()).thenReturn("other-sub");
        when(userRepository.findByCognitoSub("cognito-sub")).thenReturn(Optional.empty());
        when(cognitoUserProfileReader.readByAccessToken("access-token"))
                .thenReturn(new CognitoUserProfile("cognito-sub", "test@example.com", true));
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(otherUser));

        BusinessException exception = assertThrows(
                BusinessException.class,
                () -> service.register("cognito-sub", "access-token")
        );

        assertThat(exception.errorCode()).isEqualTo(ErrorCode.EMAIL_ALREADY_REGISTERED);
    }

    @Test
    void concurrentDuplicateRegistrationReturnsExistingUser() {
        User existing = user();
        when(userRepository.findByCognitoSub("cognito-sub"))
                .thenReturn(Optional.empty())
                .thenReturn(Optional.of(existing));
        when(cognitoUserProfileReader.readByAccessToken("access-token"))
                .thenReturn(new CognitoUserProfile("cognito-sub", "test@example.com", true));
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());
        when(userRepository.insertIfAbsent("cognito-sub", "test@example.com")).thenReturn(0);

        UserRegistrationResult result = service.register("cognito-sub", "access-token");

        assertThat(result.user()).isSameAs(existing);
        assertThat(result.newlyRegistered()).isFalse();
    }

    private User user() {
        return mock(User.class);
    }
}
