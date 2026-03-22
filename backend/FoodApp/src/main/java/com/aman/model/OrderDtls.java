package com.aman.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Entity
@Table(name = "order_dtls")
public class OrderDtls {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String uname;          // Customer name
    private String fid;            // Food ID
    private String fname;          // Food name
    private Double qty;            // Quantity ordered
    private Double unitPrice;      // Price per item at time of payment
    private Double totalPrice;     // qty × unitPrice
    private Double grandTotal;     // Sum of all items in the same payment session
    private String paymentDate;   // Stored as ISO string e.g. "2024-03-22T22:10:30"
    private String paymentStatus;  // e.g. "PAID"

    public OrderDtls() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getUname() { return uname; }
    public void setUname(String uname) { this.uname = uname; }

    public String getFid() { return fid; }
    public void setFid(String fid) { this.fid = fid; }

    public String getFname() { return fname; }
    public void setFname(String fname) { this.fname = fname; }

    public Double getQty() { return qty; }
    public void setQty(Double qty) { this.qty = qty; }

    public Double getUnitPrice() { return unitPrice; }
    public void setUnitPrice(Double unitPrice) { this.unitPrice = unitPrice; }

    public Double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(Double totalPrice) { this.totalPrice = totalPrice; }

    public Double getGrandTotal() { return grandTotal; }
    public void setGrandTotal(Double grandTotal) { this.grandTotal = grandTotal; }

    public String getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDateTime paymentDate) {
        this.paymentDate = paymentDate != null
            ? paymentDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss'Z'"))
            : null;
    }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
}
