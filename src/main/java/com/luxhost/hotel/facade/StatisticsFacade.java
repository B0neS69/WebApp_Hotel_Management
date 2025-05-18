package com.luxhost.hotel.facade;

import com.luxhost.hotel.model.BookingStatus;
import com.luxhost.hotel.repository.BookingRepository;
import com.luxhost.hotel.statistics.*;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class StatisticsFacade {

    private final BookingRepository bookingRepository;

    public StatisticsFacade(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public Map<Long, Long> getActiveBookingsPerRoom() {
        StatisticsTemplate stats = new RoomActiveBookingsStatistics(bookingRepository);
        Map<String, Object> result = stats.generateStatistics();
        return (Map<Long, Long>) result.getOrDefault("activeBookingsPerRoom", new HashMap<>());
    }

    public List<RoomBookingRevenueStatistics.RoomRevenueInfo> getRoomRevenueStats() {
        RoomBookingRevenueStatistics stats = new RoomBookingRevenueStatistics(bookingRepository);
        Map<String, Object> result = stats.generateStatistics();
        Collection<RoomBookingRevenueStatistics.RoomRevenueInfo> values =
                (Collection<RoomBookingRevenueStatistics.RoomRevenueInfo>) result.getOrDefault("revenuePerRoom", Collections.emptyList());
        return new ArrayList<>(values);
    }

    public int getBookingsCountByStatus(BookingStatus status) {
        StatisticsTemplate stats = new BookingStatusStatistics(bookingRepository, status);
        Map<String, Object> result = stats.generateStatistics();
        return (int) result.getOrDefault(status.name().toLowerCase() + "BookingsCount", 0);
    }

}
