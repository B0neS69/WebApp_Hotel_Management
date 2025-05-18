package com.luxhost.hotel.statistics;

import com.luxhost.hotel.model.Booking;
import com.luxhost.hotel.model.BookingStatus;
import com.luxhost.hotel.repository.BookingRepository;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class RoomActiveBookingsStatistics extends StatisticsTemplate {

    private final BookingRepository bookingRepository;
    private List<Booking> activeBookings;

    public RoomActiveBookingsStatistics(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    @Override
    protected void fetchData() {
        activeBookings = bookingRepository.findByStatus(BookingStatus.PENDING);
    }

    @Override
    protected Map<String, Object> calculateStatistics() {
        Map<String, Object> result = new HashMap<>();

        Map<Long, Long> bookingsPerRoom = activeBookings.stream()
                .collect(Collectors.groupingBy(b -> b.getRoom().getId(), Collectors.counting()));

        result.put("activeBookingsPerRoom", bookingsPerRoom);

        return result;
    }
}
