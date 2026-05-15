const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";
import { getAuthorizationHeader } from "../auth/auth";

export type BackendCategory = {
    categoryId: number;
    categoryName: string;
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        headers: {
            "Content-Type": "application/json",
            ...getAuthorizationHeader(),
            ...options?.headers,
        },
        ...options,
    });

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `Request failed with ${response.status}`);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json();
}

export function getCategories() {
    return request<BackendCategory[]>("/api/v1/categories");
}

export type CategoryCreateRequest = {
    categoryName: string;
};

export function createCategory(payload: CategoryCreateRequest) {
    return request<BackendCategory>("/api/v1/categories", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}