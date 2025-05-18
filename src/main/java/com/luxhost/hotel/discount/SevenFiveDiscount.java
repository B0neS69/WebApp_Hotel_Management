package com.luxhost.hotel.discount;

public class SevenFiveDiscount implements Discount {
    public double apply(double basePrice) {
        return basePrice * 0.925;
    }
}
