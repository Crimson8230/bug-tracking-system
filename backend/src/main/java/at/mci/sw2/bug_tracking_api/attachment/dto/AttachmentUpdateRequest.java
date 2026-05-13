package at.mci.sw2.bug_tracking_api.attachment.dto;

public record AttachmentUpdateRequest(
        String filename,
        String fileType,
        Long fileSize,
        String filePath,
        Long ticketId,
        Long uploadedById) {
}
