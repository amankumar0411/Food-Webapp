package com.aman.service;

import com.aman.model.DiscountCoupon;
import com.aman.repository.DiscountCouponRepository;
import com.aman.repository.OrderDtlsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class DiscountCouponService {

    @Autowired
    private DiscountCouponRepository couponRepository;

    @Autowired
    private OrderDtlsRepository orderDtlsRepository;

    /**
     * Customer/Checkout coupon validation logic.
     * Validates code presence, active status, date range, min order amount, and usage limits.
     * Computes server-side discount amount and final payable amount.
     */
    public Map<String, Object> validateCoupon(String rawCode, Double orderAmount, String uname) {
        Map<String, Object> result = new HashMap<>();

        if (rawCode == null || rawCode.trim().isEmpty()) {
            result.put("valid", false);
            result.put("error", "Coupon code cannot be empty");
            return result;
        }

        String code = rawCode.trim().toUpperCase();
        Optional<DiscountCoupon> optionalCoupon = couponRepository.findByCodeIgnoreCase(code);

        if (optionalCoupon.isEmpty()) {
            result.put("valid", false);
            result.put("error", "Invalid discount code '" + code + "'");
            return result;
        }

        DiscountCoupon coupon = optionalCoupon.get();

        if (coupon.getActive() == null || !coupon.getActive()) {
            result.put("valid", false);
            result.put("error", "Coupon code '" + code + "' is currently inactive");
            return result;
        }

        LocalDateTime now = LocalDateTime.now();

        if (coupon.getStartDate() != null && now.isBefore(coupon.getStartDate())) {
            result.put("valid", false);
            result.put("error", "Coupon code '" + code + "' is not yet valid");
            return result;
        }

        if (coupon.getExpiryDate() != null && now.isAfter(coupon.getExpiryDate())) {
            result.put("valid", false);
            result.put("error", "Coupon code '" + code + "' has expired");
            return result;
        }

        double subtotal = (orderAmount != null && orderAmount > 0) ? orderAmount : 0.0;

        if (coupon.getMinOrderAmount() != null && subtotal < coupon.getMinOrderAmount()) {
            result.put("valid", false);
            result.put("error", "Minimum order amount of \u20B9" + Math.round(coupon.getMinOrderAmount()) + " required to apply this coupon");
            return result;
        }

        if (coupon.getUsageLimit() != null && coupon.getTimesUsed() >= coupon.getUsageLimit()) {
            result.put("valid", false);
            result.put("error", "Usage limit for coupon '" + code + "' has been reached");
            return result;
        }

        if (uname != null && !uname.trim().isEmpty() && coupon.getPerUserUsageLimit() != null) {
            long userUses = orderDtlsRepository.countByUnameAndCouponCodeIgnoreCase(uname.trim(), code);
            if (userUses >= coupon.getPerUserUsageLimit()) {
                result.put("valid", false);
                result.put("error", "You have already used coupon '" + code + "' the maximum allowed times (" + coupon.getPerUserUsageLimit() + ")");
                return result;
            }
        }

        // Calculate discount
        double discountAmount = 0.0;
        if ("PERCENTAGE".equalsIgnoreCase(coupon.getDiscountType())) {
            discountAmount = (subtotal * coupon.getDiscountValue()) / 100.0;
            if (coupon.getMaxDiscountAmount() != null && discountAmount > coupon.getMaxDiscountAmount()) {
                discountAmount = coupon.getMaxDiscountAmount();
            }
        } else {
            // FIXED
            discountAmount = Math.min(coupon.getDiscountValue(), subtotal);
        }

        // Round to 2 decimals
        discountAmount = Math.round(discountAmount * 100.0) / 100.0;
        double finalAmount = Math.max(0.0, Math.round((subtotal - discountAmount) * 100.0) / 100.0);

        result.put("valid", true);
        result.put("code", coupon.getCode());
        result.put("discountType", coupon.getDiscountType());
        result.put("discountValue", coupon.getDiscountValue());
        result.put("discountAmount", discountAmount);
        result.put("finalAmount", finalAmount);
        result.put("message", "Coupon " + coupon.getCode() + " applied! Saved \u20B9" + Math.round(discountAmount));
        return result;
    }

    @Transactional
    public void recordCouponUsage(String rawCode) {
        if (rawCode == null || rawCode.trim().isEmpty()) return;
        couponRepository.findByCodeIgnoreCase(rawCode.trim().toUpperCase()).ifPresent(coupon -> {
            coupon.setTimesUsed((coupon.getTimesUsed() != null ? coupon.getTimesUsed() : 0) + 1);
            couponRepository.save(coupon);
        });
    }

    public List<DiscountCoupon> getAllCoupons() {
        return couponRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<DiscountCoupon> getActivePublicCoupons() {
        LocalDateTime now = LocalDateTime.now();
        return couponRepository.findByActiveTrue().stream()
                .filter(c -> c.getExpiryDate() == null || c.getExpiryDate().isAfter(now))
                .toList();
    }

    public Optional<DiscountCoupon> getById(Long id) {
        return couponRepository.findById(id);
    }

    @Transactional
    public DiscountCoupon createCoupon(DiscountCoupon coupon) {
        if (coupon.getCode() != null) {
            coupon.setCode(coupon.getCode().trim().toUpperCase());
        }
        if (couponRepository.existsByCodeIgnoreCase(coupon.getCode())) {
            throw new IllegalArgumentException("Coupon code '" + coupon.getCode() + "' already exists");
        }
        coupon.setCreatedAt(LocalDateTime.now());
        coupon.setUpdatedAt(LocalDateTime.now());
        return couponRepository.save(coupon);
    }

    @Transactional
    public DiscountCoupon updateCoupon(Long id, DiscountCoupon updated) {
        DiscountCoupon existing = couponRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Coupon not found with id: " + id));

        if (updated.getCode() != null) {
            String newCode = updated.getCode().trim().toUpperCase();
            if (!newCode.equalsIgnoreCase(existing.getCode()) && couponRepository.existsByCodeIgnoreCase(newCode)) {
                throw new IllegalArgumentException("Coupon code '" + newCode + "' already exists");
            }
            existing.setCode(newCode);
        }

        if (updated.getDiscountType() != null) existing.setDiscountType(updated.getDiscountType());
        if (updated.getDiscountValue() != null) existing.setDiscountValue(updated.getDiscountValue());
        if (updated.getMinOrderAmount() != null) existing.setMinOrderAmount(updated.getMinOrderAmount());
        existing.setMaxDiscountAmount(updated.getMaxDiscountAmount());
        if (updated.getStartDate() != null) existing.setStartDate(updated.getStartDate());
        if (updated.getExpiryDate() != null) existing.setExpiryDate(updated.getExpiryDate());
        existing.setUsageLimit(updated.getUsageLimit());
        if (updated.getPerUserUsageLimit() != null) existing.setPerUserUsageLimit(updated.getPerUserUsageLimit());
        if (updated.getActive() != null) existing.setActive(updated.getActive());
        existing.setUpdatedAt(LocalDateTime.now());

        return couponRepository.save(existing);
    }

    @Transactional
    public DiscountCoupon toggleStatus(Long id) {
        DiscountCoupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Coupon not found with id: " + id));
        coupon.setActive(coupon.getActive() == null || !coupon.getActive());
        coupon.setUpdatedAt(LocalDateTime.now());
        return couponRepository.save(coupon);
    }

    @Transactional
    public void deleteCoupon(Long id) {
        couponRepository.deleteById(id);
    }
}
