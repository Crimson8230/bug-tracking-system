package at.mci.sw2.bug_tracking_api.ticket;

import org.springframework.stereotype.Service;
import at.mci.sw2.bug_tracking_api.common.AbstractCrudService;
import at.mci.sw2.bug_tracking_api.common.ResourceNotFoundException;
import at.mci.sw2.bug_tracking_api.category.Category;
import at.mci.sw2.bug_tracking_api.category.CategoryRepository;
import at.mci.sw2.bug_tracking_api.ticket.dto.TicketCreateRequest;
import at.mci.sw2.bug_tracking_api.ticket.dto.TicketResponse;
import at.mci.sw2.bug_tracking_api.ticket.dto.TicketUpdateRequest;
import at.mci.sw2.bug_tracking_api.user.User;
import at.mci.sw2.bug_tracking_api.user.UserRepository;

import java.util.List;

@Service
public class TicketService extends AbstractCrudService<Ticket, Long> {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    public TicketService(TicketRepository repository,
            UserRepository userRepository,
            CategoryRepository categoryRepository) {
        super(repository);
        this.ticketRepository = repository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
    }

    public TicketResponse create(TicketCreateRequest request) {
        Ticket ticket = new Ticket();

        ticket.setTitle(request.title());
        ticket.setDescription(request.description());
        ticket.setPriority(request.priority() != null
                ? request.priority()
                : TicketPriority.Priority.MEDIUM);
        ticket.setReportedBy(getUser(request.reportedById()));
        ticket.setAssignedTo(request.assignedToId() != null
                ? getUser(request.assignedToId())
                : null);
        ticket.setCategory(getCategory(request.categoryId()));
        ticket.setParentTicket(request.parentTicketId() != null
                ? getTicket(request.parentTicketId())
                : null);

        return toResponse(ticketRepository.save(ticket));
    }

    public List<TicketResponse> getAllTickets() {
        return ticketRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public TicketResponse getTicketById(Long id) {
        return toResponse(getTicket(id));
    }

    public TicketResponse update(Long id, TicketUpdateRequest request) {
        Ticket existing = getTicket(id);

        if (request.title() != null) {
            existing.setTitle(request.title());
        }
        if (request.description() != null) {
            existing.setDescription(request.description());
        }
        if (request.status() != null) {
            if (!existing.getStatus().canTransitionTo(request.status())) {
                throw new IllegalArgumentException("Invalid status transition");
            }
            existing.setStatus(request.status());
        }
        if (request.priority() != null) {
            existing.setPriority(request.priority());
        }
        if (request.assignedToId() != null) {
            existing.setAssignedTo(getUser(request.assignedToId()));
        }
        if (request.categoryId() != null) {
            existing.setCategory(getCategory(request.categoryId()));
        }
        if (request.parentTicketId() != null) {
            existing.setParentTicket(getTicket(request.parentTicketId()));
        }

        return toResponse(ticketRepository.save(existing));
    }

    @Override
    public Ticket update(Long id, Ticket updated) {
        Ticket existing = getById(id);

        existing.setTitle(updated.getTitle());
        existing.setDescription(updated.getDescription());

        return repository.save(existing);
    }

    private Ticket getTicket(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket with id " + id + " not found"));
    }

    private User getUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User with id " + id + " not found"));
    }

    private Category getCategory(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category with id " + id + " not found"));
    }

    private TicketResponse toResponse(Ticket ticket) {
        User reportedBy = ticket.getReportedBy();
        User assignedTo = ticket.getAssignedTo();
        Category category = ticket.getCategory();
        Ticket parentTicket = ticket.getParentTicket();

        return new TicketResponse(
                ticket.getTicketId(),
                ticket.getTitle(),
                ticket.getDescription(),
                ticket.getStatus(),
                ticket.getPriority(),
                ticket.getCreatedAt(),
                ticket.getUpdatedAt(),
                reportedBy != null ? reportedBy.getUserId() : null,
                reportedBy != null ? reportedBy.getUsername() : null,
                assignedTo != null ? assignedTo.getUserId() : null,
                assignedTo != null ? assignedTo.getUsername() : null,
                category != null ? category.getCategoryId() : null,
                category != null ? category.getCategoryName() : null,
                parentTicket != null ? parentTicket.getTicketId() : null);
    }
}
