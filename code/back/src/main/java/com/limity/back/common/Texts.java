package com.limity.back.common;

import java.text.Normalizer;
import java.util.Locale;

public final class Texts {

    private Texts() {
    }

    /** Minúsculas, sem acentos e sem espaços nas pontas: "Ônibus" -> "onibus". */
    public static String normalize(String text) {
        if (text == null) {
            return "";
        }
        return Normalizer.normalize(text, Normalizer.Form.NFD)
                .replaceAll("\\p{M}+", "")
                .toLowerCase(Locale.ROOT)
                .trim();
    }
}
