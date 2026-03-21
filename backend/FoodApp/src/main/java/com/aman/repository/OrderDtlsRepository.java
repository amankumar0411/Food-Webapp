package com.aman.repository;

import com.aman.model.OrderDtls;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderDtlsRepository extends JpaRepository<OrderDtls, Integer> {
    List<OrderDtls> findByUnameOrderByPaymentDateDesc(String uname);
    List<OrderDtls> findAllByOrderByPaymentDateDesc();
}
