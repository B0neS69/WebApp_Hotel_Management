package com.luxhost.hotel.repository;

import com.luxhost.hotel.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findTop3ByOrderByPriceDesc();

}
