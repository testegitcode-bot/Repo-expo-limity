package com.limity.back.hotel;

import java.time.LocalDate;
import java.util.Optional;

import com.limity.back.catalog.Destination;

public interface HotelProvider {

    boolean enabled();

    /** Hotel mais barato com disponibilidade no período; vazio se não houver oferta. */
    Optional<HotelStay> cheapestStay(Destination destination, LocalDate checkIn, LocalDate checkOut, int adults);
}
