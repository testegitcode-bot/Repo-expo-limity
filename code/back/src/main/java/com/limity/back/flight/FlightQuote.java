package com.limity.back.flight;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Passagem de ida e volta encontrada no cache do Aviasales.
 *
 * @param price      valor por passageiro, em BRL
 * @param bookingUrl link de afiliado para comprar no Aviasales (pode ser {@code null})
 */
public record FlightQuote(
        BigDecimal price,
        String airline,
        String flightNumber,
        LocalDate departureDate,
        String departureAt,
        LocalDate returnDate,
        String returnAt,
        Integer transfers,
        String bookingUrl) {
}
