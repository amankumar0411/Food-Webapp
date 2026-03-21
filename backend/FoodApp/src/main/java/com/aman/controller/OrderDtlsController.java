package com.aman.controller;

import com.aman.model.OrderDtls;
import com.aman.service.OrderDtlsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/order-dtls")
public class OrderDtlsController {

    @Autowired
    private OrderDtlsService service;

    /**
     * Called from Billing.js after payment confirmation.
     * Receives a list of OrderDtls items (one per cart line), saves them all.
     */
    @PostMapping("/save")
    public List<OrderDtls> saveOrderDetails(@RequestBody List<OrderDtls> items) {
        LocalDateTime now = LocalDateTime.now();
        items.forEach(item -> {
            item.setPaymentDate(now);
            item.setPaymentStatus("PAID");
        });
        service.saveAll(items);
        return items;
    }

    /** Customer: view their own paid order history */
    @GetMapping("/user/{uname}")
    public List<OrderDtls> getByUser(@PathVariable String uname) {
        return service.getByUser(uname);
    }

    /** Admin: view ALL paid orders */
    @GetMapping("/all")
    public List<OrderDtls> getAll() {
        return service.getAll();
    }
}
