const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";
const AUTH_SESSION_KEY = "authSession";

export type AuthUser = {
    userId: number;
    username: string;
    email: string;
    displayName: string;
    active: boolean;
    roleId: number | null;
    roleName: string | null;
};

export type LoginRequest = {
    usernameOrEmail: string;
    password: string;
};

export type RegisterRequest = {
    username: string;
    email: string;
    displayName: string;
    password: string;
    roleId: number;
};

export type AuthResponse = {
    tokenType: "Bearer";
    accessToken: string;
    user: AuthUser;
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
    });

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `Request failed with ${response.status}`);
    }

    return response.json();
}

export function login(payload: LoginRequest) {
    return request<AuthResponse>("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export function registerUser(payload: RegisterRequest) {
    return request<AuthResponse>("/api/v1/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export function setAuthSession(auth: AuthResponse) {
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(auth));
}

export function getAuthSession(): AuthResponse | null {
    const raw = localStorage.getItem(AUTH_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
}

export function getAccessToken(): string | null {
    return getAuthSession()?.accessToken ?? null;
}

export function getAuthorizationHeader(): Record<string, string> {
    const token = getAccessToken();

    return token ? { Authorization: `Bearer ${token}` } : {};
}

export function clearAuthSession() {
    localStorage.removeItem(AUTH_SESSION_KEY);
}