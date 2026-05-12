package at.mci.sw2.bug_tracking_api.ticket;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.Data;
import at.mci.sw2.bug_tracking_api.user.User;
import at.mci.sw2.bug_tracking_api.category.Category;

@Entity
@Table(name = "ticket")
@Data
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ticket_id")
    private Long ticketId;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    private TicketStatus.Status status;

    @Enumerated(EnumType.STRING)
    private TicketPriority.Priority priority;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "reported_by")
    private User reportedBy;

    @ManyToOne
    @JoinColumn(name = "assigned_to")
    private User assignedTo;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
}
