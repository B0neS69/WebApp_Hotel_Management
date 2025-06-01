package com.luxhost.hotel.controller;

import com.luxhost.hotel.model.Room;
import com.luxhost.hotel.repository.RoomRepository;
import com.luxhost.hotel.service.RoomService;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.extension.ExtendWith;


import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
public class RoomControllerTest {

    @Mock
    private RoomService roomService;

    @Mock
    private RoomRepository roomRepository;

    @InjectMocks
    private RoomController roomController;

    @Test
    void testGetAllRooms() {
        Room room = new Room(); room.setId(1L);
        when(roomService.getAllRooms()).thenReturn(List.of(room));

        List<Room> result = roomController.getAllRooms();

        assertThat(result).hasSize(1);
        verify(roomService, times(1)).getAllRooms();
    }

    @Test
    void testGetRoomById() {
        Room room = new Room(); room.setId(1L);
        when(roomService.getRoomById(1L)).thenReturn(room);

        Room result = roomController.getRoomById(1L);

        assertThat(result.getId()).isEqualTo(1L);
        verify(roomService).getRoomById(1L);
    }

    @Test
    void testGetTop3ExpensiveRooms() {
        Room r1 = new Room(); r1.setId(1L);
        when(roomRepository.findTop3ByOrderByPriceDesc()).thenReturn(List.of(r1));

        List<Room> result = roomController.getTop3ExpensiveRooms();

        assertThat(result).hasSize(1);
        verify(roomRepository).findTop3ByOrderByPriceDesc();
    }
}
