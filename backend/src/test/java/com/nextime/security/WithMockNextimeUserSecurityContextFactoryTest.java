package com.nextime.security;

import org.junit.jupiter.api.Test;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import static org.assertj.core.api.Assertions.assertThat;

class WithMockNextimeUserSecurityContextFactoryTest {

    @Test
    void createsJwtAuthenticationWithConfiguredSubject() {
        WithMockNextimeUser annotation = TestFixture.class
                .getAnnotation(WithMockNextimeUser.class);

        JwtAuthenticationToken authentication = (JwtAuthenticationToken)
                new WithMockNextimeUserSecurityContextFactory()
                        .createSecurityContext(annotation)
                        .getAuthentication();

        assertThat(((Jwt) authentication.getPrincipal()).getSubject()).isEqualTo("fixture-sub");
    }

    @WithMockNextimeUser(subject = "fixture-sub")
    private static class TestFixture {
    }
}
