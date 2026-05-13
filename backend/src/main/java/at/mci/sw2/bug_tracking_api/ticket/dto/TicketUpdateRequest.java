package at.mci.sw2.bug_tracking_api.ticket.dto;

import at.mci.sw2.bug_tracking_api.ticket.TicketPriority;
import at.mci.sw2.bug_tracking_api.ticket.TicketStatus;
import jakarta.validation.constraints.Size;

public record TicketUpdateRequest(
        String title,

        @Size(max = 1000, message = "Description must be at most 1000 characters") String description,

        TicketStatus.Status status,

        TicketPriority.Priority priority,

        Long assignedToId,

        Long categoryId,

        Long parentTicketId) {
}
