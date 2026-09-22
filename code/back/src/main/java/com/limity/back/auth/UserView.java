package com.limity.back.auth;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record UserView(
        UUID id,
        String name,
        String email,
        List<String> preferences,
        BigDecimal spentAmount) {

    public static UserView from(User user) {
        return new UserView(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPreferenceLabels(),
                user.getSpentAmount());
    }
}
