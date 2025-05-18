package com.luxhost.hotel.repository;

import com.luxhost.hotel.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByRoomId(Long roomId);
    List<Review> findByRatingGreaterThanEqual(int rating);

}
