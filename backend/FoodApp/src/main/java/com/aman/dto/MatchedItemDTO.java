package com.aman.dto;

public class MatchedItemDTO {
    private String fid;
    private String fname;
    private Double qty;
    private Double unitPrice;
    private Double totalPrice;

    public MatchedItemDTO() {}

    public MatchedItemDTO(String fid, String fname, Double qty, Double unitPrice, Double totalPrice) {
        this.fid = fid;
        this.fname = fname;
        this.qty = qty;
        this.unitPrice = unitPrice;
        this.totalPrice = totalPrice;
    }

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
}
