package com.aman.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.aman.model.Register;
import com.aman.service.RegisterService;

@RestController
@RequestMapping("/register")
public class RegisterController {

    @Autowired
    private RegisterService rservice;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Autowired
    private com.aman.config.JwtUtils jwtUtils;

    @PostMapping("/add")
    public ResponseEntity<String> registerUser(@RequestBody Register reg) {
        rservice.addData(reg);
        return new ResponseEntity<>("USER REGISTERED SUCCESSFULLY", HttpStatus.CREATED);
    }

    @PostMapping("/login") 
    public ResponseEntity<java.util.Map<String, String>> checkLogin(@RequestBody Register reg) {
        Register r = rservice.findByUname(reg.getUname());
        
        if (r != null) {
            boolean isMatch = false;
            
            // 1. Try standard BCrypt match
            if (passwordEncoder.matches(reg.getPass(), r.getPass())) {
                isMatch = true;
            } 
            // 2. Fallback for LEACY PLAIN-TEXT passwords
            else if (reg.getPass().equals(r.getPass())) {
                // If it matches plain-text, hash it NOW and update the database
                r.setPass(reg.getPass()); // Set plain for the service to hash
                rservice.addData(r);     // Service will hash and save
                isMatch = true;
            }

            if (isMatch) {
                String token = jwtUtils.generateToken(r.getUname());
                java.util.Map<String, String> response = new java.util.HashMap<>();
                response.put("token", token);
                response.put("username", r.getUname());
                response.put("role", r.getUname().equalsIgnoreCase("admin") ? "admin" : "user");
                return new ResponseEntity<>(response, HttpStatus.OK);
            }
        }
        
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }
}