package com.luxhost.hotel.controller;

import com.luxhost.hotel.dto.BookingWithRoomNumberDTO;
import com.luxhost.hotel.model.*;
import com.luxhost.hotel.repository.BookingRepository;
import com.luxhost.hotel.service.BookingService;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
public class BookingControllerTest {

    @Mock
    private BookingService bookingService;

    @Mock
    private BookingRepository bookingRepository;

    @InjectMocks
    private BookingController bookingController;

    @Test
    void testCreateBooking() {
        Booking booking = new Booking();
        when(bookingService.saveBooking(any())).thenReturn(booking);

        Booking result = bookingController.createBooking(booking);

        assertThat(result).isNotNull();
        assertThat(result.getStatus()).isEqualTo(BookingStatus.PENDING);
        verify(bookingService).saveBooking(booking);
    }

    @Test
    void testGetBookingsForUser() {
        Booking booking = new Booking();
        booking.setId(1L);
        booking.setStartDate(LocalDate.now());
        booking.setEndDate(LocalDate.now().plusDays(1));
        booking.setStatus(BookingStatus.PENDING);
        Room room = new Room(); room.setId(10L); room.setRoomNumber("101");
        booking.setRoom(room);

        when(bookingService.getBookingsForUser(5L)).thenReturn(List.of(booking));

        List<BookingWithRoomNumberDTO> result = bookingController.getBookingsForUser(5L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getRoomNumber()).isEqualTo("101");
    }

    @Test
    void testGetBookedDates() {
        Booking b = new Booking();
        b.setStartDate(LocalDate.now());
        b.setEndDate(LocalDate.now().plusDays(2));
        b.setStatus(BookingStatus.PENDING);

        when(bookingRepository.findByRoomIdAndStatusIn(eq(1L), any())).thenReturn(List.of(b));

        List<Map<String, LocalDate>> result = bookingController.getBookedDates(1L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0)).containsKeys("start", "end");
    }

    @Test
    void testCancelBookingSuccess() {
        when(bookingService.cancelBooking(1L)).thenReturn(true);

        ResponseEntity<String> response = bookingController.cancelBooking(1L);

        assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();
        assertThat(response.getBody()).contains("Бронювання скасовано");
    }

    @Test
    void testConfirmBooking() {
        when(bookingService.confirmBooking(2L)).thenReturn(true);

        ResponseEntity<String> response = bookingController.confirmBooking(2L);

        assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();
        assertThat(response.getBody()).contains("підтверджено");
    }
}
