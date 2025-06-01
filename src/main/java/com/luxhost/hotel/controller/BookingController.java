package com.luxhost.hotel.controller;

import com.luxhost.hotel.dto.BookingWithRoomNumberDTO;
import com.luxhost.hotel.model.Booking;
import com.luxhost.hotel.model.BookingStatus;
import com.luxhost.hotel.repository.BookingRepository;
import com.luxhost.hotel.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;
    private final BookingRepository bookingRepository;

    public BookingController(BookingService bookingService, BookingRepository bookingRepository) {
        this.bookingService = bookingService;
        this.bookingRepository = bookingRepository;
    }

    @PostMapping
    public Booking createBooking(@RequestBody Booking booking) {
        booking.setStatus(BookingStatus.PENDING);
        return bookingService.saveBooking(booking);
    }

    @PostMapping("/admin/create-booking")
    @PreAuthorize("hasRole('ADMIN')")
    public Booking createBookingbyAdmin(@RequestBody Booking booking) {
        booking.setCreatedBy("ADMIN");
        booking.setStatus(BookingStatus.PENDING);
        return bookingService.saveBooking(booking);
    }
    @GetMapping("/user/{userId}")
    public List<BookingWithRoomNumberDTO> getBookingsForUser(@PathVariable Long userId) {
        List<Booking> bookings = bookingService.getBookingsForUser(userId);
        return bookings.stream()
                .map(booking -> {
                    String roomNumber = booking.getRoom() != null ? booking.getRoom().getRoomNumber() : "N/A";
                    return new BookingWithRoomNumberDTO(
                            booking.getId(),
                            booking.getStartDate(),
                            booking.getEndDate(),
                            booking.getStatus(),
                            booking.getRoom() != null ? booking.getRoom().getId() : null,
                            roomNumber
                    );
                })
                .toList();
    }

    // 🔽 Новий ендпоінт
    @GetMapping("/room/{roomId}/booked-dates")
    public List<Map<String, LocalDate>> getBookedDates(@PathVariable Long roomId) {
        List<BookingStatus> activeStatuses = List.of(BookingStatus.PENDING, BookingStatus.CONFIRMED);
        List<Booking> bookings = bookingRepository.findByRoomIdAndStatusIn(roomId, activeStatuses);
        return bookings.stream()
                .map(b -> Map.of("start", b.getStartDate(), "end", b.getEndDate()))
                .toList();
    }


    @PutMapping("/cancel/{bookingId}")
    public ResponseEntity<String> cancelBooking(@PathVariable Long bookingId) {
        boolean success = bookingService.cancelBooking(bookingId);
        if (success) {
            return ResponseEntity.ok("Бронювання скасовано!");
        } else {
            return ResponseEntity.badRequest().body("Бронювання можна скасувати тільки за 1 день до заїзду.");
        }
    }
    @PutMapping("/admin/cancel/{bookingId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> cancelBookingByAdmin(@PathVariable Long bookingId) {
        boolean success = bookingService.cancelBookingByAdmin(bookingId);
        return success
                ? ResponseEntity.ok("Бронювання скасовано адміністратором.")
                : ResponseEntity.badRequest().body("Бронювання не знайдено або вже скасоване.");
    }

    @PutMapping("/admin/confirm/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> confirmBooking(@PathVariable Long id) {
        boolean success = bookingService.confirmBooking(id);
        return success
                ? ResponseEntity.ok("Бронювання підтверджено.")
                : ResponseEntity.badRequest().body("Не вдалося підтвердити.");
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public List<BookingWithRoomNumberDTO> getAllBookings() {
        List<Booking> bookings = bookingService.getAllBookings();
        return bookings.stream()
                .map(booking -> {
                    String roomNumber = booking.getRoom() != null ? booking.getRoom().getRoomNumber() : "N/A";
                    return new BookingWithRoomNumberDTO(
                            booking.getId(),
                            booking.getStartDate(),
                            booking.getEndDate(),
                            booking.getStatus(),
                            booking.getRoom().getId(),
                            roomNumber
                    );
                })
                .toList();
    }

    @PutMapping("/admin/complete/{bookingId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> completeBookingByAdmin(@PathVariable Long bookingId) {
        boolean success = bookingService.completeBookingByAdmin(bookingId);
        return success
                ? ResponseEntity.ok("Бронювання позначено як виконане.")
                : ResponseEntity.badRequest().body("Неможливо виконати. Бронювання не в статусі CONFIRMED або не знайдено.");
    }

}
