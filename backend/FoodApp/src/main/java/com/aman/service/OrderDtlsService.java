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

    public Map<String, Object> getUserStats(String uname) {
        List<Map<String, Object>> orders = repo.findByUnameNative(uname);
        int totalOrders = orders.size();
        double totalSpent = 0.0;
        java.util.Map<String, Integer> itemFrequency = new java.util.HashMap<>();

        for (Map<String, Object> o : orders) {
            Object grandTotalObj = o.get("grandTotal");
            Object totalPriceObj = o.get("totalPrice");
            if (grandTotalObj instanceof Number) {
                totalSpent += ((Number) grandTotalObj).doubleValue();
            } else if (totalPriceObj instanceof Number) {
                totalSpent += ((Number) totalPriceObj).doubleValue();
            }

            Object fname = o.get("fname");
            if (fname != null) {
                String fn = fname.toString();
                itemFrequency.put(fn, itemFrequency.getOrDefault(fn, 0) + 1);
            }
        }

        String favoriteItem = "Woodfired Margherita Sourdough";
        int maxFreq = 0;
        for (java.util.Map.Entry<String, Integer> entry : itemFrequency.entrySet()) {
            if (entry.getValue() > maxFreq) {
                maxFreq = entry.getValue();
                favoriteItem = entry.getKey();
            }
        }

        int rewardPoints = (int) (totalSpent * 0.1);
        if (totalOrders == 0) {
            rewardPoints = 250; // Welcome reward points
        }

        return Map.of(
            "uname", uname,
            "totalOrders", totalOrders,
            "totalSpent", Math.round(totalSpent * 100.0) / 100.0,
            "rewardsPoints", rewardPoints,
            "favoriteCuisine", favoriteItem,
            "tier", totalOrders >= 10 ? "Zayka Elite Gold" : "Zayka Connoisseur"
        );
    }
}
