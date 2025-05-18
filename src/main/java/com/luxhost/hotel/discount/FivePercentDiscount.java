package com.luxhost.hotel.discount;

public class FivePercentDiscount implements Discount {
    public double apply(double basePrice) {
        return basePrice * 0.95;
    }
}
