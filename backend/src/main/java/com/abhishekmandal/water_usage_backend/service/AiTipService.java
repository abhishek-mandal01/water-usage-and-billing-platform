package com.abhishekmandal.water_usage_backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDate;
import java.util.Optional;

import com.abhishekmandal.water_usage_backend.entity.AiTipCache;
import com.abhishekmandal.water_usage_backend.repository.AiTipCacheRepository;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class AiTipService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private static final String GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=";

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    @Autowired
    private AiTipCacheRepository aiTipCacheRepository;

    public AiTipService() {
        this.httpClient = HttpClient.newHttpClient();
        this.objectMapper = new ObjectMapper();
    }

    public static class AiData {
        public java.util.List<String> tips;
        public String fact;
        public String peerTip;

        public AiData() {
            this.tips = new java.util.ArrayList<>();
        }
    }

    public AiData getDailyAiData(Long userId, double userConsumption, double apartmentAvg) {
        LocalDate today = LocalDate.now();
        Optional<AiTipCache> cachedTipsOpt = aiTipCacheRepository.findByUserIdAndGeneratedDate(userId, today);
        AiData result = new AiData();

        if (cachedTipsOpt.isPresent()) {
            try {
                JsonNode rootNode = objectMapper.readTree(cachedTipsOpt.get().getTipsJson());
                JsonNode tipsNode = rootNode.path("tips");
                if (tipsNode.isArray()) {
                    for (JsonNode node : tipsNode) {
                        result.tips.add(node.asText());
                    }
                }
                result.fact = rootNode.path("fact").asText("Did you know? Water is essential for all life on Earth.");
                result.peerTip = rootNode.path("peerTip").asText("Tip: Small changes like fixing leaks can save thousands of liters a year!");
                return result;
            } catch (Exception e) {
                e.printStackTrace(); // Fallback
            }
        }

        try {
            String systemInstruction = "You are a water conservation expert. " +
                    "The user used " + userConsumption + " liters last month. " +
                    "The apartment average is " + apartmentAvg + " liters. " +
                    "Generate a JSON object containing: " +
                    "1. 'tips': An array of exactly 5 distinct, practical water saving tips personalized for this user. " +
                    "2. 'fact': A rare or unaware 'Did you know?' fact about water. " +
                    "3. 'peerTip': A single, short, practical 1-sentence tip tailored to how they compare to the apartment average. " +
                    "Format strictly as JSON without markdown blocks or any other text.";

            ObjectNode root = objectMapper.createObjectNode();
            
            ObjectNode systemInstructionNode = root.putObject("system_instruction");
            ArrayNode systemParts = systemInstructionNode.putArray("parts");
            systemParts.addObject().put("text", systemInstruction);

            ArrayNode contents = root.putArray("contents");
            ObjectNode userContent = contents.addObject();
            userContent.put("role", "user");
            ArrayNode userParts = userContent.putArray("parts");
            userParts.addObject().put("text", "Please give me the JSON data.");

            String requestBody = root.toString();

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(new URI(GEMINI_URL + geminiApiKey))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                JsonNode rootNode = objectMapper.readTree(response.body());
                String responseText = rootNode.path("candidates").get(0)
                        .path("content")
                        .path("parts").get(0)
                        .path("text").asText().trim();
                
                // Clean up any markdown blocks just in case
                if (responseText.startsWith("```json")) {
                    responseText = responseText.substring(7);
                }
                if (responseText.startsWith("```")) {
                    responseText = responseText.substring(3);
                }
                if (responseText.endsWith("```")) {
                    responseText = responseText.substring(0, responseText.length() - 3);
                }
                responseText = responseText.trim();
                
                JsonNode dataNode = objectMapper.readTree(responseText);
                JsonNode tipsNode = dataNode.path("tips");
                if (tipsNode.isArray()) {
                    for (JsonNode node : tipsNode) {
                        result.tips.add(node.asText());
                    }
                }
                result.fact = dataNode.path("fact").asText("Did you know? Over 97% of the earth's water is found in the oceans as salt water.");
                result.peerTip = dataNode.path("peerTip").asText("Tip: Install water-saving showerheads to reduce water consumption.");
                
                if (!result.tips.isEmpty()) {
                    // Save to cache
                    AiTipCache cache = new AiTipCache();
                    cache.setUserId(userId);
                    cache.setGeneratedDate(today);
                    
                    ObjectNode cacheJson = objectMapper.createObjectNode();
                    ArrayNode tipsArray = cacheJson.putArray("tips");
                    for (String tip : result.tips) tipsArray.add(tip);
                    cacheJson.put("fact", result.fact);
                    cacheJson.put("peerTip", result.peerTip);
                    
                    cache.setTipsJson(objectMapper.writeValueAsString(cacheJson));
                    aiTipCacheRepository.save(cache);
                    return result;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        // Fallback defaults
        result.tips = java.util.Arrays.asList(
                "Check faucets and pipes for leaks. A small drip can waste 20 gallons of water per day.",
                "Turn off the tap while brushing your teeth to save up to 8 gallons of water.",
                "Use your dishwasher only when it's fully loaded to maximize water efficiency.",
                "Install water-saving showerheads to reduce water consumption by up to 30%.",
                "Collect rainwater for your garden plants."
        );
        result.fact = "Did you know? A jellyfish and a cucumber are each 95% water.";
        result.peerTip = "Tip: Install water-saving showerheads to significantly reduce your daily usage.";
        return result;
    }
}
