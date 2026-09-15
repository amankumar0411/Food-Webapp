package com.aman.controller;

import com.aman.model.OrderDtls;
import com.aman.service.OrderDtlsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/order-dtls")
public class OrderDtlsController {

    @Autowired
    private OrderDtlsService service;

    @Autowired
    private com.aman.service.DiscountCouponService couponService;

    /**
     * Called from Billing.js after payment confirmation.
     * Receives a list of OrderDtls items (one per cart line), validates coupons and amounts server-side, saves them all.
     */
    @PostMapping("/save")
    public List<OrderDtls> saveOrderDetails(@RequestBody List<OrderDtls> items) {
        if (items == null || items.isEmpty()) {
            return items;
        }

        LocalDateTime now = LocalDateTime.now();
        String customerUname = items.get(0).getUname();

        // 1. Calculate true subtotal from items
        double subtotal = items.stream().mapToDouble(item -> {
            double price = item.getUnitPrice() != null ? item.getUnitPrice() : 0.0;
            double qty = item.getQty() != null ? item.getQty() : 1.0;
            item.setTotalPrice(price * qty);
            return price * qty;
        }).sum();

        // 2. Validate coupon on backend if provided
        String rawCoupon = items.get(0).getCouponCode();
        double serverDiscount = 0.0;
        String validatedCode = null;

        if (rawCoupon != null && !rawCoupon.trim().isEmpty()) {
            Map<String, Object> validation = couponService.validateCoupon(rawCoupon, subtotal, customerUname);
            if (Boolean.TRUE.equals(validation.get("valid"))) {
                serverDiscount = ((Number) validation.get("discountAmount")).doubleValue();
                validatedCode = (String) validation.get("code");
                couponService.recordCouponUsage(validatedCode);
            }
        }

        double deliveryFee = items.get(0).getDeliveryFee() != null ? items.get(0).getDeliveryFee() : 0.0;
        double platformFee = items.get(0).getPlatformFee() != null ? items.get(0).getPlatformFee() : 0.0;
        double taxesAndFees = deliveryFee + platformFee + 58.0; // standard packaging & taxes
        double secureGrandTotal = Math.max(0.0, Math.round((subtotal + 58.0 - serverDiscount) * 100.0) / 100.0);

        final double finalDiscount = serverDiscount;
        final String finalCode = validatedCode;

        items.forEach(item -> {
            item.setPaymentDate(now);
            item.setDiscountAmount(finalDiscount);
            item.setCouponCode(finalCode);
            item.setGrandTotal(secureGrandTotal);
            if (item.getPaymentStatus() == null || item.getPaymentStatus().isBlank()) {
                item.setPaymentStatus("PAID");
            }
            if (item.getOrderStatus() == null || item.getOrderStatus().isBlank()) {
                item.setOrderStatus("PAID");
            }
        });
        service.saveAll(items);
        return items;
    }

    /** Customer: view their own paid order history */
    @GetMapping("/user/{uname}")
    public List<Map<String, Object>> getByUser(@PathVariable String uname) {
        return service.getByUser(uname);
    }

    /** Customer: get aggregated lifetime order stats, points, and favorite cuisine */
    @GetMapping("/stats/{uname}")
    public Map<String, Object> getUserStats(@PathVariable String uname) {
        return service.getUserStats(uname);
    }

    /** Admin / Merchant: view ALL paid orders */
    @GetMapping("/all")
    public List<Map<String, Object>> getAll() {
        return service.getAll();
    }

    /** Admin / Merchant: update order lifecycle status */
    @PutMapping("/status/{id}")
    public OrderDtls updateStatus(@PathVariable Integer id, @RequestBody Map<String, String> payload) {
        String status = payload.get("orderStatus");
        return service.updateOrderStatus(id, status);
    }

    // ── DELIVERY PARTNER (DRIVER) ENDPOINTS ───────────────────────────────────
    @GetMapping("/driver/available")
    public List<OrderDtls> getAvailableDriverOrders() {
        return service.getAvailableDriverOrders();
    }

    @PutMapping("/driver/accept/{id}")
    public OrderDtls acceptOrderForDelivery(@PathVariable Integer id, @RequestBody Map<String, String> payload) {
        String driverUname = payload.get("driverUname");
        return service.acceptOrderForDelivery(id, driverUname);
    }

    @PutMapping("/driver/deliver/{id}")
    public OrderDtls deliverOrder(@PathVariable Integer id) {
        return service.deliverOrder(id);
    }

    @GetMapping("/driver/earnings/{driverUname}")
    public Map<String, Object> getDriverEarnings(@PathVariable String driverUname) {
        return service.getDriverEarnings(driverUname);
    }
}
