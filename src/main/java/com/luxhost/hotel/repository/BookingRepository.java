package com.luxhost.hotel.repository;

import com.luxhost.hotel.model.Booking;
import com.luxhost.hotel.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);
    List<Booking> findByRoomId(Long roomId);
    List<Booking> findByStatus(BookingStatus status);
    List<Booking> findByRoomIdAndStatusIn(Long roomId, List<BookingStatus> statuses);
}
