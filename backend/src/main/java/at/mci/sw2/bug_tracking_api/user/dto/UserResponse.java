package at.mci.sw2.bug_tracking_api.user.dto;

public record UserResponse(
        Long userId,
        String username,
        String email,
        String displayName,
        boolean active,
        Long roleId,
        String roleName) {
}
