package com.aman.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.aman.model.Register;
import com.aman.repository.RegisterRepository;

@Service
public class RegisterService {
	@Autowired
    private RegisterRepository rrepo;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

	public void addData(Register r) {
        // HASH PASSWORD BEFORE SAVING
        r.setPass(passwordEncoder.encode(r.getPass()));
		rrepo.save(r);
	}

    public Register findByUname(String uname) {
        return rrepo.findByUname(uname);
    }
}