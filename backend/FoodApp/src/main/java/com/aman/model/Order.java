package com.aman.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "order_table")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer oid;
    private String fid;        // Links to Food table
    private String fname;      // Food name (denormalized for fast queries)
    private String uname;      // Links to Register table
    private Double qty;
    private Double totalPrice; // price * qty at time of order
    private LocalDateTime odt;

    public Order() {}

    // Getters and Setters
    public Integer getOid() { return oid; }
    public void setOid(Integer oid) { this.oid = oid; }

    public String getFid() { return fid; }
    public void setFid(String fid) { this.fid = fid; }

    public String getFname() { return fname; }
    public void setFname(String fname) { this.fname = fname; }

    public String getUname() { return uname; }
    public void setUname(String uname) { this.uname = uname; }

    public Double getQty() { return qty; }
    public void setQty(Double qty) { this.qty = qty; }

    public Double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(Double totalPrice) { this.totalPrice = totalPrice; }

    public LocalDateTime getOdt() { return odt; }
    public void setOdt(LocalDateTime odt) { this.odt = odt; }
}