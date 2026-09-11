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

    public OrderDtls updateOrderStatus(Integer id, String status) {
        OrderDtls item = repo.findById(id).orElse(null);
        if (item != null) {
            item.setOrderStatus(status);
            return repo.save(item);
        }
        return null;
    }

    public List<OrderDtls> getAvailableDriverOrders() {
        return repo.findByOrderStatusInOrderByPaymentDateDesc(List.of("PAID", "PREPARING", "OUT_FOR_DELIVERY"));
    }

    public OrderDtls acceptOrderForDelivery(Integer id, String driverUname) {
        OrderDtls item = repo.findById(id).orElse(null);
        if (item != null) {
            item.setDriverUname(driverUname);
            item.setOrderStatus("OUT_FOR_DELIVERY");
            item.setDriverEarning(45.0); // Fixed base payout per delivery
            return repo.save(item);
        }
        return null;
    }

    public OrderDtls deliverOrder(Integer id) {
        OrderDtls item = repo.findById(id).orElse(null);
        if (item != null) {
            item.setOrderStatus("DELIVERED");
            return repo.save(item);
        }
        return null;
    }

    public Map<String, Object> getDriverEarnings(String driverUname) {
        List<OrderDtls> orders = repo.findByDriverUnameOrderByPaymentDateDesc(driverUname);
        long completedCount = orders.stream()
                .filter(o -> "DELIVERED".equalsIgnoreCase(o.getOrderStatus()))
                .count();
        double totalEarnings = orders.stream()
                .filter(o -> "DELIVERED".equalsIgnoreCase(o.getOrderStatus()))
                .mapToDouble(o -> o.getDriverEarning() != null ? o.getDriverEarning() : 45.0)
                .sum();

        return Map.of(
            "driverUname", driverUname,
            "completedTrips", completedCount,
            "totalEarnings", totalEarnings,
            "trips", orders
        );
    }
}
