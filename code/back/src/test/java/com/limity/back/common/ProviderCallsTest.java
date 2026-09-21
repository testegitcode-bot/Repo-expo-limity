package com.limity.back.common;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.time.Duration;
import java.util.concurrent.atomic.AtomicInteger;

import org.junit.jupiter.api.Test;

class ProviderCallsTest {

    @Test
    void retriesOnRateLimitUntilItSucceeds() {
        AtomicInteger calls = new AtomicInteger();

        String result = ProviderCalls.retryOnRateLimit(3, Duration.ofMillis(1), () -> {
            if (calls.incrementAndGet() < 3) {
                throw new ProviderException("liteapi", 429, "limite");
            }
            return "ok";
        });

        assertThat(result).isEqualTo("ok");
        assertThat(calls.get()).isEqualTo(3);
    }

    @Test
    void givesUpAfterMaxRetries() {
        AtomicInteger calls = new AtomicInteger();

        assertThatThrownBy(() -> ProviderCalls.retryOnRateLimit(2, Duration.ofMillis(1), () -> {
            calls.incrementAndGet();
            throw new ProviderException("liteapi", 429, "limite");
        })).isInstanceOf(ProviderException.class);

        assertThat(calls.get()).isEqualTo(3); // 1 tentativa + 2 repetições
    }

    @Test
    void doesNotRetryOtherErrors() {
        AtomicInteger calls = new AtomicInteger();

        assertThatThrownBy(() -> ProviderCalls.retryOnRateLimit(3, Duration.ofMillis(1), () -> {
            calls.incrementAndGet();
            throw new ProviderException("liteapi", 401, "chave");
        })).isInstanceOf(ProviderException.class);

        assertThat(calls.get()).isEqualTo(1);
    }
}
