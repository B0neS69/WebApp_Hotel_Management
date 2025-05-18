package com.luxhost.hotel.controller;
import com.luxhost.hotel.repository.RoomRepository;
import org.springframework.web.bind.annotation.*;
import com.luxhost.hotel.service.RoomService;
import com.luxhost.hotel.model.Room;
import java.util.List;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    private final RoomService roomService;
    private final RoomRepository roomRepository;
    public RoomController(RoomService roomService, RoomRepository roomRepository) {
        this.roomService = roomService;
        this.roomRepository = roomRepository;
    }

    @GetMapping
    public List<Room> getAllRooms() {
        return roomService.getAllRooms();
    }
    @GetMapping("/{id}")
    public Room getRoomById(@PathVariable Long id) {
        return roomService.getRoomById(id);
    }
    @GetMapping("/top3-expensive")
    public List<Room> getTop3ExpensiveRooms() {
        return roomRepository.findTop3ByOrderByPriceDesc();
    }

}
