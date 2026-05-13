package at.mci.sw2.bug_tracking_api.attachment;

import java.time.LocalDateTime;
import at.mci.sw2.bug_tracking_api.ticket.Ticket;
import at.mci.sw2.bug_tracking_api.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "attachment")
@Getter
@Setter
@NoArgsConstructor
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

    @Column(name = "file_path", nullable = false)
    private String filePath;

    @ManyToOne
    @JoinColumn(name = "ticket_id", nullable = false)
    private Ticket ticket;

    @ManyToOne
    @JoinColumn(name = "uploaded_by", nullable = false)
    private User uploadedBy;

    @Column(name = "uploaded_at", nullable = false)
    private LocalDateTime uploadedAt;

    @PrePersist
    void onCreate() {
        uploadedAt = LocalDateTime.now();
    }
}