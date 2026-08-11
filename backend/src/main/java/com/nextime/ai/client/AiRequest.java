package com.nextime.ai.client;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Map;

public record AiRequest(
        @NotBlank String purpose,
        @NotBlank String promptVersion,
        @NotNull Map<String, Object> input
) {
}
