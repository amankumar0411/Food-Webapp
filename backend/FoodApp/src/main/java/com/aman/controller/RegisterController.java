package com.aman.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.aman.model.Register;
import com.aman.service.RegisterService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/register")
public class RegisterController {

    @Autowired
    private RegisterService rservice;

    @Autowired
    private com.aman.config.JwtUtils jwtUtils;

    // ── REGISTRATION ──────────────────────────────────────────────────────────
    @PostMapping("/add")
    public ResponseEntity<String> registerUser(@RequestBody Register reg) {
        rservice.addData(reg);
        return new ResponseEntity<>("USER REGISTERED SUCCESSFULLY", HttpStatus.CREATED);
    }

    // ── LOGIN ─────────────────────────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> checkLogin(
            @RequestBody Register reg,
            HttpServletRequest request) {

        // authenticate() returns the persisted user only if BCrypt compare succeeds.
        // SECURITY: no plain-text fallback. No user-enumeration (same error for both cases).
        Register r = rservice.authenticate(reg.getUname(), reg.getPass());

        if (r != null) {
            // Role comes from DB — not from username string comparison
            String token = jwtUtils.generateToken(r.getUname(), r.getRole());
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("username", r.getUname());
            // role is embedded in the JWT; also return it so the frontend
            // can read it without parsing the token itself
            response.put("role", r.getRole());
            return new ResponseEntity<>(response, HttpStatus.OK);
        }

        // Generic message — do NOT reveal whether username exists
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Invalid credentials"));
    }
}