package com.luxhost.hotel.controller;

import com.luxhost.hotel.model.Review;
import com.luxhost.hotel.repository.ReviewRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewRepository reviewRepository;

    public ReviewController(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    @GetMapping("/room/{roomId}")
    public List<Review> getReviewsByRoom(@PathVariable Long roomId) {
        return reviewRepository.findByRoomId(roomId);
    }

    @PostMapping
    public Review addReview(@RequestBody Review review) {
        return reviewRepository.save(review);
    }

    @GetMapping("/top-rated")
    public List<Review> getTopRatedReviews() {
        return reviewRepository.findByRatingGreaterThanEqual(4);
    }

}
