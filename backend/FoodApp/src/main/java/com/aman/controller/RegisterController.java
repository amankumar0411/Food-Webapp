package com.aman.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.aman.model.Register;
import com.aman.service.RegisterService;
import com.aman.config.LoginAttemptService;
import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/register")
public class RegisterController {

    @Autowired
    private RegisterService rservice;

    @Autowired
    private com.aman.config.JwtUtils jwtUtils;

    @Autowired
    private LoginAttemptService loginAttemptService;

    // ── REGISTRATION ──────────────────────────────────────────────────────────
    @PostMapping("/add")
    public ResponseEntity<String> registerUser(@Valid @RequestBody Register reg) {
        rservice.addData(reg);
        return new ResponseEntity<>("USER REGISTERED SUCCESSFULLY", HttpStatus.CREATED);
    }

    // ── LOGIN ─────────────────────────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> checkLogin(
            @RequestBody Register reg,
            HttpServletRequest request) {

        // Resolve client IP — respect X-Forwarded-For set by Railway/Render proxies
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isBlank()) ip = request.getRemoteAddr();
        // X-Forwarded-For can be a comma-separated list; use the first (originating) IP
        if (ip.contains(",")) ip = ip.split(",")[0].trim();

        // ── RATE LIMIT CHECK ──────────────────────────────────────────────────
        if (loginAttemptService.isBlocked(ip)) {
            long retryAfter = loginAttemptService.secondsUntilUnlock(ip);
            return ResponseEntity
                    .status(HttpStatus.TOO_MANY_REQUESTS)
                    .header("Retry-After", String.valueOf(retryAfter))
                    .body(Map.of(
                        "error", "Too many failed login attempts. Try again in " + (retryAfter / 60 + 1) + " minute(s)."
                    ));
        }

        // authenticate() returns the persisted user only if BCrypt compare succeeds.
        // SECURITY: no plain-text fallback. No user-enumeration (same error for both cases).
        Register r = rservice.authenticate(reg.getUname(), reg.getPass());

        if (r != null) {
            loginAttemptService.recordSuccess(ip);   // reset counter on success
            String token = jwtUtils.generateToken(r.getUname(), r.getRole());
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("username", r.getUname());
            response.put("role", r.getRole());
            return new ResponseEntity<>(response, HttpStatus.OK);
        }

        loginAttemptService.recordFailure(ip);       // count failure toward lockout
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Invalid credentials"));
    }

    // ── PROFILE ENDPOINTS ─────────────────────────────────────────────────────
    @GetMapping("/profile/{uname}")
    public ResponseEntity<?> getProfile(@PathVariable String uname) {
        Register r = rservice.findByUname(uname);
        if (r != null) {
            return ResponseEntity.ok(r);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
    }

    @PutMapping("/profile/{uname}")
    public ResponseEntity<?> updateProfile(@PathVariable String uname, @RequestBody Register updatedDetails) {
        Register r = rservice.updateProfile(uname, updatedDetails);
        if (r != null) {
            return ResponseEntity.ok(r);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
    }

    @PutMapping("/change-password/{uname}")
    public ResponseEntity<?> changePassword(@PathVariable String uname, @RequestBody Map<String, String> payload) {
        String oldPass = payload.get("oldPassword");
        String newPass = payload.get("newPassword");
        if (oldPass == null || newPass == null || newPass.length() < 6) {
            return ResponseEntity.badRequest().body(Map.of("error", "Password must be at least 6 characters"));
        }
        boolean success = rservice.changePassword(uname, oldPass, newPass);
        if (success) {
            return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Incorrect current password"));
    }
}