const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";
import { getAuthorizationHeader } from "../auth/auth";

export type BackendRole = {
    roleId: number;
    roleName: string;
};

export type RoleCreateRequest = {
    roleName: string;
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

export function getRoles() {
    return request<BackendRole[]>("/api/v1/roles");
}

export function createRole(payload: RoleCreateRequest) {
    return request<BackendRole>("/api/v1/roles", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}