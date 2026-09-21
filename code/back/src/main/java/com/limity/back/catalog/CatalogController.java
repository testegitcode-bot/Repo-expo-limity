package com.limity.back.catalog;

import java.util.List;

import com.limity.back.origin.OriginResolver;
import com.limity.back.origin.PlacesClient.Place;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class CatalogController {

    public record DestinationSummary(String id, String name, String state, List<String> tags, String flightTo) {
    }

    public record OriginSuggestion(String iata, String name, String state, String country) {
    }

    private final DestinationCatalog catalog;
    private final OriginResolver originResolver;

    public CatalogController(DestinationCatalog catalog, OriginResolver originResolver) {
        this.catalog = catalog;
        this.originResolver = originResolver;
    }

    /** Destinos curados, opcionalmente filtrados por tag (praia, urbano, natureza, serra, historico, internacional). */
    @GetMapping("/destinations")
    public List<DestinationSummary> destinations(@RequestParam(required = false) String tag) {
        return catalog.all().stream()
                .filter(destination -> tag == null || Tag.fromLabel(tag).map(destination.tags()::contains).orElse(false))
                .map(destination -> new DestinationSummary(destination.id(), destination.name(), destination.state(),
                        destination.tags().stream().map(Tag::key).sorted().toList(), destination.hub()))
                .toList();
    }

    /** Autocomplete de cidades de origem (aceita nome ou código IATA). */
    @GetMapping("/origins")
    public List<OriginSuggestion> origins(@RequestParam String term) {
        if (term.trim().length() < 2) {
            return List.of();
        }
        return originResolver.suggest(term.trim()).stream()
                .map((Place place) -> new OriginSuggestion(place.code(), place.name(), place.stateCode(),
                        place.countryName()))
                .toList();
    }
}
