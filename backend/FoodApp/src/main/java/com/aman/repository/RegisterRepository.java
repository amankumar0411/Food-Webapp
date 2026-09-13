package com.aman.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aman.model.Register;
@Repository
public interface RegisterRepository extends JpaRepository<Register, String> {
    Register findByUname(String uname);
    Register findFirstByEmail(String email);
    Register findFirstByPhno(String phno);

    boolean existsByUname(String uname);
    boolean existsByEmail(String email);
    boolean existsByPhno(String phno);
}