package com.luxhost.hotel.statistics;

import com.luxhost.hotel.model.Booking;
import com.luxhost.hotel.model.BookingStatus;
import com.luxhost.hotel.repository.BookingRepository;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class RoomBookingRevenueStatistics extends StatisticsTemplate {

    private final BookingRepository bookingRepository;
    private List<Booking> confirmedBookings;

    public RoomBookingRevenueStatistics(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    @Override
    protected void fetchData() {
        confirmedBookings = bookingRepository.findByStatus(BookingStatus.PENDING);
    }

    @Override
    protected Map<String, Object> calculateStatistics() {
        Map<String, Object> result = new HashMap<>();

        // Групуємо бронювання по ID номера
        Map<Long, RoomRevenueInfo> revenuePerRoom = confirmedBookings.stream()
                .collect(Collectors.groupingBy(
                        booking -> booking.getRoom().getId(),
                        Collectors.collectingAndThen(
                                Collectors.toList(),
                                bookings -> {
                                    long count = bookings.size();
                                    double totalRevenue = bookings.stream()
                                            .mapToDouble(Booking::getPrice)
                                            .sum();
                                    String roomType = bookings.get(0).getRoom().getType();
                                    return new RoomRevenueInfo(bookings.get(0).getRoom().getId(), roomType, count, totalRevenue);
                                }
                        )
                ));

        result.put("revenuePerRoom", revenuePerRoom.values());
        return result;
    }


    public static class RoomRevenueInfo {
        private Long roomId;
        private String roomType;
        private long bookingsCount;
        private double totalRevenue;

        public RoomRevenueInfo(Long roomId, String roomType, long bookingsCount, double totalRevenue) {
            this.roomId = roomId;
            this.roomType = roomType;
            this.bookingsCount = bookingsCount;
            this.totalRevenue = totalRevenue;
        }

        // Геттери
        public Long getRoomId() { return roomId; }
        public String getRoomType() { return roomType; }
        public long getBookingsCount() { return bookingsCount; }
        public double getTotalRevenue() { return totalRevenue; }
    }
}
