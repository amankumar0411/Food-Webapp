package com.aman.service;

import com.aman.model.PaymentMethod;
import com.aman.repository.PaymentMethodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentMethodService {

    @Autowired
    private PaymentMethodRepository repo;

    public List<PaymentMethod> getPaymentMethods(String uname) {
        List<PaymentMethod> list = repo.findByUnameOrderByIsDefaultDescCreatedAtDesc(uname);
        if (list.isEmpty()) {
            // Seed initial realistic cards/UPI if empty
            PaymentMethod pm1 = new PaymentMethod(uname, "CARD", "HDFC Millennia", "•••• 4242 • Exp 08/28", true);
            PaymentMethod pm2 = new PaymentMethod(uname, "UPI", "Google Pay", uname + "@okhdfcbank", false);
            repo.save(pm1);
            repo.save(pm2);
            return repo.findByUnameOrderByIsDefaultDescCreatedAtDesc(uname);
        }
        return list;
    }

    public PaymentMethod addPaymentMethod(PaymentMethod method) {
        if (method.isDefault()) {
            List<PaymentMethod> existing = repo.findByUnameOrderByIsDefaultDescCreatedAtDesc(method.getUname());
            for (PaymentMethod pm : existing) {
                if (pm.isDefault()) {
                    pm.setDefault(false);
                    repo.save(pm);
                }
            }
        }
        return repo.save(method);
    }

    public boolean deletePaymentMethod(Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return true;
        }
        return false;
    }
}
