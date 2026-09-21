package com.limity.back.auth;

import java.util.UUID;

public record UserView(UUID id, String name, String email) {

    public static UserView from(User user) {
        return new UserView(user.getId(), user.getName(), user.getEmail());
    }
}