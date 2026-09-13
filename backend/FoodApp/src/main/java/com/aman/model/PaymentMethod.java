package com.aman.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_payment_methods")
public class PaymentMethod {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String uname;

    @Column(nullable = false, length = 20)
    private String type; // "CARD", "UPI"

    @Column(nullable = false, length = 50)
    private String provider; // "VISA", "HDFC Millennia", "Google Pay"

    @Column(nullable = false, length = 100)
    private String maskedDetails; // "•••• 4242 • Exp 08/28", "patron@okhdfcbank"

    private boolean isDefault = false;

    private LocalDateTime createdAt = LocalDateTime.now();

    public PaymentMethod() {}

    public PaymentMethod(String uname, String type, String provider, String maskedDetails, boolean isDefault) {
        this.uname = uname;
        this.type = type;
        this.provider = provider;
        this.maskedDetails = maskedDetails;
        this.isDefault = isDefault;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUname() {
        return uname;
    }

    public void setUname(String uname) {
        this.uname = uname;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public String getMaskedDetails() {
        return maskedDetails;
    }

    public void setMaskedDetails(String maskedDetails) {
        this.maskedDetails = maskedDetails;
    }

    public boolean isDefault() {
        return isDefault;
    }

    public void setDefault(boolean aDefault) {
        isDefault = aDefault;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
