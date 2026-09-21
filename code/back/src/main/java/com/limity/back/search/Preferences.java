package com.limity.back.search;

import java.util.ArrayList;
import java.util.EnumSet;
import java.util.List;
import java.util.Set;

import com.limity.back.catalog.Tag;
import com.limity.back.common.Texts;

/**
 * Interpretação dos botões do SearchWidget.
 * Sem nenhum modo de transporte marcado (ou com os dois), consideramos avião E ônibus.
 *
 * @param unknown rótulos que não reconhecemos (ficam de fora do filtro)
 */
public record Preferences(Set<Tag> tags, boolean flight, boolean bus, boolean pet, List<String> unknown) {

    public static Preferences parse(List<String> labels) {
        Set<Tag> tags = EnumSet.noneOf(Tag.class);
        List<String> unknown = new ArrayList<>();
        boolean flight = false;
        boolean bus = false;
        boolean pet = false;

        for (String label : labels == null ? List.<String>of() : labels) {
            String normalized = Texts.normalize(label);
            switch (normalized) {
                case "aviao" -> flight = true;
                case "onibus" -> bus = true;
                case "pet" -> pet = true;
                default -> Tag.fromLabel(label).ifPresentOrElse(tags::add, () -> unknown.add(label));
            }
        }
        if (!flight && !bus) {
            flight = true;
            bus = true;
        }
        return new Preferences(tags, flight, bus, pet, unknown);
    }
}
