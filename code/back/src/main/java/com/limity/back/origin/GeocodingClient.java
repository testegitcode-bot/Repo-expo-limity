package com.limity.back.origin;

import java.util.List;
import java.util.Optional;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.limity.back.common.ProviderCalls;
import com.limity.back.config.AppConfig;
import com.limity.back.config.LimityProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

/**
 * Open-Meteo Geocoding (sem chave). Serve para descobrir as coordenadas de qualquer município
 * brasileiro da lista do front, mesmo os sem aeroporto.
 * Atenção: grátis somente para uso NÃO comercial (ok para protótipo).
 */
@Component
public class GeocodingClient {

    private static final String PROVIDER = "open-meteo-geocoding";

    private final RestClient client;

    @Autowired
    public GeocodingClient(LimityProperties props) {
        this(ProviderCalls.restClient(props.geocoding().baseUrl(), props.geocoding().timeout()));
    }

    GeocodingClient(RestClient client) {
        this.client = client;
    }

    @Cacheable(AppConfig.CACHE_GEOCODE)
    public Optional<GeoPoint> geocodeBrazilianCity(String name) {
        Response response = ProviderCalls.call(PROVIDER, () -> client.get()
                .uri(uri -> uri.path("/search")
                        .queryParam("name", name)
                        .queryParam("count", 1)
                        .queryParam("country_code", "BR")
                        .queryParam("language", "pt")
                        .build())
                .retrieve()
                .body(Response.class));
        if (response == null || response.results() == null || response.results().isEmpty()) {
            return Optional.empty();
        }
        Result first = response.results().get(0);
        return Optional.of(new GeoPoint(first.name(), first.latitude(), first.longitude()));
    }

    public record GeoPoint(String name, double lat, double lon) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    record Response(List<Result> results) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    record Result(String name, double latitude, double longitude) {
    }
}
