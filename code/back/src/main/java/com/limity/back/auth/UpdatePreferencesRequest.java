package com.limity.back.auth;

import java.util.List;

import jakarta.validation.constraints.NotNull;

public record UpdatePreferencesRequest(
        @NotNull(message = "As preferências são obrigatórias.")
        List<String> preferences) {
}
