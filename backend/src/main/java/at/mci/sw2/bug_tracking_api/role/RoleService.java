package at.mci.sw2.bug_tracking_api.role;

import org.springframework.stereotype.Service;
import at.mci.sw2.bug_tracking_api.common.AbstractCrudService;

@Service
public class RoleService extends AbstractCrudService<Role, Long> {

    public RoleService(RoleRepository repository) {
        super(repository);
    }

    public Role update(Long id, Role updated) {
        Role existing = getById(id);

        existing.setRoleName(updated.getRoleName());

        return repository.save(existing);
    }
}
