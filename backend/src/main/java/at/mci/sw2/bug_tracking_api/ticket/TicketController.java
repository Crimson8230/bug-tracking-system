package at.mci.sw2.bug_tracking_api.ticket;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import at.mci.sw2.bug_tracking_api.attachment.Attachment;
import at.mci.sw2.bug_tracking_api.attachment.AttachmentService;

@RestController
@RequestMapping("/api/v1/tickets")
public class TicketController {
    private final TicketService service;
    private final AttachmentService attachmentService;

    public TicketController(TicketService service, AttachmentService attachmentService) {
        this.service = service;
        this.attachmentService = attachmentService;
    }

    @PostMapping
    public ResponseEntity<Ticket> create(@RequestBody Ticket ticket) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(ticket));
    }

    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ticket> update(@PathVariable Long id, @RequestBody Ticket updated) {
        return ResponseEntity.ok(service.update(id, updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{ticketId}/attachments")
    public ResponseEntity<List<Attachment>> getAttachmentsByTicket(@PathVariable Long ticketId) {
        return ResponseEntity.ok(attachmentService.getAttachmentsByTicket(ticketId));
    }

}
