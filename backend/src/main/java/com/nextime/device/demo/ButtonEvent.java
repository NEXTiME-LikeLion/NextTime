package com.nextime.device.demo;

import java.time.Instant;

public record ButtonEvent(
        String topic,
        String payload,
        Instant receivedAt
) {
}
