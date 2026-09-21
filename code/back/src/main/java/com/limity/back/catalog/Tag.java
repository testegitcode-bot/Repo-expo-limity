package com.limity.back.catalog;

import java.util.Locale;
import java.util.Optional;

import com.limity.back.common.Texts;

/** Mesmas categorias usadas no front (lib/destinations.tsx) mais as opções do SearchWidget. */
public enum Tag {
    PRAIA, NATUREZA, URBANO, SERRA, HISTORICO, INTERNACIONAL;

    public String key() {
        return name().toLowerCase(Locale.ROOT);
    }

    /** Aceita "Praia", "praia", "Histórico"... */
    public static Optional<Tag> fromLabel(String label) {
        String normalized = Texts.normalize(label);
        for (Tag tag : values()) {
            if (tag.key().equals(normalized)) {
                return Optional.of(tag);
            }
        }
        return Optional.empty();
    }
}
