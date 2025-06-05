package com.luxhost.hotel.dto;

import com.luxhost.hotel.model.BookingStatus;
import java.time.LocalDate;

public class BookingWithRoomNumberDTO {
    private Long id;
    private LocalDate startDate;
    private LocalDate endDate;
    private BookingStatus status;
    private Long roomId;
    private String roomNumber;
    private double price;
    private String phone;


    public BookingWithRoomNumberDTO(Long id, LocalDate startDate, LocalDate endDate, BookingStatus status, double price, String phone, Long roomId,String roomNumber) {
        this.id = id;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.roomId = roomId;
        this.price = price;
        this.phone = phone;
        this.roomNumber = roomNumber;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public Long getRoomId() {
        return roomId;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }
}
