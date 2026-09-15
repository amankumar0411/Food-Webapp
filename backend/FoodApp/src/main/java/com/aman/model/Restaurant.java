package com.aman.model;

import jakarta.persistence.*;

@Entity
@Table(name = "restaurants")
public class Restaurant {

    @Id
    @Column(length = 50)
    private String id; // e.g. "toscano", "meghana", "truffles", "chocolateroom"

    @Column(nullable = false, length = 100)
    private String name;

    private Double rating = 4.5;

    @Column(length = 50)
    private String deliveryTime = "25-30 mins";

    @Column(length = 150)
    private String cuisines;

    @Column(length = 100)
    private String discountBadge;

    @Column(length = 500)
    private String imageUrl;

    @Column(length = 100)
    private String location = "Indiranagar, Bengaluru";

    public Restaurant() {}

    public Restaurant(String id, String name, Double rating, String deliveryTime, String cuisines, String discountBadge, String imageUrl, String location) {
        this.id = id;
        this.name = name;
        this.rating = rating;
        this.deliveryTime = deliveryTime;
        this.cuisines = cuisines;
        this.discountBadge = discountBadge;
        this.imageUrl = imageUrl;
        this.location = location;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public String getDeliveryTime() { return deliveryTime; }
    public void setDeliveryTime(String deliveryTime) { this.deliveryTime = deliveryTime; }

    public String getCuisines() { return cuisines; }
    public void setCuisines(String cuisines) { this.cuisines = cuisines; }

    public String getDiscountBadge() { return discountBadge; }
    public void setDiscountBadge(String discountBadge) { this.discountBadge = discountBadge; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
}
