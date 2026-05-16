package at.mci.sw2.bug_tracking_api.comment;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import at.mci.sw2.bug_tracking_api.comment.dto.CommentCreateRequest;
import at.mci.sw2.bug_tracking_api.comment.dto.CommentResponse;
import at.mci.sw2.bug_tracking_api.comment.dto.CommentUpdateRequest;
import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Comments", description = "Manage ticket comments")
@RestController
@RequestMapping("/api/v1/comments")
public class CommentController {

    private final CommentService service;

    public CommentController(CommentService service) {
        this.service = service;
    }

    @PostMapping
    @Operation(summary = "Create a new comment", description = "Create a new comment with the provided details.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Resource created"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request data")
    })
    public ResponseEntity<CommentResponse> create(@Valid @RequestBody CommentCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    @GetMapping
    @Operation(summary = "Get all comments", description = "Retrieve a list of all comments.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Comments retrieved")
    })
    public ResponseEntity<List<CommentResponse>> getAll() {
        return ResponseEntity.ok(service.getAllComments());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get comment by ID", description = "Retrieve a specific comment by its ID.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Comment found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Comment not found")
    })
    public ResponseEntity<CommentResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getCommentById(id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a comment", description = "Update the details of an existing comment.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Comment updated"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request data"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Comment not found")
    })
    public ResponseEntity<CommentResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody CommentUpdateRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a comment", description = "Delete an existing comment.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "Comment deleted"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Comment not found")
    })
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
