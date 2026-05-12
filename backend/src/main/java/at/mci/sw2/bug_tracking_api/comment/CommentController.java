package at.mci.sw2.bug_tracking_api.comment;

import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/comments")
public class CommentController {

    private final CommentService service;

    public CommentController(CommentService service) {
        this.service = service;
    }

    @PostMapping
    public Comment create(@RequestBody Comment comment) {
        return service.create(comment);
    }

    @GetMapping
    public List<Comment> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Comment getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PutMapping("/{id}")
    public Comment update(@PathVariable Long id, @RequestBody Comment updated) {
        return service.update(id, updated);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
