package com.limity.back.flight;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

/**
 * Escolhe, entre as passagens do cache, a mais barata que combina com o que o cliente pediu.
 * Como o cache raramente tem exatamente o dia pedido, aceitamos uma janela de +/- alguns dias
 * e informamos se a data bateu ({@link DateMatch}).
 */
public final class FlightSelector {

    public enum DateMatch { EXACT, NEAR }

    public record Pick(FlightQuote quote, DateMatch dateMatch, int nights) {
    }

    private static final int MAX_NIGHTS = 30;

    private FlightSelector() {
    }

    /**
     * @param wantedNights noites desejadas; {@code null} quando o cliente não especificou
     */
    public static Optional<Pick> pick(List<FlightQuote> quotes, LocalDate wantedDeparture, Integer wantedNights,
            int windowDays, int stayToleranceNights, LocalDate today) {
        List<FlightQuote> usable = quotes.stream()
                .filter(q -> !q.departureDate().isBefore(today))
                .filter(q -> nightsOf(q) >= 1 && nightsOf(q) <= MAX_NIGHTS)
                .filter(q -> Math.abs(ChronoUnit.DAYS.between(wantedDeparture, q.departureDate())) <= windowDays)
                .toList();

        if (wantedNights != null) {
            List<FlightQuote> sameLength = usable.stream()
                    .filter(q -> Math.abs(nightsOf(q) - wantedNights) <= stayToleranceNights)
                    .toList();
            if (!sameLength.isEmpty()) {
                usable = sameLength;
            }
        }

        return usable.stream()
                .min(Comparator.comparing(FlightQuote::price)
                        .thenComparingLong(q -> Math.abs(ChronoUnit.DAYS.between(wantedDeparture, q.departureDate()))))
                .map(q -> new Pick(
                        q,
                        q.departureDate().equals(wantedDeparture) ? DateMatch.EXACT : DateMatch.NEAR,
                        nightsOf(q)));
    }

    private static int nightsOf(FlightQuote quote) {
        return (int) ChronoUnit.DAYS.between(quote.departureDate(), quote.returnDate());
    }
}
