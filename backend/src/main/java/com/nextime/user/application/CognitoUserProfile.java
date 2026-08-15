package com.nextime.user.application;

public record CognitoUserProfile(
        String subject,
        String email,
        boolean emailVerified
) {
}
