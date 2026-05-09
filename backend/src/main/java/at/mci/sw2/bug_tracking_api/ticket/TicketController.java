package at.mci.sw2.bug_tracking_api.ticket;

import java.util.List;
import java.util.Set;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/tickets")
public class TicketController {
    private final TicketService service;

    public TicketController(TicketService service) {
        this.service = service;
    }

    @PostMapping
    public Ticket create(@RequestBody Ticket ticket) {
        return service.create(ticket);
    }

    @GetMapping
    public List<Ticket> getAllTickets() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Ticket getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PutMapping("/{id}")
    public Ticket update(@PathVariable Long id, @RequestBody Ticket updated) {
        return service.update(id, updated);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @GetMapping("/{id}/allowed-next-status")
    public Set<TicketStatus.Status> getAllowedStatuses(@PathVariable Long id) {
        return service.getById(id).getStatus().getNextAllowedStatuses();
    }
}
