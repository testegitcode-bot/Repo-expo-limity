package com.limity.back.bus;

import java.util.Optional;

import com.limity.back.catalog.Destination;
import com.limity.back.common.Geo;
import com.limity.back.common.Money;
import com.limity.back.config.LimityProperties;
import org.springframework.stereotype.Component;

/**
 * Não existe API gratuita de passagens de ônibus no Brasil (ClickBus/Buser só têm afiliados),
 * então estimamos: distância em linha reta x fator rodoviário x tarifa média por km.
 */
@Component
public class BusEstimator {

    private final LimityProperties.Bus props;

    public BusEstimator(LimityProperties props) {
        this.props = props.search().bus();
    }

    public Optional<BusEstimate> estimate(double originLat, double originLon, Destination destination, int adults) {
        if (destination.international()) {
            return Optional.empty();
        }
        double roadKm = Geo.distanceKm(originLat, originLon, destination.lat(), destination.lon()) * props.roadFactor();
        if (roadKm < 30 || roadKm > props.maxDistanceKm()) {
            return Optional.empty();
        }
        double roundTripPerPerson = roadKm * props.brlPerKm() * 2;
        return Optional.of(new BusEstimate(
                Math.round(roadKm * 10) / 10.0,
                Math.round(roadKm / props.averageSpeedKmh() * 10) / 10.0,
                Money.brl(roundTripPerPerson * adults)));
    }
}
