package com.limity.back.config;

import java.time.Duration;
import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.util.StringUtils;

@ConfigurationProperties("limity")
public record LimityProperties(
        Cors cors,
        Search search,
        Travelpayouts travelpayouts,
        LiteApi liteapi,
        Pexels pexels,
        Geocoding geocoding,
        Auth auth) {

    public record Cors(List<String> allowedOrigins) {
    }

    public record Search(
            int defaultNights,
            int maxHotelLookups,
            int dateWindowDays,
            int stayToleranceNights,
            int maxCandidates,
            Bus bus) {
    }

    public record Bus(double maxDistanceKm, double roadFactor, double brlPerKm, double averageSpeedKmh) {
    }

    public record Travelpayouts(
            String token,
            String marker,
            String baseUrl,
            String placesUrl,
            String linkBaseUrl,
            String market,
            Duration timeout,
            int maxConcurrency) {

        public boolean enabled() {
            return StringUtils.hasText(token);
        }
    }

    public record LiteApi(
            String key,
            String baseUrl,
            Duration timeout,
            int maxConcurrency,
            int hotelsPerLookup,
            int hotelRadiusMeters,
            int ratesTimeoutSeconds) {

        public boolean enabled() {
            return StringUtils.hasText(key);
        }
    }

    public record Pexels(String key, String baseUrl, Duration timeout) {

        public boolean enabled() {
            return StringUtils.hasText(key);
        }
    }

    public record Geocoding(String baseUrl, Duration timeout) {
    }

    public record Auth(String jwtSecret, Duration jwtExpiration) {
    }
}
