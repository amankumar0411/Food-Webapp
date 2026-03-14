package com.aman.controller;

import com.aman.model.Order;
import com.aman.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "https://foodapp-tw.vercel.app/"
})
public class OrderController {

    @Autowired
    private OrderService oservice;

    @PostMapping("/add")
    public Order addOrder(@RequestBody Order order) {
        order.setOdt(LocalDateTime.now()); // Set current time
        oservice.addData(order);
        return order;
    }

    @GetMapping("/user/details/{uname}")
    public List<Map<String, Object>> getDetails(@PathVariable String uname) {
        return oservice.getBill(uname);
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