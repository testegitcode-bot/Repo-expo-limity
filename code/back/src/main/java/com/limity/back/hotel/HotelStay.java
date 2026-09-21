package com.limity.back.hotel;

import java.math.BigDecimal;

/**
 * Hospedagem mais barata encontrada para o período.
 *
 * @param total valor total da estadia para todos os hóspedes, em BRL
 */
public record HotelStay(
        String hotelId,
        String name,
        Double stars,
        Double rating,
        String photoUrl,
        String address,
        BigDecimal total) {
}
