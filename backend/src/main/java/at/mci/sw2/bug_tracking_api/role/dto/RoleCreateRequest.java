package at.mci.sw2.bug_tracking_api.role.dto;

import jakarta.validation.constraints.NotBlank;

public record RoleCreateRequest(
        @NotBlank(message = "Role name is required")
        String roleName) {
}
