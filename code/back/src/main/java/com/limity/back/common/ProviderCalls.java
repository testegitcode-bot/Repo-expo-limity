package com.limity.back.common;

import java.net.http.HttpClient;
import java.time.Duration;
import java.util.concurrent.Semaphore;
import java.util.function.Supplier;

import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;

public final class ProviderCalls {

    private ProviderCalls() {
    }

    public static RestClient restClient(String baseUrl, Duration timeout) {
        HttpClient http = HttpClient.newBuilder()
                // HTTP/1.1: com várias chamadas simultâneas o HTTP/2 do JDK chegou a derrubar conexões
                // (I/O error sem mensagem) nas APIs de terceiros.
                .version(HttpClient.Version.HTTP_1_1)
                .connectTimeout(timeout)
                .followRedirects(HttpClient.Redirect.NORMAL)
                .build();
        JdkClientHttpRequestFactory factory = new JdkClientHttpRequestFactory(http);
        factory.setReadTimeout(timeout);
        return RestClient.builder().baseUrl(baseUrl).requestFactory(factory).build();
    }

    /** Executa a chamada convertendo qualquer erro de HTTP/rede em {@link ProviderException}. */
    public static <T> T call(String provider, Supplier<T> call) {
        try {
            return call.get();
        } catch (RestClientResponseException e) {
            int status = e.getStatusCode().value();
            String reason = switch (status) {
                case 401, 403 -> "chave/token recusado (HTTP " + status + "); confira o .env";
                case 429 -> "limite de requisições atingido (HTTP 429)";
                default -> "resposta HTTP " + status;
            };
            throw new ProviderException(provider, status, reason);
        } catch (RestClientException e) {
            Throwable cause = e.getCause() != null ? e.getCause() : e;
            String detail = cause.getMessage() != null ? cause.getMessage() : cause.getClass().getSimpleName();
            throw new ProviderException(provider, "falha de rede ou timeout (" + detail + ")");
        }
    }

    /**
     * Repete a chamada quando o provedor responde 429 (limite de requisições), esperando um pouco mais
     * a cada tentativa. Planos grátis/sandbox costumam ter limites baixos por segundo.
     */
    public static <T> T retryOnRateLimit(int maxRetries, Duration baseDelay, Supplier<T> call) {
        for (int attempt = 0;; attempt++) {
            try {
                return call.get();
            } catch (ProviderException e) {
                if (e.httpStatus() != 429 || attempt >= maxRetries) {
                    throw e;
                }
                try {
                    Thread.sleep(baseDelay.toMillis() * (attempt + 1));
                } catch (InterruptedException interrupted) {
                    Thread.currentThread().interrupt();
                    throw e;
                }
            }
        }
    }

    /** Limita quantas chamadas simultâneas vão para uma API (respeita limites do plano grátis). */
    public static <T> T limited(Semaphore semaphore, Supplier<T> call) {
        semaphore.acquireUninterruptibly();
        try {
            return call.get();
        } finally {
            semaphore.release();
        }
    }
}
