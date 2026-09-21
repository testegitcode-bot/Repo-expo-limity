package com.limity.back.flight;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.concurrent.Semaphore;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.limity.back.common.ProviderCalls;
import com.limity.back.common.ProviderException;
import com.limity.back.config.AppConfig;
import com.limity.back.config.LimityProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;

/**
 * Aviasales Data API v3 (Travelpayouts): preços de passagens encontrados por usuários do Aviasales
 * nos últimos dias. Cadastro grátis; NÃO é busca em tempo real (isso exige 50 mil usuários/mês).
 */
@Component
public class TravelpayoutsFlightClient implements FlightProvider {

    private static final String PROVIDER = "travelpayouts";
    private static final String CURRENCY = "brl";

    private final RestClient client;
    private final LimityProperties.Travelpayouts props;
    private final Semaphore concurrency;

    @Autowired
    public TravelpayoutsFlightClient(LimityProperties props) {
        this(ProviderCalls.restClient(props.travelpayouts().baseUrl(), props.travelpayouts().timeout()),
                props.travelpayouts());
    }

    TravelpayoutsFlightClient(RestClient client, LimityProperties.Travelpayouts props) {
        this.client = client;
        this.props = props;
        this.concurrency = new Semaphore(props.maxConcurrency());
    }

    @Override
    public boolean enabled() {
        return props.enabled();
    }

    @Override
    @Cacheable(cacheNames = AppConfig.CACHE_FLIGHTS, key = "#originIata + '-' + #destinationIata + '-' + #departureMonth")
    public List<FlightQuote> roundTrips(String originIata, String destinationIata, YearMonth departureMonth) {
        if (!enabled()) {
            throw new ProviderException(PROVIDER, "TRAVELPAYOUTS_TOKEN não configurado");
        }
        PricesResponse response = ProviderCalls.limited(concurrency, () -> ProviderCalls.call(PROVIDER, () -> client.get()
                .uri(uri -> uri.path("/aviasales/v3/prices_for_dates")
                        .queryParam("origin", originIata)
                        .queryParam("destination", destinationIata)
                        .queryParam("departure_at", departureMonth.toString())
                        .queryParam("one_way", false)
                        .queryParam("unique", false)
                        .queryParam("sorting", "price")
                        .queryParam("limit", 100)
                        .queryParam("currency", CURRENCY)
                        .queryParam("market", props.market())
                        .build())
                .header("X-Access-Token", props.token())
                .retrieve()
                .body(PricesResponse.class)));

        if (response == null) {
            return List.of();
        }
        if (!response.success() && StringUtils.hasText(response.error())) {
            throw new ProviderException(PROVIDER, response.error());
        }
        if (response.data() == null) {
            return List.of();
        }
        return response.data().stream()
                .map(this::toQuote)
                .filter(quote -> quote != null)
                .toList();
    }

    private FlightQuote toQuote(Item item) {
        if (item.price() == null || item.departureAt() == null || item.returnAt() == null) {
            return null;
        }
        try {
            return new FlightQuote(
                    item.price(),
                    item.airline(),
                    item.flightNumber(),
                    dateOf(item.departureAt()),
                    item.departureAt(),
                    dateOf(item.returnAt()),
                    item.returnAt(),
                    item.transfers(),
                    affiliateUrl(item.link()));
        } catch (RuntimeException e) {
            return null; // item com data em formato inesperado: ignora só ele
        }
    }

    /** "2026-11-12T08:35:00-03:00" -> 2026-11-12 (a data local já vem no texto). */
    private static LocalDate dateOf(String isoDateTime) {
        return LocalDate.parse(isoDateTime.substring(0, 10));
    }

    private String affiliateUrl(String link) {
        if (!StringUtils.hasText(link)) {
            return null;
        }
        String url = props.linkBaseUrl() + link;
        if (StringUtils.hasText(props.marker())) {
            url += (url.contains("?") ? "&" : "?") + "marker=" + props.marker();
        }
        return url;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    record PricesResponse(boolean success, List<Item> data, String error) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    record Item(
            BigDecimal price,
            String airline,
            @JsonProperty("flight_number") String flightNumber,
            @JsonProperty("departure_at") String departureAt,
            @JsonProperty("return_at") String returnAt,
            Integer transfers,
            String link) {
    }
}
