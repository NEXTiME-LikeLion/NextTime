package com.nextime.user.application;

import com.nextime.common.error.BusinessException;
import com.nextime.common.error.ErrorCode;
import com.nextime.user.domain.User;
import com.nextime.user.domain.UserRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;
import java.util.Optional;

@Service
public class UserRegistrationService {

    private final UserRepository userRepository;
    private final CognitoUserProfileReader cognitoUserProfileReader;

    public UserRegistrationService(
            UserRepository userRepository,
            CognitoUserProfileReader cognitoUserProfileReader
    ) {
        this.userRepository = userRepository;
        this.cognitoUserProfileReader = cognitoUserProfileReader;
    }

    @Transactional
    public UserRegistrationResult register(String jwtSubject, String accessToken) {
        Optional<User> existingUser = userRepository.findByCognitoSub(jwtSubject);
        if (existingUser.isPresent()) {
            return UserRegistrationResult.existing(existingUser.get());
        }

        CognitoUserProfile profile = cognitoUserProfileReader.readByAccessToken(accessToken);
        validateProfile(jwtSubject, profile);

        String normalizedEmail = profile.email().trim().toLowerCase(Locale.ROOT);
        userRepository.findByEmail(normalizedEmail).ifPresent(user -> {
            if (!user.getCognitoSub().equals(jwtSubject)) {
                throw new BusinessException(ErrorCode.EMAIL_ALREADY_REGISTERED);
            }
        });

        int inserted;
        try {
            inserted = userRepository.insertIfAbsent(jwtSubject, normalizedEmail);
        } catch (DataIntegrityViolationException exception) {
            throw new BusinessException(ErrorCode.EMAIL_ALREADY_REGISTERED);
        }

        User registeredUser = userRepository.findByCognitoSub(jwtSubject)
                .orElseThrow(() -> new BusinessException(ErrorCode.CONFLICT));

        return inserted == 1
                ? UserRegistrationResult.created(registeredUser)
                : UserRegistrationResult.existing(registeredUser);
    }

    private void validateProfile(String jwtSubject, CognitoUserProfile profile) {
        if (!jwtSubject.equals(profile.subject())) {
            throw new BusinessException(ErrorCode.INVALID_COGNITO_PROFILE);
        }
        if (!profile.emailVerified()) {
            throw new BusinessException(ErrorCode.EMAIL_NOT_VERIFIED);
        }
        if (profile.email() == null || profile.email().isBlank()) {
            throw new BusinessException(ErrorCode.INVALID_COGNITO_PROFILE);
        }
    }
}
