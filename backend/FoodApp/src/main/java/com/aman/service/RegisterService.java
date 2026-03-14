package com.aman.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aman.model.Register;
import com.aman.repository.RegisterRepository;

@Service
public class RegisterService {
	@Autowired
private RegisterRepository rrepo;
	public void addData(Register r)
	{
		rrepo.save(r);
	}
	public Register checkLogin(String uname,String pass)
	{
		return rrepo.checkLogin(uname, pass);
	}
}