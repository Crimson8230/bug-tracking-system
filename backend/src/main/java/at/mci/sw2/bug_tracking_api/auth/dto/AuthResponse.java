package at.mci.sw2.bug_tracking_api.auth.dto;

import at.mci.sw2.bug_tracking_api.user.dto.UserResponse;

public record AuthResponse(
        String tokenType,
        String accessToken,
        UserResponse user) {
}
