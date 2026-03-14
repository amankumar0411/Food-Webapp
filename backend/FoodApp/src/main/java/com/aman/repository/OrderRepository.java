package com.aman.repository;

import com.aman.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Map;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {

    @Query(value = "SELECT o.oid AS oid, f.fname AS fname, f.price AS fprice, o.qty AS qty, (f.price * o.qty) AS totalprice " +
                   "FROM order_table o " +
                   "INNER JOIN food f ON o.fid = f.fid " +
                   "WHERE o.uname = ?1", nativeQuery = true)
    List<Map<String, Object>> getDetailedOrders(String uname);
}