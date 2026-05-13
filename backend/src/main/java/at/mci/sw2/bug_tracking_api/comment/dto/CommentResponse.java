package at.mci.sw2.bug_tracking_api.comment.dto;

import java.time.LocalDateTime;

public record CommentResponse(
        Long commentId,
        String content,
        LocalDateTime createdAt,
        Long ticketId,
        Long userId,
        String username) {
}
