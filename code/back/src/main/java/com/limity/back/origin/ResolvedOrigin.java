package com.limity.back.origin;

/**
 * Cidade de origem do cliente já resolvida.
 *
 * @param query          texto digitado/selecionado pelo cliente
 * @param iata           código IATA da cidade usada na busca de voos
 * @param hubName        nome do aeroporto/cidade usado para voar
 * @param lat            coordenadas reais da cidade do cliente (usadas na estimativa de ônibus)
 * @param exact          {@code false} quando a cidade não tem aeroporto e usamos o mais próximo
 * @param distanceToHubKm distância até o aeroporto usado (0 quando exato)
 */
public record ResolvedOrigin(
        String query,
        String iata,
        String hubName,
        double lat,
        double lon,
        boolean exact,
        double distanceToHubKm) {
}
