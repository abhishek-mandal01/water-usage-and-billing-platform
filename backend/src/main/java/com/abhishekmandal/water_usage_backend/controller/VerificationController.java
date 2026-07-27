package com.abhishekmandal.water_usage_backend.controller;

import com.abhishekmandal.water_usage_backend.dto.VerificationDTO;
import com.abhishekmandal.water_usage_backend.entity.CommunityAdmin;
import com.abhishekmandal.water_usage_backend.repository.CommunityAdminRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/api/verification")
public class VerificationController {

    @Autowired
    private CommunityAdminRepository communityAdminRepository;

    // Valid state transitions for the verification workflow
    private static final Set<String> APPROVABLE_STATES = Set.of("PENDING");
    private static final Set<String> DECLINABLE_STATES = Set.of("PENDING");
    private static final Set<String> REREQUEST_STATES = Set.of("PENDING", "REJECTED");

    @PostMapping("/submit")
    public ResponseEntity<?> submitVerification(@Valid @RequestBody VerificationDTO request) {
        Optional<CommunityAdmin> adminOpt = communityAdminRepository.findById(request.getUserId());
        if (adminOpt.isPresent()) {
            CommunityAdmin admin = adminOpt.get();
            
            // Only allow submission from UNSUBMITTED or RE_REQUEST state
            if (!"UNSUBMITTED".equals(admin.getVerificationStatus()) && !"RE_REQUEST".equals(admin.getVerificationStatus())) {
                return ResponseEntity.badRequest().body("Verification can only be submitted from UNSUBMITTED or RE_REQUEST status. Current: " + admin.getVerificationStatus());
            }
            
            admin.setAadharCard(request.getAadharCard());
            admin.setPanCard(request.getPanCard());
            admin.setPhoneNumber(request.getPhoneNumber());
            admin.setAddress(request.getAddress());
            admin.setVerificationStatus("PENDING");
            communityAdminRepository.save(admin);
            return ResponseEntity.ok("Verification submitted successfully");
        }
        return ResponseEntity.badRequest().body("User not found");
    }

    @GetMapping("/status/{userId}")
    public ResponseEntity<?> getStatus(@PathVariable Long userId) {
        Optional<CommunityAdmin> adminOpt = communityAdminRepository.findById(userId);
        if (adminOpt.isPresent()) {
            return ResponseEntity.ok(adminOpt.get());
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/pending")
    public ResponseEntity<?> getPendingVerifications() {
        List<CommunityAdmin> pending = communityAdminRepository.findByVerificationStatus("PENDING");
        return ResponseEntity.ok(pending);
    }

    @PostMapping("/approve/{id}")
    public ResponseEntity<?> approveVerification(@PathVariable Long id) {
        Optional<CommunityAdmin> adminOpt = communityAdminRepository.findById(id);
        if (adminOpt.isPresent()) {
            CommunityAdmin admin = adminOpt.get();
            
            // State machine guard: can only approve from PENDING
            if (!APPROVABLE_STATES.contains(admin.getVerificationStatus())) {
                return ResponseEntity.badRequest().body("Cannot approve from status: " + admin.getVerificationStatus() + ". Must be PENDING.");
            }
            
            admin.setVerificationStatus("APPROVED");
            communityAdminRepository.save(admin);
            return ResponseEntity.ok("Approved");
        }
        return ResponseEntity.badRequest().body("Admin not found");
    }

    @PostMapping("/decline/{id}")
    public ResponseEntity<?> declineVerification(@PathVariable Long id) {
        Optional<CommunityAdmin> adminOpt = communityAdminRepository.findById(id);
        if (adminOpt.isPresent()) {
            CommunityAdmin admin = adminOpt.get();
            
            // State machine guard: can only decline from PENDING
            if (!DECLINABLE_STATES.contains(admin.getVerificationStatus())) {
                return ResponseEntity.badRequest().body("Cannot decline from status: " + admin.getVerificationStatus() + ". Must be PENDING.");
            }
            
            admin.setVerificationStatus("REJECTED");
            communityAdminRepository.save(admin);
            return ResponseEntity.ok("Declined");
        }
        return ResponseEntity.badRequest().body("Admin not found");
    }

    @PostMapping("/rerequest/{id}")
    public ResponseEntity<?> rerequestVerification(@PathVariable Long id) {
        Optional<CommunityAdmin> adminOpt = communityAdminRepository.findById(id);
        if (adminOpt.isPresent()) {
            CommunityAdmin admin = adminOpt.get();
            
            // State machine guard: can only re-request from PENDING or REJECTED
            if (!REREQUEST_STATES.contains(admin.getVerificationStatus())) {
                return ResponseEntity.badRequest().body("Cannot re-request from status: " + admin.getVerificationStatus() + ". Must be PENDING or REJECTED.");
            }
            
            admin.setVerificationStatus("RE_REQUEST");
            communityAdminRepository.save(admin);
            return ResponseEntity.ok("Re-requested");
        }
        return ResponseEntity.badRequest().body("Admin not found");
    }
}
