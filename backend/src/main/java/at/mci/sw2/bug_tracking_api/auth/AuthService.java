package at.mci.sw2.bug_tracking_api.auth;

import at.mci.sw2.bug_tracking_api.auth.dto.AuthResponse;
import at.mci.sw2.bug_tracking_api.auth.dto.LoginRequest;
import at.mci.sw2.bug_tracking_api.auth.dto.RegisterRequest;
import at.mci.sw2.bug_tracking_api.common.ResourceNotFoundException;
import at.mci.sw2.bug_tracking_api.role.Role;
import at.mci.sw2.bug_tracking_api.role.RoleRepository;
import at.mci.sw2.bug_tracking_api.user.User;
import at.mci.sw2.bug_tracking_api.user.UserRepository;
import at.mci.sw2.bug_tracking_api.user.dto.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {
        User user = new User();
        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setDisplayName(request.displayName());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole(request.roleId() != null ? getRole(request.roleId()) : null);

        User saved = userRepository.save(user);
        return toAuthResponse(saved);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository
                .findByUsernameOrEmail(request.usernameOrEmail(), request.usernameOrEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        if (!user.isActive() || user.getPasswordHash() == null
                || !passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        return toAuthResponse(user);
    }

    private Role getRole(Long id) {
        return roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role with id " + id + " not found"));
    }

    private AuthResponse toAuthResponse(User user) {
        return new AuthResponse("Bearer", jwtService.generateToken(user), toUserResponse(user));
    }

    private UserResponse toUserResponse(User user) {
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
