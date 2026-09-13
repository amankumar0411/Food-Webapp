package com.aman.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.NotBlank;

@Entity
public class Food {
    @Id
    @Column(length = 10)
    private String fid;

    @Column(length = 100)
    @NotBlank(message = "FNAME MUST BE GIVEN")
    private String fname;

    @DecimalMax(value = "5000.0", message = "PRICE NOT MORE THAN 5000 ACCEPTED")
    private Double price;

    @Column(length = 500)
    private String imageUrl; // Custom image URL set by admin

    @Column(length = 50)
    private String category = "Main Course"; // Default category

    private Boolean isVeg = true; // Default to true

    public Food() { super(); }

    public Food(String fid, String fname, Double price, String imageUrl) {
        super();
        this.fid = fid;
        this.fname = fname;
        this.price = price;
        this.imageUrl = imageUrl;
    }

    public Food(String fid, String fname, Double price, String imageUrl, String category, Boolean isVeg) {
        super();
        this.fid = fid;
        this.fname = fname;
        this.price = price;
        this.imageUrl = imageUrl;
        this.category = category != null ? category : "Main Course";
        this.isVeg = isVeg != null ? isVeg : true;
    }

    public String getFid() { return fid; }
    public void setFid(String fid) { this.fid = fid; }

    public String getFname() { return fname; }
    public void setFname(String fname) { this.fname = fname; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Boolean getIsVeg() { return isVeg; }
    public void setIsVeg(Boolean isVeg) { this.isVeg = isVeg; }

    @Override
    public String toString() {
        return "Food [fid=" + fid + ", fname=" + fname + ", price=" + price + ", imageUrl=" + imageUrl + ", category=" + category + ", isVeg=" + isVeg + "]";
    }
}