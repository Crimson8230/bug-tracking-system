package at.mci.sw2.bug_tracking_api.attachment;

import at.mci.sw2.bug_tracking_api.common.AbstractCrudService;
import at.mci.sw2.bug_tracking_api.common.ResourceNotFoundException;
import at.mci.sw2.bug_tracking_api.attachment.dto.AttachmentResponse;
import at.mci.sw2.bug_tracking_api.attachment.dto.AttachmentUpdateRequest;
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
        String filename = resolveFilename(file);
        attachment.setFilename(filename);
        attachment.setFileType(file.getContentType());
        attachment.setFileSize(file.getSize());
        attachment.setFilePath("uploads/" + filename);
        attachment.setTicket(ticket);
        attachment.setUploadedBy(user);

        return attachmentRepository.save(attachment);
    }

    public AttachmentResponse uploadAttachmentResponse(Long ticketId, Long userId, MultipartFile file) {
        return toResponse(uploadAttachment(ticketId, userId, file));
    }

    public List<AttachmentResponse> getAllAttachments() {
        return attachmentRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public AttachmentResponse getAttachmentById(Long id) {
        return toResponse(getById(id));
    }

    public List<AttachmentResponse> getAttachmentResponsesByTicket(Long ticketId) {
        Ticket ticket = getTicket(ticketId);
        return attachmentRepository.findByTicket(ticket).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<Attachment> getAttachmentsByTicket(Long ticketId) {
        Ticket ticket = getTicket(ticketId);
        return attachmentRepository.findByTicket(ticket);
    }

    public AttachmentResponse update(Long id, AttachmentUpdateRequest request) {
        Attachment existing = getById(id);

        if (request.filename() != null) {
            existing.setFilename(request.filename());
        }
        if (request.fileType() != null) {
            existing.setFileType(request.fileType());
        }
        if (request.fileSize() != null) {
            existing.setFileSize(request.fileSize());
        }
        if (request.filePath() != null) {
            existing.setFilePath(request.filePath());
        }
        if (request.ticketId() != null) {
            existing.setTicket(getTicket(request.ticketId()));
        }
        if (request.uploadedById() != null) {
            existing.setUploadedBy(getUser(request.uploadedById()));
        }

        return toResponse(attachmentRepository.save(existing));
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

    private AttachmentResponse toResponse(Attachment attachment) {
        Ticket ticket = attachment.getTicket();
        User uploadedBy = attachment.getUploadedBy();

        return new AttachmentResponse(
                attachment.getAttachmentId(),
                attachment.getFilename(),
                attachment.getFileType(),
                attachment.getFileSize(),
                attachment.getFilePath(),
                attachment.getUploadedAt(),
                ticket != null ? ticket.getTicketId() : null,
                uploadedBy != null ? uploadedBy.getUserId() : null,
                uploadedBy != null ? uploadedBy.getUsername() : null);
    }
}
