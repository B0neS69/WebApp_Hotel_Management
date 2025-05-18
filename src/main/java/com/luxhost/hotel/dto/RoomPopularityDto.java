package com.luxhost.hotel.dto;

public class RoomPopularityDto {
    private String roomType;
    private int bookings;
    private double revenue;

    public RoomPopularityDto() {}

    public RoomPopularityDto(String roomType, int bookings, double revenue) {
        this.roomType = roomType;
        this.bookings = bookings;
        this.revenue = revenue;
    }

    public String getRoomType() { return roomType; }
    public void setRoomType(String roomType) { this.roomType = roomType; }

    public int getBookings() { return bookings; }
    public void setBookings(int bookings) { this.bookings = bookings; }

    public double getRevenue() { return revenue; }
    public void setRevenue(double revenue) { this.revenue = revenue; }
}
