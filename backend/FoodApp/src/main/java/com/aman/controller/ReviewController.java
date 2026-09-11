package com.aman.controller;

import com.aman.model.Review;
import com.aman.repository.ReviewRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/reviews")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @PostMapping("/add")
    public ResponseEntity<Review> addReview(@Valid @RequestBody Review review) {
        Review saved = reviewRepository.save(review);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping("/food/{fid}")
    public ResponseEntity<Map<String, Object>> getFoodReviews(@PathVariable String fid) {
        List<Review> reviews = reviewRepository.findByFidOrderByCreatedAtDesc(fid);
        double avgRating = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);

        Map<String, Object> response = new HashMap<>();
        response.put("reviews", reviews);
        response.put("averageRating", Math.round(avgRating * 10.0) / 10.0);
        response.put("totalReviews", reviews.size());
        return ResponseEntity.ok(response);
    }
}
