package com.limity.back.config;

import java.time.Duration;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCache;
import org.springframework.cache.support.SimpleCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableCaching
public class AppConfig {

    public static final String CACHE_FLIGHTS = "flights";
    public static final String CACHE_HOTEL_STAY = "hotelStay";
    public static final String CACHE_PLACES = "places";
    public static final String CACHE_GEOCODE = "geocode";
    public static final String CACHE_IMAGES = "images";

    private final LimityProperties props;

    public AppConfig(LimityProperties props) {
        this.props = props;
    }

    /**
     * Os preços de voo do Travelpayouts já são cache; guardamos poucas horas para não gastar cota
     * e ainda refletir mudanças. Hotéis mudam mais rápido, listas estáticas e fotos quase nunca.
     */
    @Bean
    public CacheManager cacheManager() {
        SimpleCacheManager manager = new SimpleCacheManager();
        manager.setCaches(List.of(
                cache(CACHE_FLIGHTS, Duration.ofHours(3), 5_000),
                cache(CACHE_HOTEL_STAY, Duration.ofMinutes(30), 2_000),
                cache(CACHE_PLACES, Duration.ofDays(7), 5_000),
                cache(CACHE_GEOCODE, Duration.ofDays(30), 5_000),
                cache(CACHE_IMAGES, Duration.ofDays(7), 500)));
        return manager;
    }

    private static CaffeineCache cache(String name, Duration ttl, long maxSize) {
        return new CaffeineCache(name, Caffeine.newBuilder().expireAfterWrite(ttl).maximumSize(maxSize).recordStats().build());
    }

    @Bean(destroyMethod = "shutdown")
    public ExecutorService searchExecutor() {
        AtomicInteger counter = new AtomicInteger();
        return Executors.newFixedThreadPool(12, runnable -> {
            Thread thread = new Thread(runnable, "search-" + counter.incrementAndGet());
            thread.setDaemon(true);
            return thread;
        });
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(allowedOriginPatterns());
        configuration.setAllowedMethods(List.of("GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setMaxAge(3600L);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    private List<String> allowedOriginPatterns() {
        List<String> origins = new java.util.ArrayList<>(props.cors().allowedOrigins());
        origins.add("http://localhost:*");
        origins.add("http://127.0.0.1:*");
        origins.add("https://localhost:*");
        origins.add("https://127.0.0.1:*");
        return origins.stream().distinct().toList();
    }
}
