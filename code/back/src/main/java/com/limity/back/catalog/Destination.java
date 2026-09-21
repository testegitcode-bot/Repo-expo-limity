package com.limity.back.catalog;

import java.util.Set;

/**
 * Destino curado do catálogo. Nenhuma API gratuita classifica "praia" ou "serra", então essa
 * curadoria (tags) é nossa.
 *
 * @param iata código IATA da cidade/aeroporto onde o voo pousa
 * @param hub  texto quando o voo pousa em outra cidade (ex.: "Recife (REC)" para Porto de Galinhas)
 * @param lat  coordenadas do destino de fato (usadas para hotéis e distância de ônibus)
 */
public record Destination(
        String id,
        String name,
        String state,
        String iata,
        String hub,
        String countryCode,
        double lat,
        double lon,
        Set<Tag> tags) {

    public boolean international() {
        return tags.contains(Tag.INTERNACIONAL);
    }
}
