package com.luxhost.hotel.service;

import com.luxhost.hotel.model.Booking;
import com.luxhost.hotel.model.BookingStatus;
import com.luxhost.hotel.model.Room;
import com.luxhost.hotel.repository.BookingRepository;
import com.luxhost.hotel.repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class StatisticsService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;

    public StatisticsService(BookingRepository bookingRepository, RoomRepository roomRepository) {
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
    }


    public int getConfirmedBookingsCount() {
        List<Booking> confirmedBookings = bookingRepository.findAll()
                .stream()
                .filter(booking -> booking.getStatus() == BookingStatus.CONFIRMED)
                .toList();
        return confirmedBookings.size();
    }


    public Map<Long, RoomBookingStats> getRoomStatistics() {
        List<Booking> confirmedBookings = bookingRepository.findAll()
                .stream()
                .filter(booking -> booking.getStatus() == BookingStatus.CONFIRMED)
                .toList();

        Map<Long, RoomBookingStats> stats = new HashMap<>();

        for (Booking booking : confirmedBookings) {
            Room room = booking.getRoom();
            long days = ChronoUnit.DAYS.between(booking.getStartDate(), booking.getEndDate());
            double price = booking.getPrice();

            RoomBookingStats roomStats = stats.getOrDefault(room.getId(), new RoomBookingStats());
            roomStats.incrementBookingCount();
            roomStats.addTotalDays(days);
            roomStats.addTotalRevenue(price);

            stats.put(room.getId(), roomStats);
        }

        return stats;
    }


    public static class RoomBookingStats {
        private int bookingCount;
        private long totalDays;
        private double totalRevenue;

        public void incrementBookingCount() { this.bookingCount++; }
        public void addTotalDays(long days) { this.totalDays += days; }
        public void addTotalRevenue(double revenue) { this.totalRevenue += revenue; }

        public int getBookingCount() { return bookingCount; }
        public long getTotalDays() { return totalDays; }
        public double getTotalRevenue() { return totalRevenue; }
    }
}
