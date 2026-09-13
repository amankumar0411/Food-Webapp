package com.aman.service;

import com.aman.model.Address;
import com.aman.repository.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AddressService {

    @Autowired
    private AddressRepository repo;

    public List<Address> getAddresses(String uname) {
        List<Address> list = repo.findByUnameOrderByIsDefaultDescCreatedAtDesc(uname);
        if (list.isEmpty()) {
            // Seed initial realistic defaults if user has none
            Address addr1 = new Address(uname, "Home (Penthouse)", "Villa 42, Palm Meadows, Indiranagar 100ft Road, Bengaluru 560038", true, "Primary Sanctuary • 15-25m express");
            Address addr2 = new Address(uname, "Studio / Lab", "EcoSpace Tech Park, Tower 3B, 4th Floor, Bellandur, Outer Ring Rd, Bengaluru 560103", false, "Office • Concierge Access");
            repo.save(addr1);
            repo.save(addr2);
            return repo.findByUnameOrderByIsDefaultDescCreatedAtDesc(uname);
        }
        return list;
    }

    public Address addAddress(Address address) {
        if (address.isDefault()) {
            // Unset previous defaults
            List<Address> existing = repo.findByUnameOrderByIsDefaultDescCreatedAtDesc(address.getUname());
            for (Address a : existing) {
                if (a.isDefault()) {
                    a.setDefault(false);
                    repo.save(a);
                }
            }
        }
        return repo.save(address);
    }

    public Address setDefaultAddress(Long id, String uname) {
        List<Address> existing = repo.findByUnameOrderByIsDefaultDescCreatedAtDesc(uname);
        Address target = null;
        for (Address a : existing) {
            if (a.getId().equals(id)) {
                a.setDefault(true);
                target = a;
            } else if (a.isDefault()) {
                a.setDefault(false);
            }
            repo.save(a);
        }
        return target;
    }

    public boolean deleteAddress(Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return true;
        }
        return false;
    }
}
