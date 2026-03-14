package com.aman.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aman.model.Food;
import com.aman.service.FoodService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/food")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "https://foodapp-tw.vercel.app/"
})
public class FoodController {
	@Autowired
private FoodService fservice;
	@PostMapping("/add")
	public ResponseEntity<String> addData(@Valid @RequestBody Food f)
	{
		String msg="FOOD ADDED SUCCESSFULLY";
		fservice.addData(f);
		return new ResponseEntity<String>(msg,HttpStatus.CREATED);
	}
	@GetMapping("/fetch")
	public ResponseEntity<List<Food>> getData()
	{
		List<Food> flist=fservice.getData();
		return new ResponseEntity<List<Food>>(flist,HttpStatus.OK);
	}
	@GetMapping("/fetch/{fid}")
	public ResponseEntity<Food> getFidDetails(@PathVariable String fid)
	{
		Food f=fservice.getFidDetails(fid);
		return new ResponseEntity<Food>(f,HttpStatus.OK);
	}
	@DeleteMapping("/del/{fid}")
	public ResponseEntity<String> deleteData(@PathVariable String fid)
	{
		String msg="FOOD ITEM DELETED SUCCESSFULLY";
             fservice.deleteData(fid);
		return new ResponseEntity<String>(msg,HttpStatus.OK);
	}
	@PutMapping("/upd/{fid}")
	public ResponseEntity<String> updateData(@PathVariable String fid,@Valid @RequestBody Food newfood)
	{
		String msg="FOOD ITEM UPDATED SUCCESSFULLY";
		fservice.updateData(fid, newfood);
		return new ResponseEntity<String>(msg,HttpStatus.OK);
	}
	
	
}