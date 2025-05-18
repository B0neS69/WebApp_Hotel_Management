package com.luxhost.hotel.controller;

import com.luxhost.hotel.dto.RegisterRequest;
import com.luxhost.hotel.facade.StatisticsFacade;
import com.luxhost.hotel.model.BookingStatus;
import com.luxhost.hotel.model.Room;
import com.luxhost.hotel.service.RoomService;
import com.luxhost.hotel.service.StatisticsService;
import com.luxhost.hotel.service.UserService;
import com.luxhost.hotel.statistics.RoomBookingRevenueStatistics;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.luxhost.hotel.service.StatisticsService.RoomBookingStats;


import java.util.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.io.IOException;
import com.luxhost.hotel.service.BookingService;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;
    private final RoomService roomService;
    private final StatisticsService statisticsService;
    private final BookingService bookingService;
    private final StatisticsFacade statisticsFacade;

    private static final String UPLOAD_DIR = "uploads/";

    public AdminController(UserService userService,
                           RoomService roomService,
                           StatisticsService statisticsService,
                           BookingService bookingService,
                           StatisticsFacade statisticsFacade) {
        this.userService = userService;
        this.roomService = roomService;
        this.statisticsService = statisticsService;
        this.bookingService = bookingService;
        this.statisticsFacade = statisticsFacade;
    }



    @PostMapping("/create-admin")
    public String createAdmin(@RequestBody RegisterRequest request) {
        userService.registerAdmin(request.getUsername(), request.getEmail(), request.getPassword());
        return "Admin created successfully!";
    }

    @PostMapping("/rooms")
    public Room createRoom(@RequestBody Room room) {
        return roomService.addRoom(room);
    }

    @GetMapping("/rooms")
    public List<Room> getAllRooms() {
        return roomService.getAllRooms();
    }

    @DeleteMapping("/rooms/{id}")
    public String deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
        return "Room deleted successfully!";
    }

    @PostMapping("/rooms/{roomId}/add-images")
    public String addImagesToRoom(@PathVariable Long roomId, @RequestBody List<String> imageUrls) {
        roomService.addRoomImages(roomId, imageUrls);
        return "Images added to room!";
    }

    @PostMapping("/upload-images")
    public List<String> uploadImages(@RequestParam("images") List<MultipartFile> files) throws IOException {
        List<String> urls = new ArrayList<>();
        for (MultipartFile file : files) {
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path path = Paths.get(UPLOAD_DIR, filename);
            Files.write(path, file.getBytes());
            urls.add("/uploads/" + filename);
        }
        return urls;
    }

    @GetMapping("/statistics/bookings/confirmed")
    public int getConfirmedBookings() {
        return statisticsFacade.getBookingsCountByStatus(BookingStatus.CONFIRMED);
    }

    @GetMapping("/statistics/bookings/pending")
    public int getPendingBookings() {
        return statisticsFacade.getBookingsCountByStatus(BookingStatus.PENDING);
    }

    @GetMapping("/statistics/bookings/cancelled")
    public int getCancelledBookings() {
        return statisticsFacade.getBookingsCountByStatus(BookingStatus.CANCELED);
    }

    @GetMapping("/statistics/room-bookings")
    public Map<Long, RoomBookingStats> getRoomBookingsStats() {
        return statisticsService.getRoomStatistics();
    }


    @GetMapping("/statistics/room-active-bookings")
    public Map<Long, Long> getActiveBookingsPerRoom() {
        return statisticsFacade.getActiveBookingsPerRoom();
    }

    @GetMapping("/statistics/room-revenue")
    public List<RoomBookingRevenueStatistics.RoomRevenueInfo> getRoomRevenueStats() {
        return statisticsFacade.getRoomRevenueStats();
    }



}
