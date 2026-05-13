package at.mci.sw2.bug_tracking_api.attachment;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/attachments")
@RequiredArgsConstructor
@Slf4j
public class AttachmentController {

    private final AttachmentService attachmentService;

    @GetMapping
    public ResponseEntity<List<Attachment>> getAll() {
        log.info("GET all attachments");
        return ResponseEntity.ok(attachmentService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Attachment> getById(@PathVariable Long id) {
        log.info("GET attachment by id: {}", id);
        return ResponseEntity.ok(attachmentService.getById(id));
    }

    @PostMapping(path = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Attachment> upload(
            @RequestParam Long ticketId,
            @RequestParam Long userId,
            @RequestParam("file") MultipartFile file) {
        log.info("POST upload attachment for ticket: {}, user: {}", ticketId, userId);
        Attachment attachment = attachmentService.uploadAttachment(ticketId, userId, file);
        return ResponseEntity.status(HttpStatus.CREATED).body(attachment);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Attachment> update(@PathVariable Long id, @RequestBody Attachment attachment) {
        log.info("PUT update attachment with id: {}", id);
        return ResponseEntity.ok(attachmentService.update(id, attachment));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("DELETE attachment with id: {}", id);
        attachmentService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
