package com.abhishekmandal.water_usage_backend.controller;

import com.abhishekmandal.water_usage_backend.dto.InviteRegisterDTO;
import com.abhishekmandal.water_usage_backend.dto.LoginResponseDTO;
import com.abhishekmandal.water_usage_backend.entity.AppUser;
import com.abhishekmandal.water_usage_backend.entity.CommunityAdmin;
import com.abhishekmandal.water_usage_backend.entity.Resident;
import com.abhishekmandal.water_usage_backend.entity.ResidentInvite;
import com.abhishekmandal.water_usage_backend.repository.ResidentInviteRepository;
import com.abhishekmandal.water_usage_backend.repository.UserRepository;
import com.abhishekmandal.water_usage_backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.abhishekmandal.water_usage_backend.entity.PasswordResetToken;
import com.abhishekmandal.water_usage_backend.repository.PasswordResetTokenRepository;
import com.abhishekmandal.water_usage_backend.service.EmailService;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private ResidentInviteRepository inviteRepository;

    @Autowired
    private com.abhishekmandal.water_usage_backend.repository.HouseholdRepository householdRepository;

    @Autowired
    private com.abhishekmandal.water_usage_backend.repository.ApartmentRepository apartmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody CommunityAdmin user) {
        try {
            user.setVerificationStatus("UNSUBMITTED"); // Initialize status
            LoginResponseDTO response = authService.register(user);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error registering user: " + e.getMessage());
        }
    }

    @PostMapping("/invite-register")
    public ResponseEntity<?> registerResident(@Valid @RequestBody InviteRegisterDTO dto) {
        try {
            Optional<ResidentInvite> inviteOpt = inviteRepository.findByToken(dto.getToken());
            if (inviteOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Invalid invite token");
            }
            
            ResidentInvite invite = inviteOpt.get();
            if ("USED".equals(invite.getStatus())) {
                return ResponseEntity.badRequest().body("Invite token already used");
            }

            Resident user = new Resident();
            user.setName(dto.getName());
            user.setEmail(dto.getEmail());
            user.setHouseholdNumber(dto.getHouseholdNumber());
            user.setPhoneNumber(dto.getPhoneNumber());
            user.setPassword(dto.getPassword());
            user.setGender(dto.getGender());
            user.setDateOfBirth(dto.getDateOfBirth());
            user.setGovernmentId(dto.getGovernmentId());

            LoginResponseDTO registeredUser = authService.inviteRegister(user);
            
            // Link Resident to their Household, create if missing
            Optional<com.abhishekmandal.water_usage_backend.entity.Household> hhOpt = householdRepository.findByHouseholdNumberAndApartmentCommunityAdminId(dto.getHouseholdNumber(), invite.getCommunityAdminId());
            com.abhishekmandal.water_usage_backend.entity.Household hh;
            if (hhOpt.isPresent()) {
                hh = hhOpt.get();
            } else {
                hh = new com.abhishekmandal.water_usage_backend.entity.Household();
                hh.setHouseholdNumber(dto.getHouseholdNumber());
                
                // Use proper repository query instead of findAll().stream().filter()
                Optional<com.abhishekmandal.water_usage_backend.entity.Apartment> aptOpt = apartmentRepository.findFirstByCommunityAdminId(invite.getCommunityAdminId());
                if (aptOpt.isPresent()) {
                    hh.setApartment(aptOpt.get());
                }
            }
            
            // Fetch the actual saved Resident entity for household linking
            Resident savedResident = (Resident) userRepository.findById(registeredUser.getId()).orElse(null);
            if (savedResident != null) {
                hh.setResident(savedResident);
                householdRepository.save(hh);
            }

            invite.setStatus("USED");
            inviteRepository.save(invite);

            return ResponseEntity.ok(registeredUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error registering user: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        LoginResponseDTO response = authService.login(loginRequest.getEmail(), loginRequest.getPassword());

        if (response != null) {
            return ResponseEntity.ok(response); // Sends safe user data (no password hash)
        } else {
            return ResponseEntity.status(401).body("Invalid email or password");
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody java.util.Map<String, String> payload) {
        String email = payload.get("email");
        if (email == null) return ResponseEntity.badRequest().body("Email required");
        
        Optional<AppUser> userOpt = userRepository.findByEmailIgnoreCase(email.trim());
        if (userOpt.isPresent()) {
            AppUser user = userOpt.get();
            
            // Delete old token if exists
            Optional<PasswordResetToken> existingToken = tokenRepository.findByUserId(user.getId());
            existingToken.ifPresent(tokenRepository::delete);
            
            PasswordResetToken token = new PasswordResetToken();
            token.setUser(user);
            token.setToken(UUID.randomUUID().toString());
            token.setExpiryDate(LocalDateTime.now().plusHours(1));
            tokenRepository.save(token);
            
            String resetLink = "http://localhost:5173/reset-password?token=" + token.getToken();
            emailService.sendEmail(user.getEmail(), "Password Reset Request", 
                "You requested a password reset. Click the link to reset your password: \n" + resetLink);
        }
        // Always return OK to prevent email enumeration
        return ResponseEntity.ok("If an account with that email exists, a reset link has been sent.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody java.util.Map<String, String> payload) {
        String tokenStr = payload.get("token");
        String newPassword = payload.get("password");
        
        if (tokenStr == null || newPassword == null) {
            return ResponseEntity.badRequest().body("Token and password are required.");
        }
        
        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByToken(tokenStr);
        if (tokenOpt.isEmpty() || tokenOpt.get().getExpiryDate().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Invalid or expired token.");
        }
        
        AppUser user = tokenOpt.get().getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        tokenRepository.delete(tokenOpt.get());
        
        return ResponseEntity.ok("Password successfully reset.");
    }

    static class LoginRequest {
        private String email;
        private String password;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}