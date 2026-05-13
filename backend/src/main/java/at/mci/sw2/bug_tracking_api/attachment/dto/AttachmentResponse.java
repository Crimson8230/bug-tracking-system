package at.mci.sw2.bug_tracking_api.attachment.dto;

import java.time.LocalDateTime;

public record AttachmentResponse(
        Long attachmentId,
        String filename,
        String fileType,
        Long fileSize,
        String filePath,
        LocalDateTime uploadedAt,
        Long ticketId,
        Long uploadedById,
        String uploadedByUsername) {
}
