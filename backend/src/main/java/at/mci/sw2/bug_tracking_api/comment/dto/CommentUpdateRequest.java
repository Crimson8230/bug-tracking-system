package at.mci.sw2.bug_tracking_api.comment.dto;

public record CommentUpdateRequest(
        String content,
        Long ticketId,
        Long userId) {
}
