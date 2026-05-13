package at.mci.sw2.bug_tracking_api.ticket.dto;

import at.mci.sw2.bug_tracking_api.ticket.TicketPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record TicketCreateRequest(
        @NotBlank(message = "Title is required") String title,

        @Size(max = 1000, message = "Description must be at most 1000 characters") String description,

        TicketPriority.Priority priority,

        @NotNull(message = "Reporter is required") Long reportedById,

        Long assignedToId,

        @NotNull(message = "Category is required") Long categoryId,

        Long parentTicketId) {
}
