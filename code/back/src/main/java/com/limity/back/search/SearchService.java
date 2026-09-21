package com.limity.back.search;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.function.Supplier;

import com.limity.back.bus.BusEstimate;
import com.limity.back.bus.BusEstimator;
import com.limity.back.catalog.Destination;
import com.limity.back.catalog.DestinationCatalog;
import com.limity.back.catalog.Tag;
import com.limity.back.common.Money;
import com.limity.back.common.ProviderException;
import com.limity.back.config.LimityProperties;
import com.limity.back.flight.FlightProvider;
import com.limity.back.flight.FlightQuote;
import com.limity.back.flight.FlightSelector;
import com.limity.back.hotel.HotelProvider;
import com.limity.back.hotel.HotelStay;
import com.limity.back.image.DestinationImage;
import com.limity.back.image.PexelsImageClient;
import com.limity.back.origin.OriginResolver;
import com.limity.back.origin.ResolvedOrigin;
import com.limity.back.search.SearchResponse.BusView;
import com.limity.back.search.SearchResponse.DestinationView;
import com.limity.back.search.SearchResponse.FlightView;
import com.limity.back.search.SearchResponse.HotelView;
import com.limity.back.search.SearchResponse.OriginView;
import com.limity.back.search.SearchResponse.TripOption;
import org.springframework.stereotype.Service;

/**
 * Monta pacotes (transporte + hotel) que cabem no orçamento:
 * 1) filtra destinos pelas preferências; 2) cota o transporte (voo do cache do Aviasales ou
 * estimativa de ônibus); 3) para os destinos mais baratos de chegar, cota o hotel mais barato;
 * 4) mantém só o que cabe no orçamento e ordena.
 */
@Service
public class SearchService {

    private static final ZoneId ZONE = ZoneId.of("America/Sao_Paulo");
    private static final int DEFAULT_LIMIT = 20;

    private final DestinationCatalog catalog;
    private final OriginResolver originResolver;
    private final FlightProvider flights;
    private final HotelProvider hotels;
    private final BusEstimator bus;
    private final PexelsImageClient images;
    private final LimityProperties props;
    private final ExecutorService executor;

    public SearchService(DestinationCatalog catalog, OriginResolver originResolver, FlightProvider flights,
            HotelProvider hotels, BusEstimator bus, PexelsImageClient images, LimityProperties props,
            ExecutorService searchExecutor) {
        this.catalog = catalog;
        this.originResolver = originResolver;
        this.flights = flights;
        this.hotels = hotels;
        this.bus = bus;
        this.images = images;
        this.props = props;
        this.executor = searchExecutor;
    }

    private record Attempt<T>(Optional<T> value, String error) {
        static <T> Attempt<T> ok(Optional<T> value) {
            return new Attempt<>(value, null);
        }

        static <T> Attempt<T> failed(String error) {
            return new Attempt<>(Optional.empty(), error);
        }
    }

    private record Transport(Destination destination, String mode, BigDecimal cost, FlightView flight, BusView bus,
            LocalDate checkIn, LocalDate checkOut, int nights) {
    }

    private record StayKey(String destinationId, LocalDate checkIn, LocalDate checkOut) {
        static StayKey of(Transport transport) {
            return new StayKey(transport.destination().id(), transport.checkIn(), transport.checkOut());
        }
    }

    private record Draft(Transport transport, HotelStay stay, BigDecimal total, boolean complete) {
    }

    public SearchResponse search(SearchRequest request) {
        LimityProperties.Search cfg = props.search();
        LocalDate today = LocalDate.now(ZONE);
        int adults = request.adults() == null ? 1 : request.adults();
        BigDecimal budget = Money.brl(request.budget());
        Integer wantedNights = wantedNights(request);
        int stayNights = wantedNights != null ? wantedNights : cfg.defaultNights();
        Preferences prefs = Preferences.parse(request.preferences());
        ResolvedOrigin origin = originResolver.resolve(request.origin());

        List<String> warnings = new ArrayList<>();
        Map<String, String> providers = new LinkedHashMap<>();

        List<Destination> candidates = candidates(prefs.tags(), origin);
        List<Transport> transports = new ArrayList<>();
        if (prefs.flight()) {
            transports.addAll(flightTransports(candidates, origin, request, wantedNights, adults, today, warnings, providers));
        }
        if (prefs.bus()) {
            transports.addAll(busTransports(candidates, origin, request, stayNights, adults));
        }
        transports.removeIf(transport -> transport.cost().compareTo(budget) >= 0);
        transports.sort(Comparator.comparing(Transport::cost));

        Map<StayKey, Attempt<HotelStay>> stays = lookupHotels(transports, adults, warnings, providers);
        List<Draft> drafts = compose(transports, stays, budget);

        Comparator<Draft> order = "price".equalsIgnoreCase(request.sort())
                ? Comparator.comparing(Draft::total)
                : Comparator.comparingDouble((Draft draft) -> quality(draft.stay())).reversed().thenComparing(Draft::total);
        drafts.sort(Comparator.comparing((Draft draft) -> !draft.complete()).thenComparing(order));

        int limit = request.limit() == null ? DEFAULT_LIMIT : request.limit();
        List<Draft> top = drafts.stream().limit(limit).toList();
        Map<String, DestinationImage> covers = covers(top, providers);
        List<TripOption> options = top.stream().map(draft -> toOption(draft, budget, covers)).toList();

        addNotes(warnings, prefs, origin, options, "OK".equals(providers.get("liteapi")));
        return new SearchResponse(
                new OriginView(origin.query(), origin.iata(), origin.hubName(), origin.exact(),
                        Math.round(origin.distanceToHubKm() * 10) / 10.0),
                budget, adults, options, drafts.size(), warnings, providers);
    }

    // ---------------------------------------------------------------- candidatos e transporte

    private List<Destination> candidates(Set<Tag> wanted, ResolvedOrigin origin) {
        return catalog.all().stream()
                .filter(destination -> wanted.isEmpty() || destination.tags().stream().anyMatch(wanted::contains))
                .filter(destination -> !destination.iata().equalsIgnoreCase(origin.iata()))
                .limit(props.search().maxCandidates())
                .toList();
    }

    private List<Transport> flightTransports(List<Destination> candidates, ResolvedOrigin origin,
            SearchRequest request, Integer wantedNights, int adults, LocalDate today, List<String> warnings,
            Map<String, String> providers) {
        if (!flights.enabled()) {
            providers.put("travelpayouts", "DESATIVADO (defina TRAVELPAYOUTS_TOKEN no .env)");
            warnings.add("Voos indisponíveis: a chave do Travelpayouts não está configurada.");
            return List.of();
        }
        List<CompletableFuture<Attempt<Transport>>> futures = candidates.stream()
                .map(destination -> CompletableFuture.supplyAsync(() -> attempt(() ->
                        flightTransport(destination, origin, request, wantedNights, adults, today)), executor))
                .toList();
        return collect(futures, "travelpayouts", "cotações de voo", providers, warnings);
    }

    private Optional<Transport> flightTransport(Destination destination, ResolvedOrigin origin, SearchRequest request,
            Integer wantedNights, int adults, LocalDate today) {
        LimityProperties.Search cfg = props.search();
        Set<YearMonth> months = new LinkedHashSet<>();
        months.add(YearMonth.from(request.departureDate().minusDays(cfg.dateWindowDays())));
        months.add(YearMonth.from(request.departureDate().plusDays(cfg.dateWindowDays())));

        List<FlightQuote> quotes = new ArrayList<>();
        for (YearMonth month : months) {
            quotes.addAll(flights.roundTrips(origin.iata(), destination.iata(), month));
        }
        // Sem noites/volta informadas, prefere estadas parecidas com o padrão (só cai fora disso se não houver).
        Integer preferredNights = wantedNights != null ? wantedNights : cfg.defaultNights();
        return FlightSelector.pick(quotes, request.departureDate(), preferredNights, cfg.dateWindowDays(),
                        cfg.stayToleranceNights(), today)
                .map(pick -> {
                    FlightQuote quote = pick.quote();
                    BigDecimal cost = Money.brl(quote.price().multiply(BigDecimal.valueOf(adults)));
                    FlightView view = new FlightView(Money.brl(quote.price()), quote.airline(), quote.flightNumber(),
                            quote.departureAt(), quote.returnAt(), quote.transfers(), pick.dateMatch().name(),
                            quote.bookingUrl());
                    return new Transport(destination, "AVIAO", cost, view, null, quote.departureDate(),
                            quote.returnDate(), pick.nights());
                });
    }

    private List<Transport> busTransports(List<Destination> candidates, ResolvedOrigin origin, SearchRequest request,
            int stayNights, int adults) {
        List<Transport> result = new ArrayList<>();
        for (Destination destination : candidates) {
            Optional<BusEstimate> estimate = bus.estimate(origin.lat(), origin.lon(), destination, adults);
            estimate.ifPresent(e -> result.add(new Transport(destination, "ONIBUS", e.price(), null,
                    new BusView(e.roadDistanceKm(), e.travelHours(), true),
                    request.departureDate(), request.departureDate().plusDays(stayNights), stayNights)));
        }
        return result;
    }

    // ---------------------------------------------------------------- hotéis e composição

    private Map<StayKey, Attempt<HotelStay>> lookupHotels(List<Transport> transports, int adults,
            List<String> warnings, Map<String, String> providers) {
        Map<StayKey, Attempt<HotelStay>> results = new LinkedHashMap<>();
        if (!hotels.enabled()) {
            providers.put("liteapi", "DESATIVADO (defina LITEAPI_KEY no .env)");
            warnings.add("Hotéis indisponíveis: a chave da LiteAPI não está configurada; mostrando só o transporte.");
            return results;
        }
        Map<StayKey, CompletableFuture<Attempt<HotelStay>>> futures = new LinkedHashMap<>();
        for (Transport transport : transports) {
            StayKey key = StayKey.of(transport);
            if (futures.containsKey(key)) {
                continue;
            }
            if (futures.size() >= props.search().maxHotelLookups()) {
                break;
            }
            futures.put(key, CompletableFuture.supplyAsync(() -> attempt(() ->
                    hotels.cheapestStay(transport.destination(), transport.checkIn(), transport.checkOut(), adults)),
                    executor));
        }
        List<Attempt<HotelStay>> done = new ArrayList<>();
        futures.values().forEach(future -> done.add(future.join()));
        summarize(done, "liteapi", "cotações de hotel", providers, warnings);

        List<StayKey> keys = new ArrayList<>(futures.keySet());
        for (int i = 0; i < keys.size(); i++) {
            results.put(keys.get(i), done.get(i));
        }
        return results;
    }

    private List<Draft> compose(List<Transport> transports, Map<StayKey, Attempt<HotelStay>> stays, BigDecimal budget) {
        boolean hotelsOn = hotels.enabled();
        List<Draft> drafts = new ArrayList<>();
        for (Transport transport : transports) {
            Attempt<HotelStay> attempt = stays.get(StayKey.of(transport));
            if (hotelsOn && attempt == null) {
                continue; // destino além do limite de consultas de hotel
            }
            Optional<HotelStay> stay = attempt == null ? Optional.empty() : attempt.value();
            if (stay.isPresent()) {
                BigDecimal total = Money.brl(transport.cost().add(stay.get().total()));
                if (total.compareTo(budget) <= 0) {
                    drafts.add(new Draft(transport, stay.get(), total, true));
                }
            } else {
                drafts.add(new Draft(transport, null, transport.cost(), false));
            }
        }
        return drafts;
    }

    // ---------------------------------------------------------------- resposta

    private Map<String, DestinationImage> covers(List<Draft> drafts, Map<String, String> providers) {
        Map<String, DestinationImage> covers = new LinkedHashMap<>();
        if (!images.enabled()) {
            providers.put("pexels", "DESATIVADO (sem PEXELS_API_KEY; resultados saem sem foto)");
            return covers;
        }
        Map<String, CompletableFuture<Attempt<DestinationImage>>> futures = new LinkedHashMap<>();
        for (Draft draft : drafts) {
            Destination destination = draft.transport().destination();
            futures.computeIfAbsent(destination.id(), id -> CompletableFuture.supplyAsync(
                    () -> attempt(() -> images.coverOf(destination)), executor));
        }
        List<Attempt<DestinationImage>> done = new ArrayList<>();
        futures.forEach((id, future) -> {
            Attempt<DestinationImage> attempt = future.join();
            done.add(attempt);
            attempt.value().ifPresent(image -> covers.put(id, image));
        });
        summarize(done, "pexels", "buscas de foto", providers, new ArrayList<>());
        return covers;
    }

    private TripOption toOption(Draft draft, BigDecimal budget, Map<String, DestinationImage> covers) {
        Transport transport = draft.transport();
        Destination destination = transport.destination();
        DestinationView destinationView = new DestinationView(destination.id(), destination.name(),
                destination.state(), destination.tags().stream().map(Tag::key).sorted().toList(),
                destination.hub(), covers.get(destination.id()));

        HotelView hotelView = null;
        BigDecimal hotelCost = null;
        if (draft.stay() != null) {
            HotelStay stay = draft.stay();
            hotelCost = Money.brl(stay.total());
            hotelView = new HotelView(stay.hotelId(), stay.name(), stay.stars(), stay.rating(), stay.photoUrl(),
                    stay.address(),
                    Money.brl(stay.total().divide(BigDecimal.valueOf(transport.nights()), 2, RoundingMode.HALF_UP)),
                    hotelCost);
        }
        return new TripOption(destinationView, transport.mode(), transport.flight(), transport.bus(), hotelView,
                transport.checkIn(), transport.checkOut(), transport.nights(), transport.cost(), hotelCost,
                draft.total(), Money.brl(budget.subtract(draft.total())), draft.complete());
    }

    private void addNotes(List<String> warnings, Preferences prefs, ResolvedOrigin origin, List<TripOption> options,
            boolean hotelLookupWorked) {
        if (!origin.exact()) {
            warnings.add("Não há voos comerciais em \"" + origin.query() + "\"; usamos " + origin.hubName() + " ("
                    + origin.iata() + "), a cerca de " + Math.round(origin.distanceToHubKm()) + " km.");
        }
        if (options.stream().anyMatch(option -> option.flight() != null)) {
            warnings.add("Preços de voo vêm do cache do Aviasales (buscas recentes de usuários) e podem ter mudado; "
                    + "confirme no link antes de comprar.");
        }
        if (options.stream().anyMatch(option -> option.bus() != null)) {
            warnings.add("Preços de ônibus são estimativas (distância x tarifa média), não tarifas reais.");
        }
        if (hotelLookupWorked && options.stream().anyMatch(option -> !option.complete())) {
            warnings.add("Opções sem hotel: não encontramos disponibilidade para as datas (mostrando só o transporte).");
        }
        if (prefs.pet()) {
            warnings.add("O filtro \"Pet\" ainda não é aplicado: nenhuma das APIs gratuitas usadas informa se o hotel aceita animais.");
        }
        if (!prefs.unknown().isEmpty()) {
            warnings.add("Preferências não reconhecidas e ignoradas: " + String.join(", ", prefs.unknown()) + ".");
        }
        if (options.isEmpty() && warnings.isEmpty()) {
            warnings.add("Nenhuma opção coube no orçamento para essas datas. Tente aumentar o valor ou flexibilizar a data.");
        }
    }

    // ---------------------------------------------------------------- utilidades

    private static Integer wantedNights(SearchRequest request) {
        if (request.returnDate() != null) {
            long nights = ChronoUnit.DAYS.between(request.departureDate(), request.returnDate());
            if (nights < 1 || nights > 30) {
                throw new IllegalArgumentException("A volta deve ser de 1 a 30 dias depois da saída.");
            }
            return (int) nights;
        }
        return request.nights();
    }

    private static double quality(HotelStay stay) {
        if (stay == null) {
            return -1;
        }
        if (stay.rating() != null) {
            return stay.rating();
        }
        return stay.stars() != null ? stay.stars() * 2 : 0;
    }

    private static <T> Attempt<T> attempt(Supplier<Optional<T>> call) {
        try {
            return Attempt.ok(call.get());
        } catch (ProviderException e) {
            return Attempt.failed(e.getMessage());
        }
    }

    private <T> List<T> collect(List<CompletableFuture<Attempt<T>>> futures, String provider, String what,
            Map<String, String> providers, List<String> warnings) {
        List<Attempt<T>> done = futures.stream().map(CompletableFuture::join).toList();
        summarize(done, provider, what, providers, warnings);
        return done.stream().flatMap(attempt -> attempt.value().stream()).toList();
    }

    private static <T> void summarize(List<Attempt<T>> attempts, String provider, String what,
            Map<String, String> providers, List<String> warnings) {
        long errors = attempts.stream().filter(attempt -> attempt.error() != null).count();
        if (errors == 0) {
            providers.put(provider, "OK");
            return;
        }
        String lastError = attempts.stream().map(Attempt::error).filter(e -> e != null).reduce((a, b) -> b).orElse("");
        providers.put(provider, "ERRO em " + errors + " de " + attempts.size() + " " + what + ": " + lastError);
        warnings.add("Falha ao consultar " + provider + " (" + lastError + "); resultados podem estar incompletos.");
    }
}
