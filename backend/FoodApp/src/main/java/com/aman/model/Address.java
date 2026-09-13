package com.aman.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_addresses")
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String uname;

    @Column(nullable = false, length = 100)
    private String label; // "Home (Penthouse)", "Studio / Lab", etc.

    @Column(nullable = false, length = 500)
    private String fullAddress;

    private boolean isDefault = false;

    @Column(length = 100)
    private String tagInfo; // "Primary Sanctuary • 15m express", etc.

    private LocalDateTime createdAt = LocalDateTime.now();

    public Address() {}

    public Address(String uname, String label, String fullAddress, boolean isDefault, String tagInfo) {
        this.uname = uname;
        this.label = label;
        this.fullAddress = fullAddress;
        this.isDefault = isDefault;
        this.tagInfo = tagInfo;
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

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getFullAddress() {
        return fullAddress;
    }

    public void setFullAddress(String fullAddress) {
        this.fullAddress = fullAddress;
    }

    public boolean isDefault() {
        return isDefault;
    }

    public void setDefault(boolean aDefault) {
        isDefault = aDefault;
    }

    public String getTagInfo() {
        return tagInfo;
    }

    public void setTagInfo(String tagInfo) {
        this.tagInfo = tagInfo;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
