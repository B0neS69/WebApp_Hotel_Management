// RoomImage.java
package com.luxhost.hotel.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
public class RoomImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    @JsonBackReference
    private Room room;

    public RoomImage() {}

    public RoomImage(String imageUrl, Room room) {
        this.imageUrl = imageUrl;
        this.room = room;
    }

    // Гетери та сетери
    public Long getId() { return id; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public Room getRoom() { return room; }
    public void setRoom(Room room) { this.room = room; }
}
