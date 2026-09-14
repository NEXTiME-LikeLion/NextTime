package com.nextime.device.demo;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "mqtt")
public record MqttProperties(
        String brokerUrl,
        String clientId,
        String topic
) {
}
