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

}
