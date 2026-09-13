package com.aman.config;

import com.aman.model.Food;
import com.aman.model.Register;
import com.aman.repository.FoodRepository;
import com.aman.repository.RegisterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private FoodRepository foodRepository;

    @Autowired
    private RegisterRepository registerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedUsers();
        seedFoodCatalog();
    }

    private void seedUsers() {
        if (!registerRepository.existsByUname("aman")) {
            Register patron = new Register();
            patron.setUname("aman");
            patron.setNm("Aman Verma");
            patron.setEmail("aman.verma@domain.com");
            patron.setPhno("9876543210");
            patron.setPass(passwordEncoder.encode("mastersecretpass"));
            patron.setRole("user");
            registerRepository.save(patron);
            System.out.println(">>> Seeded default patron user: aman / mastersecretpass");
        }

        if (!registerRepository.existsByUname("admin")) {
            Register admin = new Register();
            admin.setUname("admin");
            admin.setNm("Zayka Curator Admin");
            admin.setEmail("admin@zayka.kitchen");
            admin.setPhno("9845012345");
            admin.setPass(passwordEncoder.encode("admin123"));
            admin.setRole("admin");
            registerRepository.save(admin);
            System.out.println(">>> Seeded default admin user: admin / admin123");
        }
    }

    private void seedFoodCatalog() {
        if (!foodRepository.existsById("F101")) {
            List<Food> initialFoods = List.of(
                new Food("F101", "Woodfired Margherita Sourdough", 420.0,
                    "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80",
                    "Pizzas", true),
                new Food("F102", "Burrata Caprese & Pesto Tart", 540.0,
                    "https://images.unsplash.com/photo-1592417817098-8f3d69109853?auto=format&fit=crop&w=600&q=80",
                    "Starters", true),
                new Food("F103", "Truffle Tagliolini Pasta", 680.0,
                    "https://images.unsplash.com/photo-1556761223-4c4282c73f77?auto=format&fit=crop&w=600&q=80",
                    "Pasta", true),
                new Food("F104", "Smoked Provolone Panini", 360.0,
                    "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80",
                    "Burgers & Sandwiches", true),
                new Food("F105", "Artisanal Tiramisu Rustico", 290.0,
                    "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80",
                    "Desserts", true),
                new Food("F106", "Botanical Blood Orange Spritz", 210.0,
                    "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80",
                    "Beverages", true),
                new Food("F107", "Slow Cooked Awadhi Biryani", 480.0,
                    "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
                    "Main Course", false),
                new Food("F108", "Charcoal Grilled Paneer Tikka", 340.0,
                    "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80",
                    "Starters", true),
                new Food("F109", "Wild Mushroom Risotto", 520.0,
                    "https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=600&q=80",
                    "Main Course", true)
            );

            foodRepository.saveAll(initialFoods);
            System.out.println(">>> Seeded " + initialFoods.size() + " artisanal catalog dishes into food table.");
        }
    }
}
