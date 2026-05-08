package at.mci.sw2.bug_tracking_api.ticket;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TicketService {
    private final TicketRepository repo;

    public TicketService(TicketRepository repo) {
        this.repo = repo;
    }

    public Ticket create(Ticket ticket) {
        return repo.save(ticket);
    }

    public List<Ticket> getAll() {
        return repo.findAll();
    }

    public Ticket getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
    }

    public Ticket update(Long id, Ticket updated) {
        Ticket existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        existing.setTitle(updated.getTitle());
        existing.setDescription(updated.getDescription());
        existing.setStatus(updated.getStatus());
        existing.setPriority(updated.getPriority());

        return repo.save(existing);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}