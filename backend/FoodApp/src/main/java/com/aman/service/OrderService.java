package com.aman.service;

import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.aman.model.Order;
import com.aman.repository.OrderRepository;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orepo;

    public void addData(Order o) {
        orepo.save(o);
    }

    public List<Map<String, Object>> getBill(String uname) {
        return orepo.getDetailedOrders(uname);
    }

    public Order updateData(Integer oid, Double qty) {
        Order existingOrder = orepo.findById(oid).orElse(null);
        if (existingOrder != null) {
            existingOrder.setQty(qty);
            return orepo.save(existingOrder);
        }
        return null;
    }

    public void deleteData(Integer oid) {
        orepo.deleteById(oid);
    }

    public List<com.aman.model.Order> getAllOrders() {
        return orepo.findAll();
    }
}