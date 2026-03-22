package com.aman.repository;

import com.aman.model.OrderDtls;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderDtlsRepository extends JpaRepository<OrderDtls, Integer> {
    List<OrderDtls> findByUnameOrderByPaymentDateDesc(String uname);
    List<OrderDtls> findAllByOrderByPaymentDateDesc();

    @Query(value = "SELECT id, uname, fid, fname, qty, unit_price AS unitPrice, " +
                   "total_price AS totalPrice, grand_total AS grandTotal, " +
                   "payment_date AS paymentDate, payment_status AS paymentStatus " +
                   "FROM order_dtls ORDER BY payment_date DESC", nativeQuery = true)
    List<java.util.Map<String, Object>> findAllNative();

    @Query(value = "SELECT id, uname, fid, fname, qty, unit_price AS unitPrice, " +
                   "total_price AS totalPrice, grand_total AS grandTotal, " +
                   "payment_date AS paymentDate, payment_status AS paymentStatus " +
                   "FROM order_dtls WHERE uname = ?1 ORDER BY payment_date DESC", nativeQuery = true)
    List<java.util.Map<String, Object>> findByUnameNative(String uname);
}
