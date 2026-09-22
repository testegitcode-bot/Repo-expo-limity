package com.limity.back.auth;

import java.util.List;
import java.util.Set;

public final class TravelPreferences {

    public static final Set<String> ALLOWED = Set.of(
            "Praia",
            "Natureza",
            "Urbano",
            "Avião",
            "Ônibus",
            "Pet friendly",
            "Aventura",
            "Cultura",
            "Gastronomia",
            "Relaxar");

    private TravelPreferences() {
    }

    public static List<String> sanitize(List<String> preferences) {
        if (preferences == null) {
            return List.of();
        }
        return preferences.stream()
                .filter(label -> label != null && ALLOWED.contains(label))
                .distinct()
                .toList();
    }
}
