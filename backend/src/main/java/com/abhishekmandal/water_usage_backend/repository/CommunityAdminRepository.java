package com.abhishekmandal.water_usage_backend.repository;

import com.abhishekmandal.water_usage_backend.entity.CommunityAdmin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommunityAdminRepository extends JpaRepository<CommunityAdmin, Long> {
    List<CommunityAdmin> findByVerificationStatus(String status);
    List<CommunityAdmin> findByVerificationStatusNot(String status);
}
