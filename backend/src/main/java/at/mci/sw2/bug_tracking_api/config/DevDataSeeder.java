package at.mci.sw2.bug_tracking_api.config;

import at.mci.sw2.bug_tracking_api.category.Category;
import at.mci.sw2.bug_tracking_api.category.CategoryRepository;
import at.mci.sw2.bug_tracking_api.role.Role;
import at.mci.sw2.bug_tracking_api.role.RoleRepository;
import at.mci.sw2.bug_tracking_api.ticket.Ticket;
import at.mci.sw2.bug_tracking_api.ticket.TicketPriority;
import at.mci.sw2.bug_tracking_api.ticket.TicketRepository;
import at.mci.sw2.bug_tracking_api.ticket.TicketStatus;
import at.mci.sw2.bug_tracking_api.user.User;
import at.mci.sw2.bug_tracking_api.user.UserRepository;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;

@Component
@Profile("dev")
@RequiredArgsConstructor
public class DevDataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final TicketRepository ticketRepository;
    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${app.dev.admin.username:admin}")
    private String adminUsername;

    @Value("${app.dev.admin.email:admin@example.com}")
    private String adminEmail;

    @Value("${app.dev.admin.display-name:Admin}")
    private String adminDisplayName;

    @Value("${app.dev.admin.password:admin123}")
    private String adminPassword;

    @Override
    public void run(String... args) throws IOException {
        Role adminRole = createRoleIfMissing("ADMIN");
        createRoleIfMissing("USER");

        createAdminIfMissing(adminRole);
        createCategoryIfMissing("General");

        seedDemoDataIfPresent();
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

    private void seedDemoDataIfPresent() throws IOException {
        ClassPathResource resource = new ClassPathResource("dev/demo-data.json");
        if (!resource.exists()) {
            return;
        }

        DemoData demoData = objectMapper.readValue(resource.getInputStream(), DemoData.class);
        demoData.users().forEach(this::createDemoUserIfMissing);
        demoData.categories().forEach(this::createCategoryIfMissing);
        demoData.tickets().forEach(this::createDemoTicketIfMissing);
    }

    private void createDemoUserIfMissing(DemoUser demoUser) {
        if (userRepository.findByUsername(demoUser.username()).isPresent()
                || userRepository.findByEmail(demoUser.email()).isPresent()) {
            return;
        }

        Role role = createRoleIfMissing(demoUser.role());

        User user = new User();
        user.setUsername(demoUser.username());
        user.setEmail(demoUser.email());
        user.setDisplayName(demoUser.displayName() == null ? demoUser.username() : demoUser.displayName());
        user.setPasswordHash(passwordEncoder.encode(demoUser.password()));
        user.setRole(role);
        user.setActive(true);

        userRepository.save(user);
    }

    private void createDemoTicketIfMissing(DemoTicket demoTicket) {
        if (ticketRepository.findByTitle(demoTicket.title()).isPresent()) {
            return;
        }

        User reportedBy = userRepository.findByUsername(demoTicket.createdBy())
                .orElseThrow(() -> new IllegalStateException("Missing demo ticket creator: " + demoTicket.createdBy()));
        User assignedTo = userRepository.findByUsername(demoTicket.assignedTo())
                .orElseThrow(() -> new IllegalStateException("Missing demo ticket assignee: " + demoTicket.assignedTo()));
        Category category = categoryRepository.findByCategoryName(demoTicket.category())
                .orElseThrow(() -> new IllegalStateException("Missing demo ticket category: " + demoTicket.category()));

        Ticket ticket = new Ticket();
        ticket.setTitle(demoTicket.title());
        ticket.setDescription(demoTicket.description());
        ticket.setPriority(TicketPriority.Priority.valueOf(demoTicket.priority()));
        ticket.setStatus(parseStatus(demoTicket.status()));
        ticket.setReportedBy(reportedBy);
        ticket.setAssignedTo(assignedTo);
        ticket.setCategory(category);

        ticketRepository.save(ticket);
    }

    private TicketStatus.Status parseStatus(String status) {
        if ("NEW".equals(status)) {
            return TicketStatus.Status.OPEN;
        }

        return TicketStatus.Status.valueOf(status);
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record DemoData(List<DemoUser> users, List<String> categories, List<DemoTicket> tickets) {
        private DemoData {
            users = users == null ? List.of() : users;
            categories = categories == null ? List.of() : categories;
            tickets = tickets == null ? List.of() : tickets;
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record DemoUser(String username, String email, String password, String role, String displayName) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record DemoTicket(
            String title,
            String description,
            String priority,
            String status,
            String category,
            String createdBy,
            String assignedTo
    ) {
    }
}
