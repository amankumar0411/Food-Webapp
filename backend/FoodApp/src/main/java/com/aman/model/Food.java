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
	@Column(length = 25)
	@NotBlank(message="FNAME MUST BE GIVEN")
private String fname;
	@DecimalMax(value="5000.0",message="PRICE NOT MORE THAN 5000 ACCEPTED")
private Double price;
    public Food() {
        super();
    }
public Food(String fid, String fname, Double price) {
	super();
	this.fid = fid;
	this.fname = fname;
	this.price = price;
}
public String getFid() {
	return fid;
}
public void setFid(String fid) {
	this.fid = fid;
}
public String getFname() {
	return fname;
}
public void setFname(String fname) {
	this.fname = fname;
}
public Double getPrice() {
	return price;
}
public void setPrice(Double price) {
	this.price = price;
}
@Override
public String toString() {
	return "Food [fid=" + fid + ", fname=" + fname + ", price=" + price + "]";
}

}