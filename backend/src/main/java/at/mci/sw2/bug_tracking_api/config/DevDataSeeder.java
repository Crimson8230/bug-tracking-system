package at.mci.sw2.bug_tracking_api.config;

import at.mci.sw2.bug_tracking_api.category.Category;
import at.mci.sw2.bug_tracking_api.category.CategoryRepository;
import at.mci.sw2.bug_tracking_api.role.Role;
import at.mci.sw2.bug_tracking_api.role.RoleRepository;
import at.mci.sw2.bug_tracking_api.user.User;
import at.mci.sw2.bug_tracking_api.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Profile("dev")
@RequiredArgsConstructor
public class DevDataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.dev.admin.username:admin}")
    private String adminUsername;

    @Value("${app.dev.admin.email:admin@example.com}")
    private String adminEmail;

    @Value("${app.dev.admin.display-name:Admin}")
    private String adminDisplayName;

    @Value("${app.dev.admin.password:admin123}")
    private String adminPassword;

    @Override
    public void run(String... args) {
        Role adminRole = createRoleIfMissing("ADMIN");
        createRoleIfMissing("USER");

        createAdminIfMissing(adminRole);
        createCategoryIfMissing("General");
    }

    private Role createRoleIfMissing(String roleName) {
        return roleRepository.findByRoleName(roleName)
                .orElseGet(() -> {
                    Role role = new Role();
                    role.setRoleName(roleName);
                    return roleRepository.save(role);
                });
    }

    private void createAdminIfMissing(Role adminRole) {
        if (userRepository.findByUsername(adminUsername).isPresent()
                || userRepository.findByEmail(adminEmail).isPresent()) {
            return;
        }

        User admin = new User();
        admin.setUsername(adminUsername);
        admin.setEmail(adminEmail);
        admin.setDisplayName(adminDisplayName);
        admin.setPasswordHash(passwordEncoder.encode(adminPassword));
        admin.setRole(adminRole);
        admin.setActive(true);

        userRepository.save(admin);
    }

    private void createCategoryIfMissing(String categoryName) {
        categoryRepository.findByCategoryName(categoryName)
                .orElseGet(() -> {
                    Category category = new Category();
                    category.setCategoryName(categoryName);
                    return categoryRepository.save(category);
                });
    }
}
