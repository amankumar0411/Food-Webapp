package com.aman.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "FOOD ID IS REQUIRED")
    private String fid;

    @NotBlank(message = "USERNAME IS REQUIRED")
    private String uname;

    @Min(value = 1, message = "RATING MUST BE AT LEAST 1")
    @Max(value = 5, message = "RATING MUST NOT EXCEED 5")
    private Integer rating;

    @Column(length = 1000)
    private String comment;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Review() {}

    public Review(String fid, String uname, Integer rating, String comment) {
        this.fid = fid;
        this.uname = uname;
        this.rating = rating;
        this.comment = comment;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFid() { return fid; }
    public void setFid(String fid) { this.fid = fid; }

    public String getUname() { return uname; }
    public void setUname(String uname) { this.uname = uname; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
