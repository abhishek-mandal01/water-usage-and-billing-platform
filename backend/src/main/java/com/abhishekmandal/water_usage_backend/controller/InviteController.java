package com.abhishekmandal.water_usage_backend.controller;

import com.abhishekmandal.water_usage_backend.dto.InviteRequestDTO;
import com.abhishekmandal.water_usage_backend.entity.ResidentInvite;
import com.abhishekmandal.water_usage_backend.repository.ResidentInviteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;
import com.abhishekmandal.water_usage_backend.repository.UserRepository;
import com.abhishekmandal.water_usage_backend.entity.AppUser;

@RestController
@RequestMapping("/api/invite")
public class InviteController {

    @Autowired
    private ResidentInviteRepository inviteRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/details/{token}")
    public ResponseEntity<?> getInviteDetails(@PathVariable String token) {
        Optional<ResidentInvite> inviteOpt = inviteRepository.findByToken(token);
        if (inviteOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid invite link.");
        }
        
        ResidentInvite invite = inviteOpt.get();
        if ("USED".equals(invite.getStatus())) {
            return ResponseEntity.badRequest().body("This invite link has already been used.");
        }

        Optional<AppUser> adminOpt = userRepository.findById(invite.getCommunityAdminId());
        if (adminOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Community Admin not found.");
        }

        AppUser admin = adminOpt.get();
        Map<String, String> response = new HashMap<>();
        response.put("adminName", admin.getName());
        response.put("adminEmail", admin.getEmail());
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/generate")
    public ResponseEntity<?> generateInvite(@RequestBody InviteRequestDTO request) {
        String token = UUID.randomUUID().toString();
        
        ResidentInvite invite = new ResidentInvite();
        invite.setToken(token);
        invite.setCommunityAdminId(request.getCommunityAdminId());
        invite.setStatus("PENDING");
        
        inviteRepository.save(invite);
        
        String inviteLink = "http://localhost:5173/register/resident/" + token;
        return ResponseEntity.ok(inviteLink);
    }

    @Autowired
    private com.abhishekmandal.water_usage_backend.service.EmailService emailService;

    @PostMapping({"/send", "/send-email"})
    public ResponseEntity<?> sendInviteEmail(@RequestBody com.abhishekmandal.water_usage_backend.dto.SendEmailRequest request) {
        try {
            emailService.sendInviteEmail(request.getEmail(), request.getInviteLink());
            return ResponseEntity.ok("Email sent successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to send email: " + e.getMessage());
        }
    }

}
