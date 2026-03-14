package com.aman.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aman.model.Register;
@Repository
public interface RegisterRepository extends JpaRepository<Register, String> {
	@Query("from Register where uname=:uname and pass=:pass")
public Register checkLogin(@Param("uname") String uname, @Param("pass") String pass);
}