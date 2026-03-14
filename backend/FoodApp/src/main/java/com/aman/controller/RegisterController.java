package com.aman.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.aman.model.Register;
import com.aman.service.RegisterService;

@RestController
@RequestMapping("/register")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "https://foodapp-tw.vercel.app/"
})
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
        
        if (r != null && passwordEncoder.matches(reg.getPass(), r.getPass())) {
            String token = jwtUtils.generateToken(r.getUname());
            java.util.Map<String, String> response = new java.util.HashMap<>();
            response.put("token", token);
            response.put("username", r.getUname());
            response.put("role", r.getUname().equalsIgnoreCase("admin") ? "admin" : "user");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }
}