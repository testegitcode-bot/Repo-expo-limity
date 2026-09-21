package com.limity.back.bus;

import java.math.BigDecimal;

/**
 * Estimativa de viagem de ônibus (ida e volta). Não vem de nenhuma API: é distância x tarifa média.
 *
 * @param price total para todos os passageiros, ida e volta, em BRL
 */
public record BusEstimate(double roadDistanceKm, double travelHours, BigDecimal price) {
}
