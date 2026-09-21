package com.limity.back.origin;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

import com.limity.back.common.Geo;
import com.limity.back.common.Texts;
import com.limity.back.origin.PlacesClient.Airport;
import com.limity.back.origin.PlacesClient.Place;
import org.springframework.stereotype.Service;

/**
 * Transforma o texto do campo "Cidade de origem" em um ponto de partida para voos e ônibus.
 * 1) código IATA explícito; 2) cidade com aeroporto (nome igual); 3) qualquer município do Brasil,
 * geocodificado e ligado ao aeroporto comercial mais próximo.
 */
@Service
public class OriginResolver {

    private static final Pattern IATA = Pattern.compile("^[A-Za-z]{3}$");

    private final PlacesClient places;
    private final GeocodingClient geocoding;

    public OriginResolver(PlacesClient places, GeocodingClient geocoding) {
        this.places = places;
        this.geocoding = geocoding;
    }

    public ResolvedOrigin resolve(String input) {
        String query = input.trim();

        if (IATA.matcher(query).matches()) {
            Optional<ResolvedOrigin> byCode = places.searchCities(query).stream()
                    .filter(place -> query.equalsIgnoreCase(place.code()) && hasCoordinates(place))
                    .findFirst()
                    .map(place -> exact(query, place));
            if (byCode.isPresent()) {
                return byCode.get();
            }
        }

        String wanted = Texts.normalize(query);
        Optional<ResolvedOrigin> byName = places.searchCities(query).stream()
                .filter(place -> "BR".equals(place.countryCode()) && hasCoordinates(place))
                .filter(place -> Texts.normalize(place.name()).equals(wanted))
                .findFirst()
                .map(place -> exact(query, place));
        if (byName.isPresent()) {
            return byName.get();
        }

        return geocoding.geocodeBrazilianCity(query)
                .flatMap(point -> nearestAirport(query, point.lat(), point.lon()))
                .orElseThrow(() -> new OriginNotFoundException(query));
    }

    /** Sugestões para o autocomplete do front (brasileiras primeiro). */
    public List<Place> suggest(String term) {
        return places.searchCities(term).stream()
                .sorted(Comparator.comparing((Place place) -> !"BR".equals(place.countryCode())))
                .limit(8)
                .toList();
    }

    private Optional<ResolvedOrigin> nearestAirport(String query, double lat, double lon) {
        List<Airport> airports = places.brazilianAirports();
        return airports.stream()
                .min(Comparator.comparingDouble(a -> Geo.distanceKm(lat, lon, a.coordinates().lat(), a.coordinates().lon())))
                .map(airport -> new ResolvedOrigin(
                        query,
                        airport.cityCode(),
                        airport.name(),
                        lat,
                        lon,
                        false,
                        Geo.distanceKm(lat, lon, airport.coordinates().lat(), airport.coordinates().lon())));
    }

    private static ResolvedOrigin exact(String query, Place place) {
        return new ResolvedOrigin(query, place.code(), place.name(),
                place.coordinates().lat(), place.coordinates().lon(), true, 0);
    }

    private static boolean hasCoordinates(Place place) {
        return place.coordinates() != null && place.coordinates().lat() != null && place.coordinates().lon() != null;
    }
}
