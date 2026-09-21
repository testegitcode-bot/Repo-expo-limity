package com.limity.back.search;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import com.limity.back.image.DestinationImage;

public record SearchResponse(
        OriginView origin,
        BigDecimal budget,
        int adults,
        List<TripOption> options,
        int totalFound,
        List<String> warnings,
        Map<String, String> providers) {

    /** @param exact {@code false} quando usamos o aeroporto mais próximo da cidade do cliente */
    public record OriginView(String query, String iata, String hubName, boolean exact, double distanceToHubKm) {
    }

    /**
     * Uma opção de viagem. {@code complete = false} significa que só o transporte cabe/foi cotado
     * (hotel sem disponibilidade ou provedor desativado).
     *
     * @param transport AVIAO ou ONIBUS
     */
    public record TripOption(
            DestinationView destination,
            String transport,
            FlightView flight,
            BusView bus,
            HotelView hotel,
            LocalDate checkIn,
            LocalDate checkOut,
            int nights,
            BigDecimal transportCost,
            BigDecimal hotelCost,
            BigDecimal totalCost,
            BigDecimal budgetLeft,
            boolean complete) {
    }

    /** @param flightTo texto quando o voo pousa em outra cidade (ex.: "Recife (REC)") */
    public record DestinationView(
            String id,
            String name,
            String state,
            List<String> tags,
            String flightTo,
            DestinationImage image) {
    }

    /**
     * @param dateMatch EXACT (dia pedido) ou NEAR (dentro da tolerância de dias)
     * @param bookingUrl link de afiliado do Aviasales
     */
    public record FlightView(
            BigDecimal pricePerPerson,
            String airline,
            String flightNumber,
            String departureAt,
            String returnAt,
            Integer transfers,
            String dateMatch,
            String bookingUrl) {
    }

    public record BusView(double distanceKm, double hours, boolean estimated) {
    }

    public record HotelView(
            String id,
            String name,
            Double stars,
            Double rating,
            String photoUrl,
            String address,
            BigDecimal pricePerNight,
            BigDecimal total) {
    }
}
