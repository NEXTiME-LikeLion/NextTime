package com.nextime.security;

import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;

public class CognitoClientIdValidator implements OAuth2TokenValidator<Jwt> {

    private static final OAuth2Error INVALID_CLIENT = new OAuth2Error(
            "invalid_token",
            "Unexpected Cognito app client.",
            null
    );

    private final String expectedClientId;

    public CognitoClientIdValidator(String expectedClientId) {
        this.expectedClientId = expectedClientId;
    }

    @Override
    public OAuth2TokenValidatorResult validate(Jwt token) {
        if (expectedClientId.equals(token.getClaimAsString("client_id"))) {
            return OAuth2TokenValidatorResult.success();
        }
        return OAuth2TokenValidatorResult.failure(INVALID_CLIENT);
    }
}
