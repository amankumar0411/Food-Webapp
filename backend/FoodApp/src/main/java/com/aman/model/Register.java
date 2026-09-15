package com.aman.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
public class Register {
	@Id
	@Column(length = 20)
	@NotBlank(message="USERNAME CAN'T BLANK")
private String uname;
	@Column(length = 100, nullable = false)
	@Size(min=6, max=100, message="PASSWORD MUST BE AT LEAST 6 CHARACTERS")
	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	@com.fasterxml.jackson.annotation.JsonAlias({"password", "psw"})
private String pass;
	@Column(length = 10, nullable = false)
private String role = "user";
	@Column(length = 100)
	@NotBlank(message="NAME CAN'T BLANK")
private String nm;
	@Column(length = 100)
	@Email(message = "PROPER FORMAT OF EMAIL GIVEN")
private String email;
	@Column(length = 20)
	@NotBlank(message="PHONE NO MUST BE GIVEN")
private String phno;

    // ── MERCHANT GUILD FIELDS ────────────────────────────────────────────────
    @Column(length = 150)
    private String restaurantName;

    @Column(length = 20)
    private String fssaiNumber;

    @Column(length = 100)
    private String culinaryCraft;

    @Column(length = 255)
    private String facilityAddress;

    @Column(length = 100)
    private String hubSector;

    @Column(length = 30)
    private String mealCapacity; // BOUTIQUE, ATELIER, SCALE

    private Boolean zeroSyntheticCommitment = true;

    private Boolean bioPackagingCommitment = true;

    @Column(length = 30)
    private String merchantStatus = "SUBMITTED"; // SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED

    private java.time.LocalDateTime submittedAt;

    public Register() {
        super();
    }
public Register(String uname, String pass, String nm, String email, String phno) {
	super();
	this.uname = uname;
	this.pass = pass;
	this.nm = nm;
	this.email = email;
	this.phno = phno;
}
public String getUname() {
	return uname;
}
public void setUname(String uname) {
	this.uname = uname;
}
public String getPass() {
	return pass;
}
public void setPass(String pass) {
	this.pass = pass;
}
public String getNm() {
	return nm;
}
public void setNm(String nm) {
	this.nm = nm;
}
public String getEmail() {
	return email;
}
public void setEmail(String email) {
	this.email = email;
}
public String getPhno() {
	return phno;
}
public void setPhno(String phno) {
	this.phno = phno;
}
public String getRole() {
	return role;
}
public void setRole(String role) {
	this.role = role;
}

public String getRestaurantName() {
    return restaurantName;
}
public void setRestaurantName(String restaurantName) {
    this.restaurantName = restaurantName;
}

public String getFssaiNumber() {
    return fssaiNumber;
}
public void setFssaiNumber(String fssaiNumber) {
    this.fssaiNumber = fssaiNumber;
}

public String getCulinaryCraft() {
    return culinaryCraft;
}
public void setCulinaryCraft(String culinaryCraft) {
    this.culinaryCraft = culinaryCraft;
}

public String getFacilityAddress() {
    return facilityAddress;
}
public void setFacilityAddress(String facilityAddress) {
    this.facilityAddress = facilityAddress;
}

public String getHubSector() {
    return hubSector;
}
public void setHubSector(String hubSector) {
    this.hubSector = hubSector;
}

public String getMealCapacity() {
    return mealCapacity;
}
public void setMealCapacity(String mealCapacity) {
    this.mealCapacity = mealCapacity;
}

public Boolean getZeroSyntheticCommitment() {
    return zeroSyntheticCommitment;
}
public void setZeroSyntheticCommitment(Boolean zeroSyntheticCommitment) {
    this.zeroSyntheticCommitment = zeroSyntheticCommitment;
}

public Boolean getBioPackagingCommitment() {
    return bioPackagingCommitment;
}
public void setBioPackagingCommitment(Boolean bioPackagingCommitment) {
    this.bioPackagingCommitment = bioPackagingCommitment;
}

public String getMerchantStatus() {
    return merchantStatus;
}
public void setMerchantStatus(String merchantStatus) {
    this.merchantStatus = merchantStatus;
}

public java.time.LocalDateTime getSubmittedAt() {
    return submittedAt;
}
public void setSubmittedAt(java.time.LocalDateTime submittedAt) {
    this.submittedAt = submittedAt;
}

@Override
public String toString() {
	// SECURITY: password hash intentionally redacted from logs
	return "Register [uname=" + uname + ", pass=[PROTECTED], nm=" + nm + ", email=" + email + ", phno=" + phno + ", role=" + role + ", restaurant=" + restaurantName + "]";
}

}