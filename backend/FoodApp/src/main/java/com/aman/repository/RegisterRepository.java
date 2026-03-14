package com.aman.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aman.model.Register;
@Repository
public interface RegisterRepository extends JpaRepository<Register, String> {
    public Register findByUname(String uname);
}