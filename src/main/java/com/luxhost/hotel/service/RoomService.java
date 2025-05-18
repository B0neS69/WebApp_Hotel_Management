package com.luxhost.hotel.service;

import com.luxhost.hotel.model.Room;
import com.luxhost.hotel.model.RoomImage;
import com.luxhost.hotel.repository.RoomImageRepository;
import com.luxhost.hotel.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomService {

    private final RoomRepository roomRepository;
    @Autowired
    private RoomImageRepository roomImageRepository;

    public void addRoomImages(Long roomId, List<String> imageUrls) {
        Room room = roomRepository.findById(roomId).orElseThrow(() -> new RuntimeException("Room not found"));
        for (String url : imageUrls) {
            RoomImage image = new RoomImage(url, room);
            room.getImages().add(image);
        }
        roomRepository.save(room);
    }
    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    public Room addRoom(Room room) {
        return roomRepository.save(room);
    }

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public void deleteRoom(Long id) {
        roomRepository.deleteById(id);
    }
    public Room getRoomById(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));
    }


}
