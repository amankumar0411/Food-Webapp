package com.aman.controller;

import com.aman.model.Food;
import com.aman.model.Order;
import com.aman.repository.FoodRepository;
import com.aman.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderService oservice;

    @Autowired
    private FoodRepository frepo;

    @PostMapping("/add")
    public Order addOrder(@RequestBody Order order) {
        // Enrich order with food name and total price
        Food food = frepo.findById(order.getFid()).orElse(null);
        if (food != null) {
            order.setFname(food.getFname());
            double total = food.getPrice() * (order.getQty() != null ? order.getQty() : 1);
            order.setTotalPrice(total);
        }
        order.setOdt(LocalDateTime.now());
        oservice.addData(order);
        return order;
    }

    @GetMapping("/user/details/{uname}")
    public List<Map<String, Object>> getDetails(@PathVariable String uname) {
        return oservice.getBill(uname);
    }

    // Admin: Get ALL orders across all users
    @GetMapping("/all")
    public List<Order> getAllOrders() {
        return oservice.getAllOrders();
    }

    @PutMapping("/update/{oid}/{qty}")
    public Order updateOrderQty(@PathVariable Integer oid, @PathVariable Double qty) {
        return oservice.updateData(oid, qty);
    }

    @DeleteMapping("/delete/{oid}")
    public void deleteOrder(@PathVariable Integer oid) {
        oservice.deleteData(oid);
    }
}