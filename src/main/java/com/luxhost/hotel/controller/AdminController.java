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
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.io.ByteArrayOutputStream;
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

    @PostMapping("/bookings/{bookingId}/complete")
    public String completeBooking(@PathVariable Long bookingId) {
        boolean result = bookingService.completeBookingByAdmin(bookingId);
        return result ? "Booking marked as completed." : "Unable to complete booking.";
    }

    @GetMapping("/statistics/export")
    public ResponseEntity<byte[]> exportStatisticsToExcel() throws IOException {
        Map<Long, Long> activeBookings = statisticsFacade.getActiveBookingsPerRoom();
        List<RoomBookingRevenueStatistics.RoomRevenueInfo> revenueStats = statisticsFacade.getRoomRevenueStats();

        Workbook workbook = new XSSFWorkbook();

        // Sheet 1: Active Bookings
        Sheet activeBookingsSheet = workbook.createSheet("Active Bookings");
        Row headerRow1 = activeBookingsSheet.createRow(0);
        headerRow1.createCell(0).setCellValue("Room ID");
        headerRow1.createCell(1).setCellValue("Active Bookings");

        int rowIdx1 = 1;
        for (Map.Entry<Long, Long> entry : activeBookings.entrySet()) {
            Row row = activeBookingsSheet.createRow(rowIdx1++);
            row.createCell(0).setCellValue(entry.getKey());
            row.createCell(1).setCellValue(entry.getValue());
        }

        // Sheet 2: Room Revenue
        Sheet revenueSheet = workbook.createSheet("Room Revenue");
        Row headerRow2 = revenueSheet.createRow(0);
        headerRow2.createCell(0).setCellValue("Room ID");
        headerRow2.createCell(1).setCellValue("Room Type");
        headerRow2.createCell(2).setCellValue("Bookings Count");
        headerRow2.createCell(3).setCellValue("Total Revenue");

        int rowIdx2 = 1;
        for (RoomBookingRevenueStatistics.RoomRevenueInfo info : revenueStats) {
            Row row = revenueSheet.createRow(rowIdx2++);
            row.createCell(0).setCellValue(info.getRoomId());
            row.createCell(1).setCellValue(info.getRoomType());
            row.createCell(2).setCellValue(info.getBookingsCount());
            row.createCell(3).setCellValue(info.getTotalRevenue());
        }

        // Write to byte array
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        workbook.write(out);
        workbook.close();

        byte[] fileContent = out.toByteArray();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", "statistics.xlsx");

        return ResponseEntity.ok()
                .headers(headers)
                .body(fileContent);
    }
}
