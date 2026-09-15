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
    private com.aman.repository.RestaurantRepository restaurantRepository;

    @Autowired
    private com.aman.repository.DiscountCouponRepository discountCouponRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        migrateFoodTable();
        seedUsers();
        seedRestaurants();
        seedFoodCatalog();
        seedCoupons();
    }

    private void migrateFoodTable() {
        try {
            // Check if 'food' exists as a BASE TABLE
            List<String> foodTables = jdbcTemplate.query(
                "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'food' AND TABLE_TYPE = 'BASE TABLE'",
                (rs, rowNum) -> rs.getString("TABLE_NAME")
            );

            // Check if 'main_food_menu' exists as a table
            List<String> mainMenuTables = jdbcTemplate.query(
                "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'main_food_menu'",
                (rs, rowNum) -> rs.getString("TABLE_NAME")
            );

            if (!foodTables.isEmpty() && mainMenuTables.isEmpty()) {
                System.out.println(">>> Migrating database table: RENAME TABLE food TO main_food_menu");
                jdbcTemplate.execute("RENAME TABLE food TO main_food_menu");
                jdbcTemplate.execute("CREATE OR REPLACE VIEW food AS SELECT * FROM main_food_menu");
                System.out.println(">>> Successfully renamed 'food' to 'main_food_menu' and created view 'food'");
            } else if (!foodTables.isEmpty() && !mainMenuTables.isEmpty()) {
                Integer countMainMenu = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM main_food_menu", Integer.class);
                Integer countFood = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM food", Integer.class);
                if ((countMainMenu == null || countMainMenu == 0) && (countFood != null && countFood > 0)) {
                    jdbcTemplate.execute("INSERT INTO main_food_menu (fid, category, fname, image_url, is_veg, price) SELECT fid, category, fname, image_url, is_veg, price FROM food");
                    System.out.println(">>> Copied existing data from 'food' to 'main_food_menu'");
                }
                jdbcTemplate.execute("DROP TABLE IF EXISTS food");
                jdbcTemplate.execute("CREATE OR REPLACE VIEW food AS SELECT * FROM main_food_menu");
                System.out.println(">>> Replaced legacy 'food' table with compatibility view 'food'");
            } else if (foodTables.isEmpty() && !mainMenuTables.isEmpty()) {
                List<String> foodViews = jdbcTemplate.query(
                    "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'food' AND TABLE_TYPE = 'VIEW'",
                    (rs, rowNum) -> rs.getString("TABLE_NAME")
                );
                if (foodViews.isEmpty()) {
                    jdbcTemplate.execute("CREATE OR REPLACE VIEW food AS SELECT * FROM main_food_menu");
                    System.out.println(">>> Created backward compatibility view 'food' -> 'main_food_menu'");
                }
            }
        } catch (Exception e) {
            System.err.println("Notice: Migration check for main_food_menu: " + e.getMessage());
        }
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

        Register admin = registerRepository.findByUname("admin");
        if (admin == null) {
            admin = new Register();
            admin.setUname("admin");
            admin.setNm("Zayka Curator Admin");
            admin.setEmail("admin@zayka.kitchen");
            admin.setPhno("9845012345");
            admin.setPass(passwordEncoder.encode("admin123"));
            admin.setRole("admin");
            registerRepository.save(admin);
            System.out.println(">>> Seeded default admin user: admin / admin123");
        } else {
            admin.setPass(passwordEncoder.encode("admin123"));
            admin.setRole("admin");
            registerRepository.save(admin);
            System.out.println(">>> Ensured admin user credentials: admin / admin123 (role: admin)");
        }
    }

    private void seedRestaurants() {
        if (restaurantRepository.count() == 0) {
            List<com.aman.model.Restaurant> restaurants = List.of(
                new com.aman.model.Restaurant(
                    "toscano", "Toscano Artisan Pizzeria", 4.6, "25-30 mins",
                    "Pizzas, Italian, Desserts", "70% OFF UPTO ₹120",
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuAuwD-4csL15oSZLbYVafbr4_eqD3x9qr6gioUfG5xoOsYyvixS0vwmF06FrG-EJyf2zslZPOZzcZwF2waME8glfGUJtZRQMEEp57G-yH1FvrgoCdkBNT9QK8An2P46A4HFGtyBymWiDapI3vdm-taiTgjDkg42JHujfpgDYvdhz663xWzojkPX_Zvr4vdJTW8eoXGqH9K45Hn6Qo181BEJVvrHAOmkLIB2H-lPylus5Jy1ItBicpmS",
                    "Indiranagar, Bengaluru"
                ),
                new com.aman.model.Restaurant(
                    "meghana", "Meghana Foods", 4.8, "20-25 mins",
                    "Biryani, Andhra, Spicy", "50% OFF",
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuA_fZTjLWEVipIyFY271VoDyURcERuT7j7v5MjcG4TlevSwIu3aRNEnjpOPQE4RUsxLfx3ArF4vuRbKv2-wZceVazVYWWsNjsryP-T4B2ude-T_s_ujxgY5ozov5ff9Irv2ktYa0olHQK0huVhboazkJfSeWKT0S8P2Wzc3RN-OZaZTxePvl8ykn3oK_wRsQTnw2No7r5br-Dda9yQEOdcDJ2TeqjsudclpGst4Uj8la3gsb7-wf2al",
                    "Indiranagar, Bengaluru"
                ),
                new com.aman.model.Restaurant(
                    "truffles", "Truffles Gourmet Bistro", 4.5, "30 mins",
                    "Burgers, Fast Food, Shakes", "FLAT ₹150 OFF",
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuDVeGUNJM5HMi_F-WjJZWe4qMc3RQaygn6LlRt-uZF3Nosbf-eEXiMfbnN34gNnQ3hTje549mGzFq_gV5ROjxzaLYjWaPxqMTc28o1kN1zC6_3Xn6nwXk-AsYFObH98axi1147DDYcSNLU0ABNzYL8BQ3MYP9HsuFnuEfSr3VY7kT1AZf2OofHohXnHXoO-o8m6zraChngVaTX2vYj7nHbsG6LQvhvWgJPTXOZsppsd3jZkLix7MuEY",
                    "Indiranagar, Bengaluru"
                ),
                new com.aman.model.Restaurant(
                    "chocolateroom", "The Chocolate Room", 4.7, "20 mins",
                    "Bakery, Desserts, Shakes", "BUY 1 GET 1",
                    "https://lh3.googleusercontent.com/aida/AEtjO1U48K4NkA9_YjeBZjEi6UUjsMpvAtAJ7JsbltRihM3EP5gQ__3OUJfGiKZtPFZC9vQ02UKkq7XeLiP1wULgEdWQfbIO6_Hj1FQqZ--8VmpgYnTdmSuD66BCZpeJUMuzhoax3HHSd1K_-_z3VwJNyiOQcsoBGDrV7uVXfI7WUI-Nbnu4-i2hL4mAElbXOVU3ys6S5uixJoUSj5CYPwOUwxY3hgVvyvuSU9sOt3bXU3BqbX7K7anXXZyDuwU",
                    "Indiranagar, Bengaluru"
                )
            );
            restaurantRepository.saveAll(restaurants);
            System.out.println(">>> Seeded 4 curated restaurants");
        }
    }

    private void seedFoodCatalog() {
        List<Food> allCatalogDishes = List.of(
            // Toscano (Pizzas, Pasta, Italian)
            new Food("F101", "Woodfired Margherita Sourdough", 420.0,
                "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80",
                "Pizzas", true, "toscano", "Toscano Artisan Pizzeria"),
            new Food("F102", "Burrata Caprese & Pesto Tart", 540.0,
                "https://images.unsplash.com/photo-1592417817098-8f3d69109853?auto=format&fit=crop&w=600&q=80",
                "Starters", true, "toscano", "Toscano Artisan Pizzeria"),
            new Food("F103", "Truffle Tagliolini Pasta", 680.0,
                "https://images.unsplash.com/photo-1556761223-4c4282c73f77?auto=format&fit=crop&w=600&q=80",
                "Pastas", true, "toscano", "Toscano Artisan Pizzeria"),
            new Food("F106", "Botanical Blood Orange Spritz", 210.0,
                "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80",
                "Beverages", true, "toscano", "Toscano Artisan Pizzeria"),
            new Food("F109", "Wild Mushroom Risotto", 520.0,
                "https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=600&q=80",
                "Main Course", true, "toscano", "Toscano Artisan Pizzeria"),
            new Food("F110", "Quattro Formaggi Rustic Pizza", 490.0,
                "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
                "Pizzas", true, "toscano", "Toscano Artisan Pizzeria"),

            // Meghana Foods (Biryani, Andhra, Starters)
            new Food("F107", "Slow Cooked Awadhi Biryani", 480.0,
                "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
                "Biryani", false, "meghana", "Meghana Foods"),
            new Food("F108", "Charcoal Grilled Paneer Tikka", 340.0,
                "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80",
                "Starters", true, "meghana", "Meghana Foods"),
            new Food("F111", "Meghana Special Chicken Biryani", 460.0,
                "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80",
                "Biryani", false, "meghana", "Meghana Foods"),
            new Food("F112", "Hyderabadi Mutton Dum Biryani", 560.0,
                "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&q=80",
                "Biryani", false, "meghana", "Meghana Foods"),
            new Food("F113", "Andhra Shahi Paneer Biryani", 380.0,
                "https://images.unsplash.com/photo-1642821373181-696a54913e93?auto=format&fit=crop&w=600&q=80",
                "Biryani", true, "meghana", "Meghana Foods"),

            // Truffles (Burgers, Sandwiches, Fast Food)
            new Food("F104", "Smoked Provolone Panini", 360.0,
                "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80",
                "Burgers", true, "truffles", "Truffles Gourmet Bistro"),
            new Food("F114", "All-American Classic Cheeseburger", 290.0,
                "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
                "Burgers", false, "truffles", "Truffles Gourmet Bistro"),
            new Food("F115", "Truffle Crunch Veggie Burger", 310.0,
                "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80",
                "Burgers", true, "truffles", "Truffles Gourmet Bistro"),
            new Food("F116", "Peri Peri Crispy Chicken Burger", 340.0,
                "https://images.unsplash.com/photo-1521305916504-4a1121188589?auto=format&fit=crop&w=600&q=80",
                "Burgers", false, "truffles", "Truffles Gourmet Bistro"),

            // The Chocolate Room (Cakes, Desserts, Shakes)
            new Food("F105", "Artisanal Tiramisu Rustico", 290.0,
                "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80",
                "Cakes", true, "chocolateroom", "The Chocolate Room"),
            new Food("F117", "Warm Belgian Chocolate Lava Cake", 240.0,
                "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80",
                "Cakes", true, "chocolateroom", "The Chocolate Room"),
            new Food("F118", "Dutch Truffle Pastry", 190.0,
                "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80",
                "Cakes", true, "chocolateroom", "The Chocolate Room"),
            new Food("F119", "Signature Thick Hot Chocolate", 220.0,
                "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=600&q=80",
                "Beverages", true, "chocolateroom", "The Chocolate Room")
        );

        for (Food food : allCatalogDishes) {
            foodRepository.save(food);
        }
        System.out.println(">>> Seeded/Updated " + allCatalogDishes.size() + " categorized restaurant dishes.");
    }

    private void seedCoupons() {
        if (discountCouponRepository.count() == 0) {
            java.time.LocalDateTime oneYearAhead = java.time.LocalDateTime.now().plusYears(1);
            List<com.aman.model.DiscountCoupon> coupons = List.of(
                new com.aman.model.DiscountCoupon("WELCOME50", "PERCENTAGE", 50.0, 200.0, 150.0, oneYearAhead),
                new com.aman.model.DiscountCoupon("BOTANICAL50", "FIXED", 50.0, 250.0, null, oneYearAhead),
                new com.aman.model.DiscountCoupon("FLAT100", "FIXED", 100.0, 400.0, null, oneYearAhead),
                new com.aman.model.DiscountCoupon("ZAYKA20", "PERCENTAGE", 20.0, 300.0, 200.0, oneYearAhead)
            );
            discountCouponRepository.saveAll(coupons);
            System.out.println(">>> Seeded 4 default promotional discount coupons");
        }
    }
}
