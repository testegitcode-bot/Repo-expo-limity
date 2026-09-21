package com.limity.back.origin;

public class OriginNotFoundException extends RuntimeException {

    public OriginNotFoundException(String query) {
        super("Não encontramos a cidade de origem \"" + query
                + "\". Confira o nome ou informe o código IATA (ex.: SAO, REC).");
    }
}
