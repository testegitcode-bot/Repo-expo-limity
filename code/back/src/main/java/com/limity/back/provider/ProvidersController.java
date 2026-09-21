package com.limity.back.provider;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Supplier;

import com.limity.back.catalog.DestinationCatalog;
import com.limity.back.common.ProviderException;
import com.limity.back.flight.FlightProvider;
import com.limity.back.flight.FlightQuote;
import com.limity.back.hotel.HotelProvider;
import com.limity.back.image.PexelsImageClient;
import com.limity.back.origin.PlacesClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Ajuda a validar as chaves do .env sem precisar montar uma busca completa. */
@RestController
@RequestMapping("/api/v1/providers")
public class ProvidersController {

    private final FlightProvider flights;
    private final HotelProvider hotels;
    private final PexelsImageClient images;
    private final PlacesClient places;
    private final DestinationCatalog catalog;

    public ProvidersController(FlightProvider flights, HotelProvider hotels, PexelsImageClient images,
            PlacesClient places, DestinationCatalog catalog) {
        this.flights = flights;
        this.hotels = hotels;
        this.images = images;
        this.places = places;
        this.catalog = catalog;
    }

    /** Quais chaves estão preenchidas (não revela valores). */
    @GetMapping
    public Map<String, Boolean> configured() {
        Map<String, Boolean> status = new LinkedHashMap<>();
        status.put("travelpayouts", flights.enabled());
        status.put("liteapi", hotels.enabled());
        status.put("pexels", images.enabled());
        return status;
    }

    /** Faz uma chamada real e leve em cada provedor e informa OK ou o motivo da falha. */
    @GetMapping("/check")
    public Map<String, String> check() {
        Map<String, String> result = new LinkedHashMap<>();
        result.put("travelpayouts-places (sem chave)", probe(() -> places.searchCities("Recife").size() + " cidades"));
        result.put("travelpayouts", flights.enabled()
                ? probe(() -> {
                    List<FlightQuote> quotes = flights.roundTrips("SAO", "RIO", YearMonth.now().plusMonths(1));
                    return quotes.size() + " preços no cache";
                })
                : "DESATIVADO (sem TRAVELPAYOUTS_TOKEN)");
        result.put("liteapi", hotels.enabled()
                ? probe(() -> hotels.cheapestStay(catalog.find("rio-de-janeiro").orElseThrow(),
                        LocalDate.now().plusDays(60), LocalDate.now().plusDays(62), 2)
                        .map(stay -> "oferta encontrada: " + stay.name())
                        .orElse("chave válida, mas sem oferta para essas datas"))
                : "DESATIVADO (sem LITEAPI_KEY)");
        result.put("pexels", images.enabled()
                ? probe(() -> images.coverOf(catalog.find("rio-de-janeiro").orElseThrow())
                        .map(image -> "foto encontrada")
                        .orElse("chave válida, mas sem foto"))
                : "DESATIVADO (sem PEXELS_API_KEY)");
        return result;
    }

    private static String probe(Supplier<String> call) {
        try {
            return "OK - " + call.get();
        } catch (ProviderException e) {
            return "ERRO - " + e.getMessage();
        }
    }
}
