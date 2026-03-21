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
}