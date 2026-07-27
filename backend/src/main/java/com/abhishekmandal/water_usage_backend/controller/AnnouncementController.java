package com.abhishekmandal.water_usage_backend.controller;

import com.abhishekmandal.water_usage_backend.entity.Announcement;
import com.abhishekmandal.water_usage_backend.entity.Notification;
import com.abhishekmandal.water_usage_backend.entity.Household;
import com.abhishekmandal.water_usage_backend.repository.AnnouncementRepository;
import com.abhishekmandal.water_usage_backend.repository.HouseholdRepository;
import com.abhishekmandal.water_usage_backend.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/announcements")
public class AnnouncementController {

    @Autowired
    private AnnouncementRepository announcementRepository;

    @Autowired
    private HouseholdRepository householdRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @PostMapping
    public ResponseEntity<?> createAnnouncement(@RequestBody Announcement announcement) {
        if (announcement.getTitle() == null || announcement.getMessage() == null) {
            return ResponseEntity.badRequest().body("Title and message are required.");
        }
        Announcement saved = announcementRepository.save(announcement);

        // Notify all residents under this community admin
        List<Household> households = householdRepository.findByApartmentCommunityAdminId(announcement.getCommunityAdminId());
        for (Household hh : households) {
            if (hh.getResident() != null) {
                Notification notif = new Notification();
                notif.setRecipient(hh.getResident());
                notif.setTitle(announcement.getTitle());
                notif.setMessage(announcement.getMessage());
                notif.setType("INFO");
                notificationRepository.save(notif);
            }
        }

        return ResponseEntity.ok(saved);
    }

    @GetMapping("/community/{adminId}")
    public ResponseEntity<List<Announcement>> getCommunityAnnouncements(@PathVariable Long adminId) {
        return ResponseEntity.ok(announcementRepository.findByCommunityAdminIdOrderByCreatedAtDesc(adminId));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Announcement>> getAllAnnouncements() {
        return ResponseEntity.ok(announcementRepository.findAllByOrderByCreatedAtDesc());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAnnouncement(@PathVariable Long id) {
        if (announcementRepository.existsById(id)) {
            announcementRepository.deleteById(id);
            return ResponseEntity.ok("Deleted successfully");
        }
        return ResponseEntity.badRequest().body("Announcement not found");
    }
}
