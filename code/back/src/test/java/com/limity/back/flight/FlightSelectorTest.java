package com.limity.back.flight;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;

class FlightSelectorTest {

    private static final LocalDate TODAY = LocalDate.of(2026, 10, 1);
    private static final LocalDate WANTED = LocalDate.of(2026, 11, 12);

    private static FlightQuote quote(String price, LocalDate departure, int nights) {
        return new FlightQuote(new BigDecimal(price), "G3", "1", departure, departure + "T08:00:00-03:00",
                departure.plusDays(nights), departure.plusDays(nights) + "T18:00:00-03:00", 0, null);
    }

    @Test
    void picksCheapestInsideDateWindow() {
        List<FlightQuote> quotes = List.of(
                quote("900", WANTED, 4),
                quote("700", WANTED.plusDays(2), 4),
                quote("300", WANTED.plusDays(10), 4));

        Optional<FlightSelector.Pick> pick = FlightSelector.pick(quotes, WANTED, null, 3, 2, TODAY);

        assertThat(pick).isPresent();
        assertThat(pick.get().quote().price()).isEqualByComparingTo("700");
        assertThat(pick.get().dateMatch()).isEqualTo(FlightSelector.DateMatch.NEAR);
        assertThat(pick.get().nights()).isEqualTo(4);
    }

    @Test
    void marksExactWhenDayMatches() {
        Optional<FlightSelector.Pick> pick = FlightSelector.pick(List.of(quote("500", WANTED, 3)), WANTED, null, 3, 2, TODAY);

        assertThat(pick).get().extracting(FlightSelector.Pick::dateMatch).isEqualTo(FlightSelector.DateMatch.EXACT);
    }

    @Test
    void returnsEmptyWhenNothingIsInsideWindow() {
        Optional<FlightSelector.Pick> pick = FlightSelector.pick(
                List.of(quote("500", WANTED.plusDays(20), 3)), WANTED, null, 3, 2, TODAY);

        assertThat(pick).isEmpty();
    }

    @Test
    void prefersRequestedStayLengthWhenAvailable() {
        List<FlightQuote> quotes = List.of(
                quote("400", WANTED, 12),   // barata, mas 12 noites
                quote("650", WANTED, 5));   // 5 noites, como pedido

        Optional<FlightSelector.Pick> pick = FlightSelector.pick(quotes, WANTED, 5, 3, 1, TODAY);

        assertThat(pick).get().extracting(p -> p.quote().price()).isEqualTo(new BigDecimal("650"));
    }

    @Test
    void ignoresFlightsInThePastAndAbsurdStays() {
        List<FlightQuote> quotes = List.of(
                quote("100", TODAY.minusDays(1), 3),
                quote("200", WANTED, 45));

        assertThat(FlightSelector.pick(quotes, TODAY, null, 3, 2, TODAY)).isEmpty();
        assertThat(FlightSelector.pick(quotes, WANTED, null, 3, 2, TODAY)).isEmpty();
    }
}
