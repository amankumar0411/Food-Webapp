package com.aman.controller;

import com.aman.model.PaymentMethod;
import com.aman.service.PaymentMethodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payment-methods")
public class PaymentMethodController {

    @Autowired
    private PaymentMethodService paymentMethodService;

    @GetMapping("/{uname}")
    public List<PaymentMethod> getPaymentMethods(@PathVariable String uname) {
        return paymentMethodService.getPaymentMethods(uname);
    }

    @PostMapping
    public PaymentMethod addPaymentMethod(@RequestBody PaymentMethod paymentMethod) {
        return paymentMethodService.addPaymentMethod(paymentMethod);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePaymentMethod(@PathVariable Long id) {
        boolean deleted = paymentMethodService.deletePaymentMethod(id);
        if (deleted) {
            return ResponseEntity.ok(Map.of("message", "Payment method deleted"));
        }
        return ResponseEntity.notFound().build();
    }
}
