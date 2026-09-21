package com.limity.back.search;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import com.limity.back.catalog.Tag;
import org.junit.jupiter.api.Test;

class PreferencesTest {

    @Test
    void parsesSearchWidgetLabels() {
        Preferences prefs = Preferences.parse(List.of("Praia", "Ônibus", "Pet"));

        assertThat(prefs.tags()).containsExactly(Tag.PRAIA);
        assertThat(prefs.bus()).isTrue();
        assertThat(prefs.flight()).isFalse();
        assertThat(prefs.pet()).isTrue();
    }

    @Test
    void withoutTransportChoiceUsesBoth() {
        Preferences prefs = Preferences.parse(List.of("Natureza"));

        assertThat(prefs.flight()).isTrue();
        assertThat(prefs.bus()).isTrue();
    }

    @Test
    void emptyOrNullMeansNoFilter() {
        assertThat(Preferences.parse(null).tags()).isEmpty();
        assertThat(Preferences.parse(List.of()).tags()).isEmpty();
    }

    @Test
    void unknownLabelsAreReported() {
        assertThat(Preferences.parse(List.of("Avião", "Cassino")).unknown()).containsExactly("Cassino");
    }
}
