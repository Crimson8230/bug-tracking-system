package at.mci.sw2.bug_tracking_api.ticket;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "ticket")
@Data
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ticket_id;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    private TicketStatus.Status status;

    @Enumerated(EnumType.STRING)
    private TicketPriority.Priority priority;

    @Column(nullable = false)
    private LocalDateTime created_at;

    @Column
    private LocalDateTime updated_at;
}
