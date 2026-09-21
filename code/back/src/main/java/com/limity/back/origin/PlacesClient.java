package com.limity.back.origin;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.limity.back.common.ProviderCalls;
import com.limity.back.config.AppConfig;
import com.limity.back.config.LimityProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

/**
 * Dados públicos do Travelpayouts que NÃO exigem token: autocomplete de cidades e lista de
 * aeroportos. Usados para transformar "Recife" em código IATA e achar o aeroporto mais próximo.
 */
@Component
public class PlacesClient {

    private static final String PROVIDER = "travelpayouts-places";
    private static final Duration AIRPORTS_TTL = Duration.ofHours(24);

    private final RestClient placesClient;
    private final RestClient dataClient;

    private volatile List<Airport> airports = List.of();
    private volatile Instant airportsLoadedAt = Instant.EPOCH;

    @Autowired
    public PlacesClient(LimityProperties props) {
        this(ProviderCalls.restClient(props.travelpayouts().placesUrl(), props.travelpayouts().timeout()),
                ProviderCalls.restClient(props.travelpayouts().baseUrl(), Duration.ofSeconds(30)));
    }

    PlacesClient(RestClient placesClient, RestClient dataClient) {
        this.placesClient = placesClient;
        this.dataClient = dataClient;
    }

    @Cacheable(AppConfig.CACHE_PLACES)
    public List<Place> searchCities(String term) {
        List<Place> places = ProviderCalls.call(PROVIDER, () -> placesClient.get()
                .uri(uri -> uri.path("/places2")
                        .queryParam("term", term)
                        .queryParam("locale", "pt")
                        .queryParam("types[]", "city")
                        .build())
                .retrieve()
                .body(new ParameterizedTypeReference<List<Place>>() {
                }));
        return places == null ? List.of() : places;
    }

    /** Aeroportos brasileiros com voos comerciais (lista em memória, renovada a cada 24h). */
    public List<Airport> brazilianAirports() {
        if (airports.isEmpty() || airportsLoadedAt.plus(AIRPORTS_TTL).isBefore(Instant.now())) {
            synchronized (this) {
                if (airports.isEmpty() || airportsLoadedAt.plus(AIRPORTS_TTL).isBefore(Instant.now())) {
                    List<Airport> all = ProviderCalls.call(PROVIDER, () -> dataClient.get()
                            .uri("/data/en/airports.json")
                            .retrieve()
                            .body(new ParameterizedTypeReference<List<Airport>>() {
                            }));
                    airports = all == null ? List.of() : all.stream()
                            .filter(a -> "BR".equals(a.countryCode()) && a.flightable()
                                    && "airport".equals(a.type()) && a.coordinates() != null)
                            .toList();
                    airportsLoadedAt = Instant.now();
                }
            }
        }
        return airports;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Place(
            String code,
            String name,
            String type,
            @JsonProperty("country_code") String countryCode,
            @JsonProperty("country_name") String countryName,
            @JsonProperty("state_code") String stateCode,
            Coordinates coordinates) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Airport(
            String code,
            String name,
            @JsonProperty("city_code") String cityCode,
            @JsonProperty("country_code") String countryCode,
            @JsonProperty("iata_type") String type,
            boolean flightable,
            Coordinates coordinates) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Coordinates(Double lat, Double lon) {
    }
}
