package com.aman.service;

import com.aman.model.OrderDtls;
import com.aman.repository.OrderDtlsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

@Service
public class OrderDtlsService {

    @Autowired
    private OrderDtlsRepository repo;

    public void saveAll(List<OrderDtls> items) {
        repo.saveAll(items);
    }

    public List<Map<String, Object>> getByUser(String uname) {
        return repo.findByUnameNative(uname);
    }

    public List<Map<String, Object>> getAll() {
        return repo.findAllNative();
    }
}
