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
        "https://foodapp-aec.vercel.app/"
})
public class RegisterController {

    @Autowired
    private RegisterService rservice;

    @PostMapping("/add")
    public ResponseEntity<String> registerUser(@RequestBody Register reg) {
        rservice.addData(reg);
        return new ResponseEntity<>("USER REGISTERED SUCCESSFULLY", HttpStatus.CREATED);
    }

    @PostMapping("/login") 
    public ResponseEntity<String> checkLogin(@RequestBody Register reg) {
        Register r = rservice.checkLogin(reg.getUname(), reg.getPass());
        
        if (r != null) {
            return new ResponseEntity<>("LOGIN SUCCESSFUL", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("LOGIN FAILURE", HttpStatus.UNAUTHORIZED);
        }
    }
}