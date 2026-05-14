const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";
console.log(API_BASE_URL);

export type BackendUser = {
    userId: number;
    username: string;
    email: string;
    displayName: string;
    active: boolean;
    roleId: number | null;
    roleName: string | null;
};

export type UserCreateRequest = {
    username: string;
    email: string;
    displayName: string;
    roleId: number;
};

export type UserUpdateRequest = Partial<UserCreateRequest> & {
    active?: boolean;
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        headers: { "Content-Type": "application/json", ...options?.headers },
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

export function getUsers() {
    return request<BackendUser[]>("/api/v1/users");
}

export function createUser(payload: UserCreateRequest) {
    return request<BackendUser>("/api/v1/users", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export function updateUser(userId: number, payload: UserUpdateRequest) {
    return request<BackendUser>(`/api/v1/users/${userId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}

export function deleteUser(userId: number) {
    return request<void>(`/api/v1/users/${userId}`, { method: "DELETE" });
}
