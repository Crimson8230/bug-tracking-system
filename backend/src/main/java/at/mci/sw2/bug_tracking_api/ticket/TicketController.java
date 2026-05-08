package at.mci.sw2.bug_tracking_api.ticket;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/tickets")
public class TicketController {
    @PostMapping
    public Ticket createTicket(@RequestBody Ticket ticket) {
        return ticket;
    }
}
