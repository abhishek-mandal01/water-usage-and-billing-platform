package com.abhishekmandal.water_usage_backend.repository;

import com.abhishekmandal.water_usage_backend.entity.Ticket;
import com.abhishekmandal.water_usage_backend.entity.enums.TicketLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByRaisedByIdOrderByCreatedAtDesc(Long userId);
    List<Ticket> findByAssignedToIdOrderByCreatedAtDesc(Long adminId);
    List<Ticket> findByTicketLevelOrderByCreatedAtDesc(TicketLevel level);

    @Query("SELECT t FROM Ticket t WHERE t.ticketLevel = :level OR t.forwardedToMainAdmin = true ORDER BY t.createdAt DESC")
    List<Ticket> findForMainAdmin(@Param("level") TicketLevel level);
}
