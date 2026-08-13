package com.abhishekmandal.water_usage_backend.service;

import com.abhishekmandal.water_usage_backend.entity.AppUser;
import com.abhishekmandal.water_usage_backend.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Optional;

@Service
public class ChatService {

    private static final String GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=";

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private final UserRepository userRepository;
    private final RAGDataRetrievalService ragDataRetrievalService;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    @Autowired
    public ChatService(UserRepository userRepository, RAGDataRetrievalService ragDataRetrievalService) {
        this.userRepository = userRepository;
        this.ragDataRetrievalService = ragDataRetrievalService;
        this.objectMapper = new ObjectMapper();
        this.httpClient = HttpClient.newHttpClient();
    }

    public String processMessage(String userMessage, Long userId, String language) {
        try {
            // Step 1: Resolve user role
            String role = null;
            String userName = "Guest";
            if (userId != null) {
                Optional<AppUser> userOpt = userRepository.findById(userId);
                if (userOpt.isPresent()) {
                    role = userOpt.get().getRole();
                    // Normalize legacy 'ADMIN' role to 'COMMUNITY_ADMIN'
                    if ("ADMIN".equalsIgnoreCase(role)) {
                        role = "COMMUNITY_ADMIN";
                    }
                    userName = userOpt.get().getName();
                }
            }

            // Step 2: Fetch database context via RAG service (intent-matched, role-scoped)
            String fetchedDatabaseContext = ragDataRetrievalService.retrieveContext(userMessage, userId, role);

            // Step 3: Build the system instruction with context
            String systemInstruction = buildSystemInstruction(role, userName, fetchedDatabaseContext, language);
            
            System.out.println("===== RAG DEBUG: GENERATED SYSTEM INSTRUCTION =====");
            System.out.println(systemInstruction);
            System.out.println("===================================================");

            // Step 4: Build and send Gemini API request
            String requestBody = buildGeminiRequest(userMessage, systemInstruction);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(new URI(GEMINI_URL + geminiApiKey))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                return "Error connecting to AI service. Code: " + response.statusCode();
            }

            // Step 5: Parse and return response
            JsonNode rootNode = objectMapper.readTree(response.body());
            return rootNode.path("candidates").get(0)
                           .path("content")
                           .path("parts").get(0)
                           .path("text").asText();

        } catch (Exception e) {
            e.printStackTrace();
            return "Sorry, I am currently unavailable. Please try again later.";
        }
    }

    private String buildGeminiRequest(String userMessage, String systemInstruction) {
        ObjectNode root = objectMapper.createObjectNode();

        ObjectNode systemInstructionNode = root.putObject("system_instruction");
        ArrayNode systemParts = systemInstructionNode.putArray("parts");
        systemParts.addObject().put("text", systemInstruction);

        ArrayNode contents = root.putArray("contents");
        ObjectNode userContent = contents.addObject();
        userContent.put("role", "user");
        ArrayNode userParts = userContent.putArray("parts");
        userParts.addObject().put("text", userMessage);

        return root.toString();
    }

    private String buildSystemInstruction(String role, String userName, String fetchedDatabaseContext, String languageCode) {
        String languageName = resolveLanguageName(languageCode);
        String displayRole = (role != null) ? role : "GUEST (Unauthenticated)";

        StringBuilder sb = new StringBuilder();

        sb.append("You are SmartBot, an intelligent assistant for the Smart Water monitoring platform.\n");
        sb.append("User: ").append(userName).append("\n");
        sb.append("User Role: ").append(displayRole).append("\n\n");

        sb.append("Here is the secure data retrieved from the database based on the user's query:\n");
        sb.append("--- DATABASE CONTEXT ---\n");
        if (fetchedDatabaseContext != null && !fetchedDatabaseContext.isBlank()) {
            sb.append(fetchedDatabaseContext);
        } else {
            sb.append("(No specific data retrieved — either the question is general, the user is not logged in, or they lack permission for this data.)\n");
        }
        sb.append("------------------------\n\n");

        sb.append("RULES:\n");
        sb.append("1. Answer the user's question using ONLY the provided DATABASE CONTEXT. Do not fabricate data, numbers, or amounts.\n");
        sb.append("2. If the DATABASE CONTEXT is empty, it means they either aren't logged in, asked a general question, or lack permission to view that data. Answer generally about platform features or ask them to log in.\n");
        sb.append("3. If they ask for water saving tips, provide 2-3 practical tips.\n");
        sb.append("4. If they ask an unrelated question (math, science, general trivia), humorously decline and remind them you are a water billing bot. Be witty — tell them you're not as powerful as ChatGPT or Google Gemini to solve all their life problems.\n");
        sb.append("5. Keep responses concise, friendly, and helpful. Use emojis sparingly.\n");
        sb.append("6. Format currency as ₹ (Indian Rupees).\n");
        sb.append("7. Do not use any markdown formatting like asterisks (* or **) or underscores. Return pure plain text only.\n\n");

        sb.append("CRITICAL: Respond to the user strictly in ").append(languageName).append(" language.\n");

        return sb.toString();
    }

    private String resolveLanguageName(String languageCode) {
        if (languageCode == null) return "English";
        switch (languageCode.toLowerCase()) {
            case "hi": return "Hindi";
            case "bn": return "Bengali";
            case "ta": return "Tamil";
            case "te": return "Telugu";
            case "mr": return "Marathi";
            default: return "English";
        }
    }
}
