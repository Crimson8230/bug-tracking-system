package at.mci.sw2.bug_tracking_api.attachment;

import at.mci.sw2.bug_tracking_api.common.AbstractCrudService;
import at.mci.sw2.bug_tracking_api.common.ResourceNotFoundException;
import at.mci.sw2.bug_tracking_api.ticket.Ticket;
import at.mci.sw2.bug_tracking_api.ticket.TicketRepository;
import at.mci.sw2.bug_tracking_api.user.User;
import at.mci.sw2.bug_tracking_api.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class AttachmentService extends AbstractCrudService<Attachment, Long> {

    private final AttachmentRepository attachmentRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    public AttachmentService(AttachmentRepository attachmentRepository,
            TicketRepository ticketRepository,
            UserRepository userRepository) {
        super(attachmentRepository);
        this.attachmentRepository = attachmentRepository;
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
    }

    public Attachment uploadAttachment(Long ticketId, Long userId, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File must not be empty");
        }

        Ticket ticket = getTicket(ticketId);
        User user = getUser(userId);

        Attachment attachment = new Attachment();
        attachment.setFilename(resolveFilename(file));
        attachment.setFileType(file.getContentType());
        attachment.setFileSize(file.getSize());
        attachment.setTicket(ticket);
        attachment.setUploadedBy(user);

        return attachmentRepository.save(attachment);
    }

    public List<Attachment> getAttachmentsByTicket(Long ticketId) {
        Ticket ticket = getTicket(ticketId);
        return attachmentRepository.findByTicket(ticket);
    }

    @Override
    public Attachment update(Long id, Attachment updatedAttachment) {
        Attachment existing = getById(id);

        if (updatedAttachment.getFilename() != null) {
            existing.setFilename(updatedAttachment.getFilename());
        }
        if (updatedAttachment.getFileType() != null) {
            existing.setFileType(updatedAttachment.getFileType());
        }
        if (updatedAttachment.getFileSize() != null) {
            existing.setFileSize(updatedAttachment.getFileSize());
        }
        if (updatedAttachment.getTicket() != null && updatedAttachment.getTicket().getTicketId() != null) {
            existing.setTicket(getTicket(updatedAttachment.getTicket().getTicketId()));
        }
        if (updatedAttachment.getUploadedBy() != null && updatedAttachment.getUploadedBy().getUserId() != null) {
            existing.setUploadedBy(getUser(updatedAttachment.getUploadedBy().getUserId()));
        }

        return attachmentRepository.save(existing);
    }

    private Ticket getTicket(Long ticketId) {
        return ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket with id " + ticketId + " not found"));
    }

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User with id " + userId + " not found"));
    }

    private String resolveFilename(MultipartFile file) {
        String originalFilename = file.getOriginalFilename();
        String filename = StringUtils.cleanPath(StringUtils.hasText(originalFilename)
                ? originalFilename
                : "attachment");

        if (!StringUtils.hasText(filename)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Filename must not be empty");
        }

        return filename;
    }
}
