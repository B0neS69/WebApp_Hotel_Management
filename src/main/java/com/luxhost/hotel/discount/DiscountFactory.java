package com.luxhost.hotel.discount;

public class DiscountFactory {
    public static Discount getDiscount(long days) {
        if (days >= 30) return new TwelveFiveDiscount();
        if (days >= 15) return new SevenFiveDiscount();
        if (days >= 10) return new FivePercentDiscount();
        return new NoDiscount();
    }
}


