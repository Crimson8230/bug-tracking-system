package at.mci.sw2.bug_tracking_api.user.dto;

import jakarta.validation.constraints.Email;

public record UserUpdateRequest(
        String username,

        @Email(message = "Email must be valid")
        String email,

        String displayName,

        Boolean active,

        Long roleId) {
}
