package at.mci.sw2.bug_tracking_api.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegisterRequest(
        @NotBlank(message = "Username is required")
        String username,

        @NotBlank(message = "Email is required")
        @Email(message = "Email must be valid")
        String email,

        @NotBlank(message = "Display name is required")
        String displayName,

        @NotBlank(message = "Password is required")
        String password,

        Long roleId) {
}
