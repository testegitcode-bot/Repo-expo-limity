package com.limity.back.hotel;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.Semaphore;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.limity.back.catalog.Destination;
import com.limity.back.common.ProviderCalls;
import com.limity.back.common.ProviderException;
import com.limity.back.config.AppConfig;
import com.limity.back.config.LimityProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

/**
 * LiteAPI (Nuitée): catálogo e tarifas de hotéis. Cadastro grátis, sem contrato.
 * Com a chave de sandbox os dados são de teste; com a chave de produção são reais.
 */
@Component
public class LiteApiHotelClient implements HotelProvider {

    private static final String PROVIDER = "liteapi";
    private static final String CURRENCY = "BRL";

    private final RestClient client;
    private final LimityProperties.LiteApi props;
    private final Semaphore concurrency;
    /** Lista de hotéis por destino muda pouco: 24h. */
    private final Cache<String, List<HotelInfo>> hotelLists = Caffeine.newBuilder()
            .expireAfterWrite(Duration.ofHours(24))
            .maximumSize(500)
            .build();

    @Autowired
    public LiteApiHotelClient(LimityProperties props) {
        this(ProviderCalls.restClient(props.liteapi().baseUrl(), props.liteapi().timeout()), props.liteapi());
    }

    LiteApiHotelClient(RestClient client, LimityProperties.LiteApi props) {
        this.client = client;
        this.props = props;
        this.concurrency = new Semaphore(props.maxConcurrency());
    }

    @Override
    public boolean enabled() {
        return props.enabled();
    }

    @Override
    @Cacheable(cacheNames = AppConfig.CACHE_HOTEL_STAY,
            key = "#destination.id() + '-' + #checkIn + '-' + #checkOut + '-' + #adults")
    public Optional<HotelStay> cheapestStay(Destination destination, LocalDate checkIn, LocalDate checkOut, int adults) {
        if (!enabled()) {
            throw new ProviderException(PROVIDER, "LITEAPI_KEY não configurada");
        }
        List<HotelInfo> hotels = hotelLists.get(destination.id(), id -> fetchHotels(destination));
        if (hotels == null || hotels.isEmpty()) {
            return Optional.empty();
        }
        return fetchCheapestRate(hotels, checkIn, checkOut, adults);
    }

    /** A sandbox da LiteAPI responde 429 com facilidade: limita concorrência e tenta de novo com espera. */
    private <T> T withRateLimitRetry(java.util.function.Supplier<T> request) {
        return ProviderCalls.retryOnRateLimit(3, Duration.ofMillis(800),
                () -> ProviderCalls.limited(concurrency, () -> ProviderCalls.call(PROVIDER, request)));
    }

    private List<HotelInfo> fetchHotels(Destination destination) {
        try {
            HotelsResponse response = withRateLimitRetry(() -> client.get()
                    .uri(uri -> uri.path("/data/hotels")
                            .queryParam("countryCode", destination.countryCode())
                            .queryParam("latitude", destination.lat())
                            .queryParam("longitude", destination.lon())
                            .queryParam("radius", props.hotelRadiusMeters())
                            .queryParam("limit", props.hotelsPerLookup())
                            .build())
                    .header("X-API-Key", props.key())
                    .retrieve()
                    .body(HotelsResponse.class));
            return response == null || response.data() == null ? List.of() : response.data();
        } catch (ProviderException e) {
            if (e.httpStatus() == 404) {
                return List.of();
            }
            throw e;
        }
    }

    private Optional<HotelStay> fetchCheapestRate(List<HotelInfo> hotels, LocalDate checkIn, LocalDate checkOut,
            int adults) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("hotelIds", hotels.stream().map(HotelInfo::id).toList());
        body.put("checkin", checkIn.toString());
        body.put("checkout", checkOut.toString());
        body.put("currency", CURRENCY);
        body.put("guestNationality", "BR");
        body.put("occupancies", List.of(Map.of("adults", adults)));
        body.put("timeout", props.ratesTimeoutSeconds());
        body.put("maxRatesPerHotel", 1);

        RatesResponse response;
        try {
            response = withRateLimitRetry(() -> client.post()
                    .uri("/hotels/rates")
                    .header("X-API-Key", props.key())
                    .body(body)
                    .retrieve()
                    .body(RatesResponse.class));
        } catch (ProviderException e) {
            // "sem disponibilidade" costuma voltar como 404 na LiteAPI: não é falha do provedor.
            if (e.httpStatus() == 404) {
                return Optional.empty();
            }
            throw e;
        }
        if (response == null || response.data() == null) {
            return Optional.empty();
        }

        Map<String, HotelInfo> byId = new LinkedHashMap<>();
        hotels.forEach(hotel -> byId.put(hotel.id(), hotel));

        return response.data().stream()
                .map(offer -> cheapestOf(offer, byId.get(offer.hotelId())))
                .flatMap(Optional::stream)
                .min(Comparator.comparing(HotelStay::total));
    }

    private static Optional<HotelStay> cheapestOf(HotelOffer offer, HotelInfo info) {
        if (offer.roomTypes() == null) {
            return Optional.empty();
        }
        return offer.roomTypes().stream()
                .filter(room -> room.rates() != null)
                .flatMap(room -> room.rates().stream())
                .map(Rate::retailRate)
                .filter(rate -> rate != null && rate.total() != null)
                .flatMap(rate -> rate.total().stream())
                .filter(money -> money.amount() != null && CURRENCY.equalsIgnoreCase(money.currency()))
                .map(Money::amount)
                .min(Comparator.naturalOrder())
                .map(total -> new HotelStay(
                        offer.hotelId(),
                        info != null ? info.name() : offer.hotelId(),
                        info != null ? info.stars() : null,
                        info != null ? info.rating() : null,
                        info != null ? info.mainPhoto() : null,
                        info != null ? info.address() : null,
                        total));
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    record HotelsResponse(List<HotelInfo> data) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    record HotelInfo(
            String id,
            String name,
            String address,
            Double stars,
            Double rating,
            @JsonProperty("main_photo") String mainPhoto) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    record RatesResponse(List<HotelOffer> data) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    record HotelOffer(String hotelId, List<RoomType> roomTypes) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    record RoomType(List<Rate> rates) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    record Rate(RetailRate retailRate) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    record RetailRate(List<Money> total) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    record Money(BigDecimal amount, String currency) {
    }
}
