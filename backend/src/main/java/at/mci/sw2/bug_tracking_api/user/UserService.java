package at.mci.sw2.bug_tracking_api.user;

import org.springframework.stereotype.Service;
import at.mci.sw2.bug_tracking_api.common.AbstractCrudService;

@Service
public class UserService extends AbstractCrudService<User, Long> {

    private final UserRepository repo;

    public UserService(UserRepository repo) {
        super(repo);
        this.repo = repo;
    }

    @Override
    public User update(Long id, User updated) {
        User existing = getById(id);

        existing.setUsername(updated.getUsername());
        existing.setEmail(updated.getEmail());
        existing.setDisplayName(updated.getDisplayName());
        existing.setActive(updated.isActive());

        return repo.save(existing);
    }
}