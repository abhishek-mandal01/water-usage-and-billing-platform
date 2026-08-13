package com.abhishekmandal.water_usage_backend.controller;

import com.abhishekmandal.water_usage_backend.dto.ChatRequest;
import com.abhishekmandal.water_usage_backend.dto.ChatResponse;
import com.abhishekmandal.water_usage_backend.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:5173")
public class ChatController {

    private final ChatService chatService;

    @Autowired
    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping
    public ResponseEntity<ChatResponse> processMessage(@RequestBody ChatRequest request) {
        String reply = chatService.processMessage(request.getMessage(), request.getUserId(), request.getLanguage());
        return ResponseEntity.ok(new ChatResponse(reply));
    }
}
