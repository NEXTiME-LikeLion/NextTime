package com.nextime.security;

import org.junit.jupiter.api.Test;
import org.springframework.security.oauth2.jwt.Jwt;

import static org.assertj.core.api.Assertions.assertThat;

class CognitoTokenUseValidatorTest {

    private final CognitoTokenUseValidator validator = new CognitoTokenUseValidator();

    @Test
    void acceptsAccessToken() {
        Jwt token = Jwt.withTokenValue("token")
                .header("alg", "RS256")
                .claim("token_use", "access")
                .build();

        assertThat(validator.validate(token).hasErrors()).isFalse();
    }

    @Test
    void rejectsIdToken() {
        Jwt token = Jwt.withTokenValue("token")
                .header("alg", "RS256")
                .claim("token_use", "id")
                .build();

        assertThat(validator.validate(token).hasErrors()).isTrue();
    }
}
