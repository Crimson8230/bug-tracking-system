package at.mci.sw2.bug_tracking_api.category.dto;

import jakarta.validation.constraints.NotBlank;

public record CategoryCreateRequest(
        @NotBlank(message = "Category name is required")
        String categoryName) {
}
