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

import at.mci.sw2.bug_tracking_api.attachment.dto.AttachmentResponse;
import at.mci.sw2.bug_tracking_api.attachment.dto.AttachmentUpdateRequest;
import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Attachments", description = "Manage ticket attachments")
@RestController
@RequestMapping("/api/v1/attachments")
@RequiredArgsConstructor
@Slf4j
public class AttachmentController {

    private final AttachmentService attachmentService;

    @GetMapping
    @Operation(summary = "Get all attachments", description = "Retrieve a list of all attachments.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Attachments retrieved")
    })
    public ResponseEntity<List<AttachmentResponse>> getAll() {
        log.info("GET all attachments");
        return ResponseEntity.ok(attachmentService.getAllAttachments());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get attachment by ID", description = "Retrieve a specific attachment by its ID.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Attachment found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Attachment not found")
    })
    public ResponseEntity<AttachmentResponse> getById(@PathVariable Long id) {
        log.info("GET attachment by id: {}", id);
        return ResponseEntity.ok(attachmentService.getAttachmentById(id));
    }

    @PostMapping(path = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload a new attachment", description = "Upload a new attachment for a specific ticket.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Attachment created"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request data")
    })
    public ResponseEntity<AttachmentResponse> upload(
            @RequestParam Long ticketId,
            @RequestParam Long userId,
            @RequestParam("file") MultipartFile file) {
        log.info("POST upload attachment for ticket: {}, user: {}", ticketId, userId);
        AttachmentResponse attachment = attachmentService.uploadAttachmentResponse(ticketId, userId, file);
        return ResponseEntity.status(HttpStatus.CREATED).body(attachment);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an attachment", description = "Update the details of an existing attachment.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Attachment updated"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request data"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Attachment not found")
    })
    public ResponseEntity<AttachmentResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody AttachmentUpdateRequest request) {
        log.info("PUT update attachment with id: {}", id);
        return ResponseEntity.ok(attachmentService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an attachment", description = "Delete an existing attachment.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "Attachment deleted"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Attachment not found")
    })
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("DELETE attachment with id: {}", id);
        attachmentService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
