package com.limity.back.common;

import java.math.BigDecimal;
import java.math.RoundingMode;

public final class Money {

    private Money() {
    }

    public static BigDecimal brl(BigDecimal value) {
        return value.setScale(2, RoundingMode.HALF_UP);
    }

    public static BigDecimal brl(double value) {
        return brl(BigDecimal.valueOf(value));
    }
}
