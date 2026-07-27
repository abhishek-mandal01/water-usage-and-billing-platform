package com.abhishekmandal.water_usage_backend.repository;

import com.abhishekmandal.water_usage_backend.entity.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    List<Announcement> findByCommunityAdminIdOrderByCreatedAtDesc(Long communityAdminId);
    List<Announcement> findAllByOrderByCreatedAtDesc();
}
