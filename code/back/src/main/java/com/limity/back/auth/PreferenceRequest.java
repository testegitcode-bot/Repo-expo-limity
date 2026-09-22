package com.limity.back.auth;

import java.util.Set;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

public record PreferenceRequest(
        @NotEmpty(message = "Informe ao menos uma preferência.")
        @Size(max = 20, message = "Máximo de 20 preferências.")
        Set<String> preferences) {
}
