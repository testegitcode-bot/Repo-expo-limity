package com.limity.back.auth;

import java.time.Instant;

public record AuthResponse(String accessToken, String tokenType, Instant expiresAt, UserView user) {
}