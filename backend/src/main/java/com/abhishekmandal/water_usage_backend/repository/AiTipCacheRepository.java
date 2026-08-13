package com.abhishekmandal.water_usage_backend.repository;

import com.abhishekmandal.water_usage_backend.entity.AiTipCache;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface AiTipCacheRepository extends JpaRepository<AiTipCache, Long> {
    Optional<AiTipCache> findByUserIdAndGeneratedDate(Long userId, LocalDate generatedDate);
}
