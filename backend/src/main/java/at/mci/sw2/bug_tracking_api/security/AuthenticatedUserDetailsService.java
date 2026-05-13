package at.mci.sw2.bug_tracking_api.security;

import at.mci.sw2.bug_tracking_api.role.Role;
import at.mci.sw2.bug_tracking_api.user.User;
import at.mci.sw2.bug_tracking_api.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthenticatedUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPasswordHash() != null ? user.getPasswordHash() : "")
                .authorities(List.of(new SimpleGrantedAuthority(toAuthority(user.getRole()))))
                .disabled(!user.isActive())
                .build();
    }

    private String toAuthority(Role role) {
        if (role == null || role.getRoleName() == null || role.getRoleName().isBlank()) {
            return "ROLE_USER";
        }

        String roleName = role.getRoleName().trim().toUpperCase();
        return roleName.startsWith("ROLE_") ? roleName : "ROLE_" + roleName;
    }
}
