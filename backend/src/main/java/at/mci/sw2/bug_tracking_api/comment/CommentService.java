package at.mci.sw2.bug_tracking_api.comment;

import org.springframework.stereotype.Service;
import at.mci.sw2.bug_tracking_api.common.ResourceNotFoundException;
import at.mci.sw2.bug_tracking_api.common.AbstractCrudService;
import at.mci.sw2.bug_tracking_api.ticket.Ticket;
import at.mci.sw2.bug_tracking_api.ticket.TicketRepository;
import at.mci.sw2.bug_tracking_api.user.User;
import at.mci.sw2.bug_tracking_api.user.UserRepository;

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
}
