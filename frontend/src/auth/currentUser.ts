import type { BackendUser } from "../API/users";

const CURRENT_USER_KEY = "currentUser";

export function setCurrentUser(user: BackendUser) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export function getCurrentUser(): BackendUser | null {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
}

export function clearCurrentUser() {
    localStorage.removeItem(CURRENT_USER_KEY);
}