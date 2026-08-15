package com.nextime.security;

import org.junit.jupiter.api.Test;
import org.springframework.security.oauth2.jwt.Jwt;

import static org.assertj.core.api.Assertions.assertThat;

class CognitoClientIdValidatorTest {

    private final CognitoClientIdValidator validator = new CognitoClientIdValidator("nextime-client");

    @Test
    void acceptsExpectedAppClient() {
        Jwt token = tokenWithClientId("nextime-client");

        assertThat(validator.validate(token).hasErrors()).isFalse();
    }

    @Test
    void rejectsOtherAppClient() {
        Jwt token = tokenWithClientId("other-client");

        assertThat(validator.validate(token).hasErrors()).isTrue();
    }

    private Jwt tokenWithClientId(String clientId) {
        return Jwt.withTokenValue("token")
                .header("alg", "RS256")
                .claim("client_id", clientId)
                .build();
    }
}
