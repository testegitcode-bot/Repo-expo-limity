package com.limity.back.common;

/** Falha ao falar com uma API externa (rede, chave inválida, limite de cota...). */
public class ProviderException extends RuntimeException {

    private final String provider;
    private final int httpStatus;

    public ProviderException(String provider, String message) {
        this(provider, 0, message);
    }

    public ProviderException(String provider, int httpStatus, String message) {
        super(message);
        this.provider = provider;
        this.httpStatus = httpStatus;
    }

    public String provider() {
        return provider;
    }

    /** Status HTTP devolvido pelo provedor, ou 0 quando foi falha de rede/configuração. */
    public int httpStatus() {
        return httpStatus;
    }
}
