package com.limity.back.auth;

<<<<<<< HEAD
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
=======
import java.util.Set;
import java.util.UUID;

public record UserView(UUID id, String name, String email, int points, double cashback, Set<String> preferences) {

    public static UserView from(User user) {
        return new UserView(user.getId(), user.getName(), user.getEmail(),
                user.getPoints(), user.getCashback(), user.getPreferences());
>>>>>>> a05be0119e7e45ee0e3321c2455c47ef0298f388
    }
}
