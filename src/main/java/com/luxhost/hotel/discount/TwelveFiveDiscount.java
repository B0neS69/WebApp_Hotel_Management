package com.luxhost.hotel.discount;

public class TwelveFiveDiscount implements Discount {
    public double apply(double basePrice) {
        return basePrice * 0.875;
    }
}
