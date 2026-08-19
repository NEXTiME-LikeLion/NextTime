package com.nextime.push;

import jakarta.validation.constraints.NotBlank;

public record PushUnsubscriptionRequest(
        @NotBlank String endpoint
) {
}
