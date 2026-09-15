package com.aman.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aman.model.Food;
import com.aman.repository.FoodRepository;

@Service
public class FoodService {

    @Autowired
    private FoodRepository frepo;

    // ADD FOOD
    public void addData(Food f) {
        frepo.save(f);
    }

    // FETCH ALL
    public List<Food> getData() {
        return frepo.findAll();
    }

    // SEARCH BY ID
    public Food getFidDetails(String fid) {
        return frepo.findById(fid).orElse(null);
    }

    // UPDATE FOOD
    public Food updateData(String fid, Food fs) {
        // Find the existing food record by ID
        Food f = frepo.findById(fid).orElse(null);
        
        if (f != null) {
            // Update only the specific fields
            f.setFname(fs.getFname());
            f.setPrice(fs.getPrice());
            if (fs.getImageUrl() != null) f.setImageUrl(fs.getImageUrl());
            
            // Save the updated record back to the database
            frepo.save(f);
        }
        return f; // Returns the updated object or null if not found
    }

    // DELETE FOOD
    public void deleteData(String fid) {
        Food f = frepo.findById(fid).orElse(null);
        if (f != null) {
            frepo.delete(f);
        }
    }

    // FETCH BY CATEGORY (Dynamic slug & keyword matching)
    public List<Food> getByCategory(String categoryId) {
        if (categoryId == null || categoryId.trim().isEmpty()) {
            return frepo.findAll();
        }
        String clean = categoryId.trim().toLowerCase();
        String root = clean;
        if (clean.endsWith("s") && clean.length() > 3) {
            root = clean.substring(0, clean.length() - 1);
        }
        final String searchRoot = root;
        List<Food> results = frepo.findByCategoryContainingIgnoreCase(searchRoot);
        if (results.isEmpty()) {
            results = frepo.findAll().stream()
                    .filter(f -> (f.getCategory() != null && f.getCategory().toLowerCase().contains(searchRoot)) ||
                                 (f.getFname() != null && f.getFname().toLowerCase().contains(searchRoot)))
                    .toList();
        }
        return results;
    }

    // FETCH BY RESTAURANT ID
    public List<Food> getByRestaurant(String restaurantId) {
        if (restaurantId == null || restaurantId.trim().isEmpty()) {
            return frepo.findAll();
        }
        return frepo.findByRestaurantId(restaurantId.trim().toLowerCase());
    }
}