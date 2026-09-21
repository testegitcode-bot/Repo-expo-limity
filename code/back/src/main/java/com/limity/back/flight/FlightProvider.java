package com.limity.back.flight;

import java.time.YearMonth;
import java.util.List;

public interface FlightProvider {

    boolean enabled();

    /** Passagens de ida e volta mais baratas partindo no mês informado, da mais barata para a mais cara. */
    List<FlightQuote> roundTrips(String originIata, String destinationIata, YearMonth departureMonth);
}
