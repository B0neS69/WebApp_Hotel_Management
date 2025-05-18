package com.luxhost.hotel.discount;

public class NoDiscount implements Discount {
    public double apply(double basePrice) {
        return basePrice;
    }
}
