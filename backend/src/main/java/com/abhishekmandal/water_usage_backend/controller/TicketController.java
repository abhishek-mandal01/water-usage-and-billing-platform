package com.abhishekmandal.water_usage_backend.controller;

import com.abhishekmandal.water_usage_backend.dto.TicketRequestDTO;
import com.abhishekmandal.water_usage_backend.entity.enums.TicketStatus;
import com.abhishekmandal.water_usage_backend.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @PostMapping
    public ResponseEntity<?> createTicket(@RequestBody TicketRequestDTO request) {
        return ResponseEntity.ok(ticketService.createTicket(request));
    }

    @GetMapping("/my/{userId}")
    public ResponseEntity<?> getMyTickets(@PathVariable Long userId) {
        return ResponseEntity.ok(ticketService.getMyTickets(userId));
    }

    @GetMapping("/assigned/{adminId}")
    public ResponseEntity<?> getAssignedTickets(@PathVariable Long adminId) {
        return ResponseEntity.ok(ticketService.getAssignedTickets(adminId));
    }

    @PutMapping("/{ticketId}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long ticketId, @RequestParam TicketStatus status) {
        ticketService.updateTicketStatus(ticketId, status);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{ticketId}/forward")
    public ResponseEntity<?> forwardTicket(@PathVariable Long ticketId, @RequestParam(required = false) String reason) {
        return ResponseEntity.ok(ticketService.forwardTicketToMainAdmin(ticketId, reason));
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }
}
