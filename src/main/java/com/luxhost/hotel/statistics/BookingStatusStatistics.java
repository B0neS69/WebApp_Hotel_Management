package com.luxhost.hotel.statistics;

import com.luxhost.hotel.model.Booking;
import com.luxhost.hotel.model.BookingStatus;
import com.luxhost.hotel.repository.BookingRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class BookingStatusStatistics extends StatisticsTemplate {

    private final BookingRepository bookingRepository;
    private final BookingStatus status;
    private List<Booking> bookings;

    public BookingStatusStatistics(BookingRepository bookingRepository, BookingStatus status) {
        this.bookingRepository = bookingRepository;
        this.status = status;
    }

    @Override
    protected void fetchData() {
        bookings = bookingRepository.findByStatus(status);
    }

    @Override
    protected Map<String, Object> calculateStatistics() {
        Map<String, Object> result = new HashMap<>();
        result.put(status.name().toLowerCase() + "BookingsCount", bookings.size());
        return result;
    }
}
