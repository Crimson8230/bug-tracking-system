package at.mci.sw2.bug_tracking_api.comment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CommentCreateRequest(
        @NotBlank(message = "Content is required")
        String content,

        @NotNull(message = "Ticket is required")
        Long ticketId,

        @NotNull(message = "User is required")
        Long userId) {
}
