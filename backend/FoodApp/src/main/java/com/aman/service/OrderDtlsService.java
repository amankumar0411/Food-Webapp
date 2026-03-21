package com.aman.service;

import com.aman.model.OrderDtls;
import com.aman.repository.OrderDtlsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class OrderDtlsService {

    @Autowired
    private OrderDtlsRepository repo;

    public void saveAll(List<OrderDtls> items) {
        repo.saveAll(items);
    }

    public List<OrderDtls> getByUser(String uname) {
        return repo.findByUnameOrderByPaymentDateDesc(uname);
    }

    public List<OrderDtls> getAll() {
        return repo.findAllByOrderByPaymentDateDesc();
    }
}
