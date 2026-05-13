package at.mci.sw2.bug_tracking_api.user;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import at.mci.sw2.bug_tracking_api.common.AbstractCrudService;
import at.mci.sw2.bug_tracking_api.common.ResourceNotFoundException;
import at.mci.sw2.bug_tracking_api.role.Role;
import at.mci.sw2.bug_tracking_api.role.RoleRepository;
import at.mci.sw2.bug_tracking_api.user.dto.UserCreateRequest;
import at.mci.sw2.bug_tracking_api.user.dto.UserResponse;
import at.mci.sw2.bug_tracking_api.user.dto.UserUpdateRequest;

import java.util.List;

@Service
public class UserService extends AbstractCrudService<User, Long> {

    private final UserRepository repo;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository repo, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        super(repo);
        this.repo = repo;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponse create(UserCreateRequest request) {
        User user = new User();
        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setDisplayName(request.displayName());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole(request.roleId() != null ? getRole(request.roleId()) : null);

        return toResponse(repo.save(user));
    }

    public List<UserResponse> getAllUsers() {
        return repo.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public UserResponse getUserById(Long id) {
        return toResponse(getById(id));
    }

    public UserResponse update(Long id, UserUpdateRequest request) {
        User existing = getById(id);

        if (request.username() != null) {
            existing.setUsername(request.username());
        }
        if (request.email() != null) {
            existing.setEmail(request.email());
        }
        if (request.displayName() != null) {
            existing.setDisplayName(request.displayName());
        }
        if (request.active() != null) {
            existing.setActive(request.active());
        }
        if (request.roleId() != null) {
            existing.setRole(getRole(request.roleId()));
        }

        return toResponse(repo.save(existing));
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

    private Role getRole(Long id) {
        return roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role with id " + id + " not found"));
    }

    private UserResponse toResponse(User user) {
        Role role = user.getRole();

        return new UserResponse(
                user.getUserId(),
                user.getUsername(),
                user.getEmail(),
                user.getDisplayName(),
                user.isActive(),
                role != null ? role.getRoleId() : null,
                role != null ? role.getRoleName() : null);
    }
}
