const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";
import { getAuthorizationHeader } from "../auth/auth";

export type BackendComment = {
    commentId: number;
    content: string;
    ticketId: number;
    userId: number;
    createdAt?: string;
    updatedAt?: string;
    username?: string | null;
    displayName?: string | null;
};

export type CommentCreateRequest = {
    content: string;
    ticketId: number;
    userId: number;
};


export type CommentUpdateRequest = {
    content?: string;
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

export function getComments() {
    return request<BackendComment[]>("/api/v1/comments");
}

export async function getCommentsByTicket(ticketId: number) {
    const comments = await getComments();
    return comments.filter((comment) => comment.ticketId === ticketId);
}

export function getComment(commentId: number) {
    return request<BackendComment>(`/api/v1/comments/${commentId}`);
}

export async function createComment(payload: CommentCreateRequest): Promise<BackendComment> {
    return request<BackendComment>("/api/v1/comments", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export function updateComment(commentId: number, payload: CommentUpdateRequest) {
    return request<BackendComment>(`/api/v1/comments/${commentId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}

export function deleteComment(commentId: number) {
    return request<void>(`/api/v1/comments/${commentId}`, {
        method: "DELETE",
    });
}
