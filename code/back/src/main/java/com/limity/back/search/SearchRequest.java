package com.limity.back.search;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Espelha o SearchWidget do front.
 *
 * @param budget      "Quanto você pode gastar?" (total da viagem, todos os viajantes, em BRL)
 * @param origin      "Cidade de origem" (nome do município ou código IATA)
 * @param preferences rótulos dos botões: Praia, Urbano, Natureza, Ônibus, Avião, Pet (e também Serra, Histórico, Internacional)
 * @param returnDate  opcional; se ausente usa {@code nights}, e se este também faltar, o padrão do servidor
 * @param sort        "best" (padrão: melhor hotel primeiro) ou "price" (mais barato primeiro)
 */
public record SearchRequest(
        @NotNull(message = "Informe o orçamento")
        @DecimalMin(value = "1", message = "O orçamento deve ser maior que zero")
        BigDecimal budget,

        @NotBlank(message = "Informe a cidade de origem")
        String origin,

        @NotNull(message = "Informe a data de saída")
        @FutureOrPresent(message = "A data de saída não pode estar no passado")
        LocalDate departureDate,

        LocalDate returnDate,

        @Min(value = 1, message = "Mínimo de 1 noite")
        @Max(value = 30, message = "Máximo de 30 noites")
        Integer nights,

        @Min(value = 1, message = "Mínimo de 1 viajante")
        @Max(value = 4, message = "Máximo de 4 viajantes por busca")
        Integer adults,

        List<String> preferences,

        @Min(1) @Max(50)
        Integer limit,

        String sort) {
}
