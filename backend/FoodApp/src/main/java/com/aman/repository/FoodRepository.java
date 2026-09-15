package com.aman.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aman.model.Food;
import java.util.List;

@Repository
public interface FoodRepository extends JpaRepository<Food, String> {

    List<Food> findByCategoryIgnoreCase(String category);

    List<Food> findByRestaurantId(String restaurantId);

    @Query("SELECT f FROM Food f WHERE LOWER(f.category) LIKE LOWER(CONCAT('%', :cat, '%'))")
    List<Food> findByCategoryContainingIgnoreCase(@Param("cat") String cat);
}