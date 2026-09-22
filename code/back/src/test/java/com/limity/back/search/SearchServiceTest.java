package com.limity.back.search;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import com.limity.back.bus.BusEstimator;
import com.limity.back.catalog.Destination;
import com.limity.back.catalog.DestinationCatalog;
import com.limity.back.config.LimityProperties;
import com.limity.back.flight.FlightProvider;
import com.limity.back.flight.FlightQuote;
import com.limity.back.hotel.HotelProvider;
import com.limity.back.hotel.HotelStay;
import com.limity.back.image.PexelsImageClient;
import com.limity.back.origin.OriginResolver;
import com.limity.back.origin.ResolvedOrigin;
import com.limity.back.search.SearchResponse.TripOption;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class SearchServiceTest {

    private static final LocalDate DEPARTURE = LocalDate.now().plusDays(40);

    private final ExecutorService executor = Executors.newFixedThreadPool(4);
    private final LimityProperties props = new LimityProperties(
            new LimityProperties.Cors(List.of("http://localhost:3000")),
            new LimityProperties.Search(4, 12, 3, 2, 40, new LimityProperties.Bus(1800, 1.25, 0.25, 65)),
            new LimityProperties.Travelpayouts("t", "m", "", "", "", "br", Duration.ofSeconds(5), 2),
            new LimityProperties.LiteApi("k", "", Duration.ofSeconds(5), 2, 30, 15000, 8),
            new LimityProperties.Pexels("", "", Duration.ofSeconds(5)),
            new LimityProperties.Geocoding("", Duration.ofSeconds(5)),
            new LimityProperties.Auth("test-secret-with-at-least-32-characters-long", Duration.ofHours(2)));

    private OriginResolver origin;
    private PexelsImageClient images;

    @BeforeEach
    void setUp() {
        origin = mock(OriginResolver.class);
        when(origin.resolve("São Paulo")).thenReturn(
                new ResolvedOrigin("São Paulo", "SAO", "São Paulo", -23.5505, -46.6333, true, 0));
        images = mock(PexelsImageClient.class);
        when(images.enabled()).thenReturn(false);
    }

    @AfterEach
    void tearDown() {
        executor.shutdownNow();
    }

    /** Voo só para Recife (R$ 900 p/ pessoa) e Maceió (R$ 1.500); demais destinos sem preço. */
    private FlightProvider flights(boolean enabled) {
        return new FlightProvider() {
            @Override
            public boolean enabled() {
                return enabled;
            }

            @Override
            public List<FlightQuote> roundTrips(String originIata, String destinationIata, YearMonth month) {
                BigDecimal price = switch (destinationIata) {
                    case "REC" -> new BigDecimal("900");
                    case "MCZ" -> new BigDecimal("1500");
                    default -> null;
                };
                if (price == null || !month.equals(YearMonth.from(DEPARTURE))) {
                    return List.of();
                }
                return List.of(new FlightQuote(price, "G3", "100", DEPARTURE, DEPARTURE + "T08:00:00-03:00",
                        DEPARTURE.plusDays(4), DEPARTURE.plusDays(4) + "T18:00:00-03:00", 0, "https://aviasales/x"));
            }
        };
    }

    /** Hotel: R$ 700 em Recife/Porto de Galinhas, R$ 900 nos demais. */
    private HotelProvider hotels(boolean enabled) {
        return new HotelProvider() {
            @Override
            public boolean enabled() {
                return enabled;
            }

            @Override
            public Optional<HotelStay> cheapestStay(Destination destination, LocalDate in, LocalDate out, int adults) {
                BigDecimal total = "REC".equals(destination.iata()) ? new BigDecimal("700") : new BigDecimal("900");
                return Optional.of(new HotelStay("h1", "Hotel " + destination.name(), 4.0, 8.4, null, null, total));
            }
        };
    }

    private SearchService service(boolean flightsOn, boolean hotelsOn) {
        return new SearchService(new DestinationCatalog(), origin, flights(flightsOn), hotels(hotelsOn),
                new BusEstimator(props), images, props, executor);
    }

    private SearchRequest request(String budget, List<String> preferences) {
        return new SearchRequest(new BigDecimal(budget), "São Paulo", DEPARTURE, null, null, 1, preferences, null, null);
    }

    @Test
    void keepsOnlyPackagesThatFitTheBudget() {
        SearchResponse response = service(true, true).search(request("2000", List.of("Praia", "Avião")));

        // Recife e Porto de Galinhas (via REC): 900 + 700 = 1600. Maceió/Maragogi: 1500 + 900 = 2400 > 2000.
        assertThat(response.options()).isNotEmpty();
        assertThat(response.options()).allSatisfy(option -> {
            assertThat(option.transport()).isEqualTo("AVIAO");
            assertThat(option.complete()).isTrue();
            assertThat(option.totalCost()).isLessThanOrEqualTo(new BigDecimal("2000"));
            assertThat(option.totalCost()).isEqualByComparingTo("1600");
            assertThat(option.budgetLeft()).isEqualByComparingTo("400");
            assertThat(option.flight().dateMatch()).isEqualTo("EXACT");
            assertThat(option.nights()).isEqualTo(4);
        });
        assertThat(response.options()).extracting(o -> o.destination().id())
                .contains("porto-de-galinhas", "recife")
                .doesNotContain("maragogi", "maceio");
        assertThat(response.providers()).containsEntry("travelpayouts", "OK").containsEntry("liteapi", "OK");
    }

    @Test
    void biggerBudgetBringsMoreOptions() {
        SearchResponse small = service(true, true).search(request("2000", List.of("Praia", "Avião")));
        SearchResponse big = service(true, true).search(request("3000", List.of("Praia", "Avião")));

        assertThat(big.options().size()).isGreaterThan(small.options().size());
    }

    @Test
    void busOptionsAreEstimatesAndNeverExceedBudget() {
        SearchResponse response = service(true, true).search(request("2000", List.of("Praia", "Ônibus")));

        assertThat(response.options()).isNotEmpty();
        assertThat(response.options()).allSatisfy(option -> {
            assertThat(option.transport()).isEqualTo("ONIBUS");
            assertThat(option.bus().estimated()).isTrue();
            assertThat(option.flight()).isNull();
            assertThat(option.totalCost()).isLessThanOrEqualTo(new BigDecimal("2000"));
        });
        assertThat(response.warnings()).anyMatch(w -> w.contains("estimativas"));
    }

    @Test
    void withoutHotelKeyShowsTransportOnlyAndWarns() {
        SearchResponse response = service(true, false).search(request("2000", List.of("Praia", "Avião")));

        assertThat(response.options()).isNotEmpty();
        assertThat(response.options()).noneMatch(TripOption::complete);
        assertThat(response.options()).allSatisfy(option -> assertThat(option.hotel()).isNull());
        assertThat(response.providers().get("liteapi")).startsWith("DESATIVADO");
        assertThat(response.warnings()).anyMatch(w -> w.contains("Hotéis indisponíveis"));
    }

    @Test
    void withoutFlightKeyReportsItAndStillReturnsBus() {
        SearchResponse response = service(false, true).search(request("2000", List.of("Praia")));

        assertThat(response.providers().get("travelpayouts")).startsWith("DESATIVADO");
        assertThat(response.options()).isNotEmpty();
        assertThat(response.options()).allMatch(option -> option.transport().equals("ONIBUS"));
    }

    @Test
    void sortByPriceOrdersByTotalCost() {
        SearchRequest request = new SearchRequest(new BigDecimal("3000"), "São Paulo", DEPARTURE, null, null, 1,
                List.of("Praia", "Avião"), null, "price");

        List<TripOption> options = service(true, true).search(request).options();

        assertThat(options).extracting(TripOption::totalCost).isSorted();
    }

    @Test
    void petPreferenceIsReportedAsNotApplied() {
        SearchResponse response = service(true, true).search(request("2000", List.of("Praia", "Pet")));

        assertThat(response.warnings()).anyMatch(w -> w.contains("Pet"));
    }
}
