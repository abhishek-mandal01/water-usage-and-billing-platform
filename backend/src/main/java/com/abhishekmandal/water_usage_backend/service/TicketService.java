package com.abhishekmandal.water_usage_backend.service;

import com.abhishekmandal.water_usage_backend.dto.TicketRequestDTO;
import com.abhishekmandal.water_usage_backend.dto.TicketResponseDTO;
import com.abhishekmandal.water_usage_backend.entity.AppUser;
import com.abhishekmandal.water_usage_backend.entity.Household;
import com.abhishekmandal.water_usage_backend.entity.Ticket;
import com.abhishekmandal.water_usage_backend.entity.Notification;
import com.abhishekmandal.water_usage_backend.entity.enums.TicketLevel;
import com.abhishekmandal.water_usage_backend.entity.enums.TicketStatus;
import com.abhishekmandal.water_usage_backend.repository.HouseholdRepository;
import com.abhishekmandal.water_usage_backend.repository.TicketRepository;
import com.abhishekmandal.water_usage_backend.repository.UserRepository;
import com.abhishekmandal.water_usage_backend.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HouseholdRepository householdRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    public TicketResponseDTO createTicket(TicketRequestDTO request) {
        AppUser user = userRepository.findById(request.getRaisedById())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Ticket ticket = new Ticket();
        ticket.setTitle(request.getTitle());
        ticket.setDescription(request.getDescription());
        ticket.setRaisedBy(user);
        ticket.setStatus(TicketStatus.OPEN);

        if ("RESIDENT".equals(user.getRole())) {
            ticket.setTicketLevel(TicketLevel.RESIDENT_TO_COMMUNITY);
            Household household = householdRepository.findByResidentId(user.getId())
                    .orElseThrow(() -> new RuntimeException("Household not found for resident"));
            ticket.setAssignedToId(household.getApartment().getCommunityAdmin().getId());
        } else if ("COMMUNITY_ADMIN".equals(user.getRole()) || "ADMIN".equals(user.getRole())) {
            ticket.setTicketLevel(TicketLevel.COMMUNITY_TO_MAIN);
            ticket.setAssignedToId(null); // Assigned to System/Main Admin generally
        } else {
            throw new RuntimeException("Main Admin cannot raise tickets.");
        }

        Ticket saved = ticketRepository.save(ticket);
        return mapToDTO(saved);
    }

    public List<TicketResponseDTO> getMyTickets(Long userId) {
        return ticketRepository.findByRaisedByIdOrderByCreatedAtDesc(userId)
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<TicketResponseDTO> getAssignedTickets(Long adminId) {
        AppUser admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if ("MAIN_ADMIN".equals(admin.getRole())) {
            return ticketRepository.findForMainAdmin(TicketLevel.COMMUNITY_TO_MAIN)
                    .stream().map(this::mapToDTO).collect(Collectors.toList());
        } else if ("COMMUNITY_ADMIN".equals(admin.getRole()) || "ADMIN".equals(admin.getRole())) {
            return ticketRepository.findByAssignedToIdOrderByCreatedAtDesc(adminId)
                    .stream().map(this::mapToDTO).collect(Collectors.toList());
        }
        return List.of();
    }

    public TicketResponseDTO forwardTicketToMainAdmin(Long ticketId, String reason) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        ticket.setForwardedToMainAdmin(true);
        if (reason != null && !reason.trim().isEmpty()) {
            ticket.setForwardedReason(reason);
        }
        if (ticket.getStatus() == TicketStatus.OPEN) {
            ticket.setStatus(TicketStatus.IN_PROGRESS);
        }
        Ticket saved = ticketRepository.save(ticket);

        // Notify resident that ticket was escalated/forwarded to Main Admin Tech Support
        Notification notif = new Notification();
        notif.setRecipient(ticket.getRaisedBy());
        notif.setTitle("Ticket Escalated to Technical Support");
        notif.setMessage("Your support concern #" + ticket.getId() + " has been forwarded to the Main Admin Technical Support team.");
        notif.setType("INFO");
        notificationRepository.save(notif);

        return mapToDTO(saved);
    }

    public void updateTicketStatus(Long ticketId, TicketStatus newStatus) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        ticket.setStatus(newStatus);
        ticketRepository.save(ticket);

        // Notify resident of the status change
        Notification notif = new Notification();
        notif.setRecipient(ticket.getRaisedBy());
        notif.setTitle("Ticket Status Updated");
        notif.setMessage("Your support ticket #" + ticket.getId() + " status updated to " + newStatus.name());
        notif.setType("INFO");
        notificationRepository.save(notif);
    }

    private TicketResponseDTO mapToDTO(Ticket ticket) {
        TicketResponseDTO dto = new TicketResponseDTO();
        dto.setId(ticket.getId());
        dto.setTitle(ticket.getTitle());
        dto.setDescription(ticket.getDescription());
        dto.setStatus(ticket.getStatus().name());
        dto.setLevel(ticket.getTicketLevel().name());
        dto.setRaisedByName(ticket.getRaisedBy() != null ? ticket.getRaisedBy().getName() : "N/A");
        dto.setRaisedByRole(ticket.getRaisedBy() != null ? ticket.getRaisedBy().getRole() : "UNKNOWN");
        dto.setForwardedToMainAdmin(ticket.getForwardedToMainAdmin() != null ? ticket.getForwardedToMainAdmin() : false);
        dto.setForwardedReason(ticket.getForwardedReason());
        dto.setCreatedAt(ticket.getCreatedAt());
        return dto;
    }

    public List<TicketResponseDTO> getAllTickets() {
        return ticketRepository.findForMainAdmin(TicketLevel.COMMUNITY_TO_MAIN)
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }
}
