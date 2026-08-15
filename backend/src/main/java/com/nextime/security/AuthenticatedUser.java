package com.nextime.security;

import java.util.UUID;

public record AuthenticatedUser(UUID userId, String cognitoSub, String email) {
}
