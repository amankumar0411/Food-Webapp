package com.aman.controller;

import com.aman.dto.VoiceOrderResponse;
import com.aman.service.VoiceOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class VoiceOrderController {

    @Autowired
    private VoiceOrderService voiceOrderService;

    @PostMapping(value = "/voice-order", consumes = "multipart/form-data")
    public ResponseEntity<VoiceOrderResponse> handleVoiceOrder(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "uname", required = false) String unameParam) {

        String uname = unameParam;

        // If username not explicitly passed in request params, resolve from SecurityContext JWT
        if (uname == null || uname.isBlank()) {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
                uname = auth.getName();
            }
        }

        VoiceOrderResponse response = voiceOrderService.processVoiceOrder(file, uname);
        return ResponseEntity.ok(response);
    }
}
