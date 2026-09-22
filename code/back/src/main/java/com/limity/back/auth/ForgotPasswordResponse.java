package com.limity.back.auth;

public record ForgotPasswordResponse(String message, String resetToken) {
}
