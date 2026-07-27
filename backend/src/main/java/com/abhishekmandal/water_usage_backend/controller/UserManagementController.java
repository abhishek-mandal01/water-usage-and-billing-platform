package com.abhishekmandal.water_usage_backend.controller;

import com.abhishekmandal.water_usage_backend.entity.AppUser;
import com.abhishekmandal.water_usage_backend.entity.Bill;
import com.abhishekmandal.water_usage_backend.entity.CommunityAdmin;
import com.abhishekmandal.water_usage_backend.entity.Household;
import com.abhishekmandal.water_usage_backend.entity.Ticket;
import com.abhishekmandal.water_usage_backend.repository.BillRepository;
import com.abhishekmandal.water_usage_backend.repository.CommunityAdminRepository;
import com.abhishekmandal.water_usage_backend.repository.HouseholdRepository;
import com.abhishekmandal.water_usage_backend.repository.ResidentRepository;
import com.abhishekmandal.water_usage_backend.repository.TicketRepository;
import com.abhishekmandal.water_usage_backend.repository.UserRepository;
import com.abhishekmandal.water_usage_backend.repository.ApartmentRepository;
import com.abhishekmandal.water_usage_backend.entity.Apartment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserManagementController {

    @Autowired
    private ResidentRepository residentRepository;

    @Autowired
    private CommunityAdminRepository adminRepository;

    @Autowired
    private HouseholdRepository householdRepository;

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ApartmentRepository apartmentRepository;

    private void performResidentDeletion(Long residentId) {
        // 1. Delete associated Bills
        List<Bill> bills = billRepository.findByUserId(residentId);
        billRepository.deleteAll(bills);

        // 2. Delete associated Tickets
        List<Ticket> tickets = ticketRepository.findByRaisedByIdOrderByCreatedAtDesc(residentId);
        ticketRepository.deleteAll(tickets);

        // 3. Unlink from Household — use proper repository query instead of findAll().stream().filter()
        Optional<Household> hhOpt = householdRepository.findByResidentId(residentId);
        
        if (hhOpt.isPresent()) {
            Household hh = hhOpt.get();
            hh.setResident(null);
            householdRepository.save(hh);
        }

        // 4. Delete Resident
        userRepository.deleteById(residentId);
    }

    @Transactional
    @DeleteMapping("/resident/{id}")
    public ResponseEntity<?> deleteResident(@PathVariable Long id) {
        if (!residentRepository.existsById(id)) {
            return ResponseEntity.badRequest().body("Resident not found");
        }
        
        performResidentDeletion(id);
        
        return ResponseEntity.ok("Resident deleted successfully");
    }

    @Transactional
    @DeleteMapping("/community-admin/{id}")
    public ResponseEntity<?> deleteCommunityAdmin(@PathVariable Long id) {
        if (!adminRepository.existsById(id)) {
            return ResponseEntity.badRequest().body("Admin not found");
        }
        
        // Find apartment
        Optional<Apartment> aptOpt = apartmentRepository.findFirstByCommunityAdminId(id);
        if (aptOpt.isPresent()) {
            Apartment apt = aptOpt.get();
            List<Household> households = householdRepository.findByApartmentCommunityAdminId(id);
            
            for (Household h : households) {
                if (h.getResident() != null) {
                    performResidentDeletion(h.getResident().getId());
                }
            }
            
            householdRepository.deleteAll(households);
            apartmentRepository.delete(apt);
        }
        
        userRepository.deleteById(id);
        return ResponseEntity.ok("Community Admin and associated data deleted successfully");
    }

    @PostMapping("/community-admin/{id}/soft-delete")
    public ResponseEntity<?> softDeleteAdmin(@PathVariable Long id) {
        Optional<AppUser> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            AppUser user = userOpt.get();
            if (user instanceof CommunityAdmin) {
                user.setRole("DELETED_ADMIN");
                ((CommunityAdmin) user).setVerificationStatus("DELETED");
                userRepository.save(user);
                return ResponseEntity.ok("Community Admin deleted successfully");
            }
        }
        return ResponseEntity.badRequest().body("Admin not found");
    }

    @GetMapping("/community-admins")
    public ResponseEntity<?> getAllCommunityAdmins() {
        // Use proper repository query instead of findAll().stream().filter()
        List<CommunityAdmin> admins = adminRepository.findByVerificationStatusNot("DELETED");
        return ResponseEntity.ok(admins);
    }

    @GetMapping("/community-admin/{id}")
    public ResponseEntity<?> getCommunityAdmin(@PathVariable Long id) {
        Optional<CommunityAdmin> adminOpt = adminRepository.findById(id);
        if (adminOpt.isPresent()) {
            return ResponseEntity.ok(adminOpt.get());
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/community-admin/{id}/residents")
    public ResponseEntity<?> getResidentsByAdmin(@PathVariable Long id) {
        List<Household> households = householdRepository.findByApartmentCommunityAdminId(id);
        List<com.abhishekmandal.water_usage_backend.entity.Resident> residents = households.stream()
                .map(Household::getResident)
                .filter(Objects::nonNull)
                .toList();
        return ResponseEntity.ok(residents);
    }
}
