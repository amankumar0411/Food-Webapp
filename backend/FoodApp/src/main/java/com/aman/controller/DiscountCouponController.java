package com.aman.controller;

import com.aman.model.DiscountCoupon;
import com.aman.service.DiscountCouponService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/coupons")
public class DiscountCouponController {

    @Autowired
    private DiscountCouponService couponService;

    // ── PUBLIC / CUSTOMER ENDPOINTS ──────────────────────────────────────────

    /**
     * Customer coupon validation.
     * Expects: { "code": "WELCOME50", "orderAmount": 500.0, "uname": "aman" }
     */
    @PostMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateCoupon(@RequestBody Map<String, Object> payload) {
        String code = (String) payload.get("code");
        Double orderAmount = 0.0;
        if (payload.get("orderAmount") instanceof Number) {
            orderAmount = ((Number) payload.get("orderAmount")).doubleValue();
        }
        String uname = (String) payload.get("uname");

        Map<String, Object> result = couponService.validateCoupon(code, orderAmount, uname);
        if (Boolean.TRUE.equals(result.get("valid"))) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
        }
    }

    /**
     * Fetch active coupons available for public display/banners.
     */
    @GetMapping("/active")
    public ResponseEntity<List<DiscountCoupon>> getActiveCoupons() {
        return ResponseEntity.ok(couponService.getActivePublicCoupons());
    }

    // ── ADMIN ENDPOINTS ──────────────────────────────────────────────────────

    @GetMapping("/admin")
    public ResponseEntity<List<DiscountCoupon>> getAllCoupons() {
        return ResponseEntity.ok(couponService.getAllCoupons());
    }

    @GetMapping("/admin/{id}")
    public ResponseEntity<?> getCouponById(@PathVariable Long id) {
        return couponService.getById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Coupon not found")));
    }

    @PostMapping("/admin")
    public ResponseEntity<?> createCoupon(@Valid @RequestBody DiscountCoupon coupon) {
        try {
            DiscountCoupon created = couponService.createCoupon(coupon);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/admin/{id}")
    public ResponseEntity<?> updateCoupon(@PathVariable Long id, @RequestBody DiscountCoupon coupon) {
        try {
            DiscountCoupon updated = couponService.updateCoupon(id, coupon);
            return ResponseEntity.ok(updated);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/admin/{id}/toggle")
    public ResponseEntity<?> toggleCouponStatus(@PathVariable Long id) {
        try {
            DiscountCoupon updated = couponService.toggleStatus(id);
            return ResponseEntity.ok(updated);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<?> deleteCoupon(@PathVariable Long id) {
        try {
            couponService.deleteCoupon(id);
            return ResponseEntity.ok(Map.of("message", "Coupon deleted successfully", "id", id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }
}
