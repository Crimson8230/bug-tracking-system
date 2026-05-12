package at.mci.sw2.bug_tracking_api.attachment;

import org.springframework.data.jpa.repository.JpaRepository;
import at.mci.sw2.bug_tracking_api.ticket.Ticket;
import java.util.List;

public interface AttachmentRepository extends JpaRepository<Attachment, Long> {
    List<Attachment> findByTicket(Ticket ticket);
}