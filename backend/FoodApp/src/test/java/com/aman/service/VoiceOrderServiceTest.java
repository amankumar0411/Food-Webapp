package com.aman.service;

import com.aman.dto.VoiceOrderResponse;
import com.aman.model.Food;
import com.aman.model.Order;
import com.aman.util.FuzzyMatcher;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class VoiceOrderServiceTest {

    private VoiceOrderService voiceOrderService;
    private List<Food> mockMenu;
    private List<Order> savedOrders;

    @BeforeEach
    public void setUp() {
        Food food1 = new Food("F101", "Chicken Fried", 250.0, "img1.jpg");
        Food food2 = new Food("F102", "Garlic Bread", 120.0, "img2.jpg");
        Food food3 = new Food("F103", "Paneer Butter Masala", 290.0, "img3.jpg");
        mockMenu = Arrays.asList(food1, food2, food3);

        savedOrders = new ArrayList<>();

        // Test subclass to avoid bytecode agent issues on experimental JDKs
        FoodService mockFoodService = new FoodService() {
            @Override
            public List<Food> getData() {
                return mockMenu;
            }
        };

        OrderService mockOrderService = new OrderService() {
            @Override
            public void addData(Order o) {
                savedOrders.add(o);
            }
        };

        voiceOrderService = new VoiceOrderService();
        // Set fields via reflection or setters
        try {
            var fField = VoiceOrderService.class.getDeclaredField("foodService");
            fField.setAccessible(true);
            fField.set(voiceOrderService, mockFoodService);

            var oField = VoiceOrderService.class.getDeclaredField("orderService");
            oField.setAccessible(true);
            oField.set(voiceOrderService, mockOrderService);
        } catch (Exception e) {
            fail("Reflection setup failed: " + e.getMessage());
        }
    }

    @Test
    public void testFuzzyMatching() {
        Food matched = FuzzyMatcher.findBestMatch("chicken fry", mockMenu);
        assertNotNull(matched);
        assertEquals("F101", matched.getFid());
        assertEquals("Chicken Fried", matched.getFname());

        Food matchedBread = FuzzyMatcher.findBestMatch("garlic bread", mockMenu);
        assertNotNull(matchedBread);
        assertEquals("F102", matchedBread.getFid());

        Food unmatched = FuzzyMatcher.findBestMatch("sushi roll", mockMenu);
        assertNull(unmatched);
    }

    @Test
    public void testNLUExtraction() {
        List<VoiceOrderService.ExtractedItem> items = voiceOrderService.extractItemsFromTranscript(
                "order 2 chicken fried with garlic bread", mockMenu
        );

        assertEquals(2, items.size());
        assertEquals("chicken fried", items.get(0).getItemName());
        assertEquals(2, items.get(0).getQuantity());

        assertEquals("garlic bread", items.get(1).getItemName());
        assertEquals(1, items.get(1).getQuantity());
    }

    @Test
    public void testProcessVoiceOrderSuccess() {
        String sampleSpeechText = "2 chicken fried with garlic bread";
        MockMultipartFile audioFile = new MockMultipartFile(
                "file",
                "sample_order.wav",
                "audio/wav",
                sampleSpeechText.getBytes()
        );

        VoiceOrderResponse response = voiceOrderService.processVoiceOrder(audioFile, "testuser");

        assertNotNull(response);
        assertEquals(2, response.getMatchedItems().size());
        assertTrue(response.getUnmatchedItems().isEmpty());
        assertEquals("/billing", response.getRedirectTo());
        assertEquals(2, savedOrders.size());
        assertEquals("Chicken Fried", savedOrders.get(0).getFname());
        assertEquals(2.0, savedOrders.get(0).getQty());
    }

    @Test
    public void testProcessVoiceOrderPartialUnmatched() {
        String sampleSpeechText = "chicken fry with mysterious drink";
        MockMultipartFile audioFile = new MockMultipartFile(
                "file",
                "sample_order.wav",
                "audio/wav",
                sampleSpeechText.getBytes()
        );

        VoiceOrderResponse response = voiceOrderService.processVoiceOrder(audioFile, "testuser");

        assertNotNull(response);
        assertEquals(1, response.getMatchedItems().size());
        assertEquals("Chicken Fried", response.getMatchedItems().get(0).getFname());
        assertEquals(1, response.getUnmatchedItems().size());
        assertEquals("mysterious drink", response.getUnmatchedItems().get(0).getItem());
        assertNull(response.getRedirectTo());
        assertEquals(1, savedOrders.size());
    }
}
