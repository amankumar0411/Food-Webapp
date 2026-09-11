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
        // Accept valid roles: "user", "admin", "merchant", "driver"
        if (r.getRole() == null || r.getRole().isBlank()) {
            r.setRole("user");
        } else {
            String requestedRole = r.getRole().trim().toLowerCase();
            if (requestedRole.equals("admin") || requestedRole.equals("merchant") || requestedRole.equals("driver") || requestedRole.equals("user")) {
                r.setRole(requestedRole);
            } else {
                r.setRole("user");
            }
        }
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

    public Register updateProfile(String uname, Register updatedDetails) {
        Register existing = rrepo.findByUname(uname);
        if (existing != null) {
            if (updatedDetails.getNm() != null && !updatedDetails.getNm().isBlank()) {
                existing.setNm(updatedDetails.getNm());
            }
            if (updatedDetails.getEmail() != null && !updatedDetails.getEmail().isBlank()) {
                existing.setEmail(updatedDetails.getEmail());
            }
            if (updatedDetails.getPhno() != null && !updatedDetails.getPhno().isBlank()) {
                existing.setPhno(updatedDetails.getPhno());
            }
            return rrepo.save(existing);
        }
        return null;
    }

    public boolean changePassword(String uname, String oldPass, String newPass) {
        Register existing = rrepo.findByUname(uname);
        if (existing != null && passwordEncoder.matches(oldPass, existing.getPass())) {
            existing.setPass(passwordEncoder.encode(newPass));
            rrepo.save(existing);
            return true;
        }
        return false;
    }
}