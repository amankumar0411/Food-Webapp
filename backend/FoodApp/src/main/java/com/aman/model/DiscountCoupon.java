package com.aman.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "discount_coupons")
public class DiscountCoupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Coupon code cannot be blank")
    @Column(unique = true, nullable = false, length = 50)
    private String code;

    @NotBlank(message = "Discount type must be PERCENTAGE or FIXED")
    @Column(nullable = false, length = 20)
    private String discountType = "PERCENTAGE"; // "PERCENTAGE" or "FIXED"

    @NotNull(message = "Discount value is required")
    @Column(nullable = false)
    private Double discountValue; // e.g. 20.0 for 20% or 100.0 for ₹100

    private Double minOrderAmount = 0.0; // Minimum order subtotal needed

    private Double maxDiscountAmount; // Cap for percentage discount (null if unlimited)

    private LocalDateTime startDate;

    private LocalDateTime expiryDate;

    private Integer usageLimit; // Total allowed usages across all patrons (null if unlimited)

    private Integer perUserUsageLimit = 1; // Usages allowed per customer

    @Column(nullable = false)
    private Integer timesUsed = 0; // Usage count tracker

    @Column(nullable = false)
    private Boolean active = true;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    public DiscountCoupon() {}

    public DiscountCoupon(String code, String discountType, Double discountValue, Double minOrderAmount, Double maxDiscountAmount, LocalDateTime expiryDate) {
        this.code = code != null ? code.trim().toUpperCase() : null;
        this.discountType = discountType;
        this.discountValue = discountValue;
        this.minOrderAmount = minOrderAmount;
        this.maxDiscountAmount = maxDiscountAmount;
        this.expiryDate = expiryDate;
        this.active = true;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.code != null) this.code = this.code.trim().toUpperCase();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
        if (this.code != null) this.code = this.code.trim().toUpperCase();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code != null ? code.trim().toUpperCase() : null; }

    public String getDiscountType() { return discountType; }
    public void setDiscountType(String discountType) { this.discountType = discountType; }

    public Double getDiscountValue() { return discountValue; }
    public void setDiscountValue(Double discountValue) { this.discountValue = discountValue; }

    public Double getMinOrderAmount() { return minOrderAmount; }
    public void setMinOrderAmount(Double minOrderAmount) { this.minOrderAmount = minOrderAmount; }

    public Double getMaxDiscountAmount() { return maxDiscountAmount; }
    public void setMaxDiscountAmount(Double maxDiscountAmount) { this.maxDiscountAmount = maxDiscountAmount; }

    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }

    public LocalDateTime getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDateTime expiryDate) { this.expiryDate = expiryDate; }

    public Integer getUsageLimit() { return usageLimit; }
    public void setUsageLimit(Integer usageLimit) { this.usageLimit = usageLimit; }

    public Integer getPerUserUsageLimit() { return perUserUsageLimit; }
    public void setPerUserUsageLimit(Integer perUserUsageLimit) { this.perUserUsageLimit = perUserUsageLimit; }

    public Integer getTimesUsed() { return timesUsed; }
    public void setTimesUsed(Integer timesUsed) { this.timesUsed = timesUsed; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
