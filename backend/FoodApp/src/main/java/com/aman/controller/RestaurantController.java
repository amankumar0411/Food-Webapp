package com.aman.controller;

import com.aman.model.Food;
import com.aman.model.Restaurant;
import com.aman.repository.FoodRepository;
import com.aman.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private FoodRepository foodRepository;

    @GetMapping
    public ResponseEntity<List<Restaurant>> getAllRestaurants() {
        return ResponseEntity.ok(restaurantRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRestaurantById(@PathVariable String id) {
        Optional<Restaurant> r = restaurantRepository.findById(id.toLowerCase());
        if (r.isPresent()) {
            return ResponseEntity.ok(r.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Restaurant not found with id: " + id));
    }

    @GetMapping("/{id}/menu")
    public ResponseEntity<List<Food>> getRestaurantMenu(@PathVariable String id) {
        List<Food> menu = foodRepository.findByRestaurantId(id.toLowerCase());
        return ResponseEntity.ok(menu);
    }
}
