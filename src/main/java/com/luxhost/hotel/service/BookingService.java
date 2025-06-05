package com.luxhost.hotel.service;

import com.luxhost.hotel.model.Booking;
import com.luxhost.hotel.model.BookingStatus;
import com.luxhost.hotel.repository.BookingRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import com.luxhost.hotel.discount.Discount;
import com.luxhost.hotel.discount.DiscountFactory;
import com.luxhost.hotel.model.Room;
import com.luxhost.hotel.repository.RoomRepository;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

@Service
public class BookingService {
    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;

    public BookingService(BookingRepository bookingRepository, RoomRepository roomRepository) {
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
    }

    public List<Booking> getBookingsForUser(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    public Booking saveBooking(Booking booking) {
        Room room = roomRepository.findById(booking.getRoom().getId())
                .orElseThrow(() -> new IllegalArgumentException("Room not found"));

        // Перевірка на конфлікт дат перед збереженням
        List<Booking> existing = bookingRepository.findByRoomId(room.getId());
        boolean conflict = existing.stream()
                .filter(b -> b.getStatus() != BookingStatus.COMPLETED && b.getStatus() != BookingStatus.CANCELED)
                // Ігнорувати завершені бронювання
                .anyMatch(b ->
                        booking.getStartDate().isBefore(b.getEndDate()) &&
                                booking.getEndDate().isAfter(b.getStartDate())
                );


        if (conflict) {
            throw new IllegalArgumentException("Обрані дати вже зайняті для цього номера.");
        }

        long days = ChronoUnit.DAYS.between(booking.getStartDate(), booking.getEndDate());
        double basePrice = room.getPrice() * days;

        Discount discount = DiscountFactory.getDiscount(days);
        double finalPrice = discount.apply(basePrice);

        booking.setRoom(room);
        booking.setPrice(finalPrice);

        if (booking.getCreatedBy() == null) {
            booking.setCreatedBy("USER");
        }

        return bookingRepository.save(booking);
    }



    public boolean cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStartDate().isAfter(LocalDate.now().plusDays(1))) {
            booking.setStatus(BookingStatus.CANCELED);
            bookingRepository.save(booking);
            return true;
        }

        return false; // Заборонити відміну
    }
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public boolean cancelBookingByAdmin(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId).orElse(null);
        if (booking != null && booking.getStatus() != BookingStatus.CANCELED) {
            booking.setStatus(BookingStatus.CANCELED);
            bookingRepository.save(booking);
            return true;
        }
        return false;
    }

    public boolean confirmBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId).orElse(null);
        if (booking != null && booking.getStatus() == BookingStatus.PENDING) {
            booking.setStatus(BookingStatus.CONFIRMED);
            bookingRepository.save(booking);
            return true;
        }
        return false;
    }
    @Scheduled(cron = "0 0 1 * * *")
    public void autoCompleteBookings() {
        List<Booking> confirmedBookings = bookingRepository.findByStatus(BookingStatus.CONFIRMED);
        LocalDate today = LocalDate.now();
        for (Booking booking : confirmedBookings) {
            if (booking.getEndDate().isBefore(today) || booking.getEndDate().isEqual(today)) {
                booking.setStatus(BookingStatus.COMPLETED);
                bookingRepository.save(booking);
            }
        }
    }
    @PostConstruct
    public void init() {
        autoCompleteBookings(); // запуск при старті додатку
    }
    public boolean completeBookingByAdmin(Long bookingId) {
        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
        if (bookingOpt.isPresent()) {
            Booking booking = bookingOpt.get();
            if (booking.getStatus() == BookingStatus.CONFIRMED) {
                booking.setStatus(BookingStatus.COMPLETED);
                bookingRepository.save(booking);
                return true;
            }
        }
        return false;
    }

}
