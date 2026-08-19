package com.nextime.push;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "web-push")
public record WebPushProperties(
        String publicKey,
        String privateKey,
        String subject
) {
}
