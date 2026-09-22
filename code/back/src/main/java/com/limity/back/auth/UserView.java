package com.limity.back.auth;

import java.util.Set;
import java.util.UUID;

public record UserView(UUID id, String name, String email, int points, double cashback, Set<String> preferences) {

    public static UserView from(User user) {
        return new UserView(user.getId(), user.getName(), user.getEmail(),
                user.getPoints(), user.getCashback(), user.getPreferences());
    }
}
