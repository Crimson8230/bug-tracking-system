package at.mci.sw2.bug_tracking_api.comment;

import org.springframework.stereotype.Service;
import at.mci.sw2.bug_tracking_api.common.ResourceNotFoundException;
import at.mci.sw2.bug_tracking_api.common.AbstractCrudService;
import at.mci.sw2.bug_tracking_api.comment.dto.CommentCreateRequest;
import at.mci.sw2.bug_tracking_api.comment.dto.CommentResponse;
import at.mci.sw2.bug_tracking_api.comment.dto.CommentUpdateRequest;
import at.mci.sw2.bug_tracking_api.ticket.Ticket;
import at.mci.sw2.bug_tracking_api.ticket.TicketRepository;
import at.mci.sw2.bug_tracking_api.user.User;
import at.mci.sw2.bug_tracking_api.user.UserRepository;

import java.util.List;

@Service
public class CommentService extends AbstractCrudService<Comment, Long> {

    private final CommentRepository commentRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    public CommentService(CommentRepository commentRepository,
            TicketRepository ticketRepository,
            UserRepository userRepository) {
        super(commentRepository);
        this.commentRepository = commentRepository;
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
    }

    public CommentResponse create(CommentCreateRequest request) {
        Comment comment = new Comment();
        comment.setContent(request.content());
        comment.setTicket(getTicket(request.ticketId()));
        comment.setUser(getUser(request.userId()));

        return toResponse(commentRepository.save(comment));
    }

    public List<CommentResponse> getAllComments() {
        return commentRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public CommentResponse getCommentById(Long id) {
        return toResponse(getById(id));
    }

    public CommentResponse update(Long id, CommentUpdateRequest request) {
        Comment existing = getById(id);

        if (request.content() != null) {
            existing.setContent(request.content());
        }
        if (request.ticketId() != null) {
            existing.setTicket(getTicket(request.ticketId()));
        }
        if (request.userId() != null) {
            existing.setUser(getUser(request.userId()));
        }

        return toResponse(commentRepository.save(existing));
    }

    @Override
    public Comment update(Long id, Comment updated) {
        Comment existing = getById(id);

        existing.setContent(updated.getContent());

        if (updated.getTicket() != null && updated.getTicket().getTicketId() != null) {
            existing.setTicket(getTicket(updated.getTicket().getTicketId()));
        }
        if (updated.getUser() != null && updated.getUser().getUserId() != null) {
            existing.setUser(getUser(updated.getUser().getUserId()));
        }

        return commentRepository.save(existing);
    }

    private Ticket getTicket(Long ticketId) {
        return ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket with id " + ticketId + " not found"));
    }

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User with id " + userId + " not found"));
    }

    private CommentResponse toResponse(Comment comment) {
        Ticket ticket = comment.getTicket();
        User user = comment.getUser();

        return new CommentResponse(
                comment.getCommentId(),
                comment.getContent(),
                comment.getCreatedAt(),
                ticket != null ? ticket.getTicketId() : null,
                user != null ? user.getUserId() : null,
                user != null ? user.getUsername() : null);
    }
}
