package at.mci.sw2.bug_tracking_api.attachment;

import at.mci.sw2.bug_tracking_api.ticket.Ticket;
import at.mci.sw2.bug_tracking_api.user.User;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "attachment")
@Data
public class Attachment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "attachment_id")
    private Long attachmentId;

    @Column(nullable = false)
    private String filename;

    @Column(name = "filetype")
    private String fileType;

    @Column(name = "filesize")
    private Long fileSize;

    @ManyToOne
    @JoinColumn(name = "ticket_id", nullable = false)
    private Ticket ticket;

    @ManyToOne
    @JoinColumn(name = "uploaded_by", nullable = false)
    private User uploadedBy;
}