package at.mci.sw2.bug_tracking_api.ticket;

import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/tickets")
public class TicketController {
    private final TicketRepository repo;

    public TicketController(TicketRepository repo) {
        this.repo = repo;
    }

    @PostMapping
    public Ticket create(@RequestBody Ticket ticket) {
        return repo.save(ticket);
    }

    @GetMapping
    public List<Ticket> getAllTickets() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public Ticket getById(@PathVariable Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
    }

    @PutMapping("/{id}")
    public Ticket update(@PathVariable Long id, @RequestBody Ticket updated) {

        Ticket existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        existing.setTitle(updated.getTitle());
        existing.setDescription(updated.getDescription());
        existing.setStatus(updated.getStatus());
        existing.setPriority(updated.getPriority());

        return repo.save(existing);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }

}
