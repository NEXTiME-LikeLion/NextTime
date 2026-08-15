package com.nextime.security;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.security.cognito")
public record CognitoProperties(String issuerUri, String jwkSetUri) {
}
