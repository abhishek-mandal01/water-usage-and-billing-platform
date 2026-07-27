package com.abhishekmandal.water_usage_backend.repository;

import com.abhishekmandal.water_usage_backend.entity.ResidentInvite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ResidentInviteRepository extends JpaRepository<ResidentInvite, Long> {
    Optional<ResidentInvite> findByToken(String token);
}
