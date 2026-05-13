package at.mci.sw2.bug_tracking_api.ticket.dto;

import at.mci.sw2.bug_tracking_api.ticket.TicketPriority;
import at.mci.sw2.bug_tracking_api.ticket.TicketStatus;

import java.time.LocalDateTime;

public record TicketResponse(
        Long ticketId,
        String title,
        String description,
        TicketStatus.Status status,
        TicketPriority.Priority priority,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        Long reportedById,
        String reportedByUsername,
        Long assignedToId,
        String assignedToUsername,
        Long categoryId,
        String categoryName,
        Long parentTicketId) {
}
