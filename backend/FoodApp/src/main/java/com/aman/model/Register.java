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
private String pass;
	@Column(length = 10, nullable = false)
private String role = "user";
	@Column(length = 25)
	@NotBlank(message="NAME CAN'T BLANK")
private String nm;
	@Column(length = 30)
	@Email(message = "PROPER FORMAT OF EMAIL GIVEN")
private String email;
	@Column(length = 10)
	@NotBlank(message="PHONE NO MUST BE GIVEN")
private String phno;
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
@Override
public String toString() {
	// SECURITY: password hash intentionally redacted from logs
	return "Register [uname=" + uname + ", pass=[PROTECTED], nm=" + nm + ", email=" + email + ", phno=" + phno + ", role=" + role + "]";
}

}