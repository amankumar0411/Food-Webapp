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
        // Always hash the password before saving
        r.setPass(passwordEncoder.encode(r.getPass()));
        // SECURITY: ignore any role supplied in the request; always register as "user"
        r.setRole("user");
		rrepo.save(r);
	}

    public Register findByUname(String uname) {
        return rrepo.findByUname(uname);
    }

    /**
     * Authenticates a user by username + raw password.
     * Returns the persisted Register object on success, or null on failure.
     * SECURITY: no plain-text fallback — BCrypt only.
     */
    public Register authenticate(String uname, String rawPass) {
        Register r = rrepo.findByUname(uname);
        if (r != null && passwordEncoder.matches(rawPass, r.getPass())) {
            return r;
        }
        return null;
    }
}