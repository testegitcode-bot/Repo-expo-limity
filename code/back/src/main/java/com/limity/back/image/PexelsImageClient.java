package com.limity.back.image;

import java.util.List;
import java.util.Optional;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.limity.back.catalog.Destination;
import com.limity.back.common.ProviderCalls;
import com.limity.back.config.AppConfig;
import com.limity.back.config.LimityProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

/**
 * Pexels: foto de capa do destino. Grátis (200 req/h, 20 mil/mês). Os termos pedem crédito ao
 * fotógrafo e um link para o Pexels, por isso devolvemos esses campos junto com a URL.
 */
@Component
public class PexelsImageClient {

    private static final String PROVIDER = "pexels";

    private final RestClient client;
    private final LimityProperties.Pexels props;

    @Autowired
    public PexelsImageClient(LimityProperties props) {
        this(ProviderCalls.restClient(props.pexels().baseUrl(), props.pexels().timeout()), props.pexels());
    }

    PexelsImageClient(RestClient client, LimityProperties.Pexels props) {
        this.client = client;
        this.props = props;
    }

    public boolean enabled() {
        return props.enabled();
    }

    @Cacheable(cacheNames = AppConfig.CACHE_IMAGES, key = "#destination.id()")
    public Optional<DestinationImage> coverOf(Destination destination) {
        String query = destination.international()
                ? destination.name() + " " + destination.state()
                : destination.name() + " " + destination.state() + " Brasil";
        SearchResponse response = ProviderCalls.call(PROVIDER, () -> client.get()
                .uri(uri -> uri.path("/search")
                        .queryParam("query", query)
                        .queryParam("per_page", 1)
                        .queryParam("orientation", "landscape")
                        .queryParam("locale", "pt-BR")
                        .build())
                .header("Authorization", props.key())
                .retrieve()
                .body(SearchResponse.class));
        if (response == null || response.photos() == null || response.photos().isEmpty()) {
            return Optional.empty();
        }
        Photo photo = response.photos().get(0);
        if (photo.src() == null || photo.src().large() == null) {
            return Optional.empty();
        }
        return Optional.of(new DestinationImage(photo.src().large(), photo.photographer(),
                photo.photographerUrl(), photo.url()));
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    record SearchResponse(List<Photo> photos) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    record Photo(String url, String photographer, @JsonProperty("photographer_url") String photographerUrl, Src src) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    record Src(String large) {
    }
}
