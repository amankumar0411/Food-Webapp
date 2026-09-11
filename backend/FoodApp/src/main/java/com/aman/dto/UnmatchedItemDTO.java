package com.aman.dto;

public class UnmatchedItemDTO {
    private String item;
    private Integer quantity;

    public UnmatchedItemDTO() {}

    public UnmatchedItemDTO(String item, Integer quantity) {
        this.item = item;
        this.quantity = quantity;
    }

    public String getItem() { return item; }
    public void setItem(String item) { this.item = item; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}
