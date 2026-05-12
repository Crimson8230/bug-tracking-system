package at.mci.sw2.bug_tracking_api.ticket;

import org.springframework.stereotype.Service;
import at.mci.sw2.bug_tracking_api.common.AbstractCrudService;

@Service
public class TicketService extends AbstractCrudService<Ticket, Long> {

    public TicketService(TicketRepository repository) {
        super(repository);
    }

    public Ticket update(Long id, Ticket updated) {
        Ticket existing = getById(id);

        existing.setTitle(updated.getTitle());
        existing.setDescription(updated.getDescription());

        return repository.save(existing);
    }
}