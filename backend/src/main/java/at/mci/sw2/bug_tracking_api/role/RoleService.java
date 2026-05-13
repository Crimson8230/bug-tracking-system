package at.mci.sw2.bug_tracking_api.role;

import org.springframework.stereotype.Service;
import at.mci.sw2.bug_tracking_api.common.AbstractCrudService;
import at.mci.sw2.bug_tracking_api.role.dto.RoleCreateRequest;
import at.mci.sw2.bug_tracking_api.role.dto.RoleResponse;
import at.mci.sw2.bug_tracking_api.role.dto.RoleUpdateRequest;

import java.util.List;

@Service
public class RoleService extends AbstractCrudService<Role, Long> {

    private final RoleRepository roleRepository;

    public RoleService(RoleRepository repository) {
        super(repository);
        this.roleRepository = repository;
    }

    public RoleResponse create(RoleCreateRequest request) {
        Role role = new Role();
        role.setRoleName(request.roleName());

        return toResponse(roleRepository.save(role));
    }

    public List<RoleResponse> getAllRoles() {
        return roleRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public RoleResponse getRoleById(Long id) {
        return toResponse(getById(id));
    }

    public RoleResponse update(Long id, RoleUpdateRequest request) {
        Role existing = getById(id);
        existing.setRoleName(request.roleName());

        return toResponse(roleRepository.save(existing));
    }

    @Override
    public Role update(Long id, Role updated) {
        Role existing = getById(id);

        existing.setRoleName(updated.getRoleName());

        return repository.save(existing);
    }

    private RoleResponse toResponse(Role role) {
        return new RoleResponse(role.getRoleId(), role.getRoleName());
    }
}
