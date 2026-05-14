const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export type TicketStatus =
    | "OPEN"
    | "IN_ANALYSIS"
    | "IN_PROGRESS"
    | "DONE"
    | "CLOSED"
    | "CANCELLED";

export type TicketPriority =
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | "CRITICAL";

export type BackendTicket = {
    ticketId: number;
    title: string;
    description: string | null;
    status: TicketStatus;
    priority: TicketPriority;
    createdAt: string;
    updatedAt: string;
    reportedById: number | null;
    reportedByUsername: string | null;
    assignedToId: number | null;
    assignedToUsername: string | null;
    categoryId: number | null;
    categoryName: string | null;
    parentTicketId: number | null;
};

export type TicketCreateRequest = {
    title: string;
    description?: string;
    priority?: TicketPriority;
    reportedById: number;
    assignedToId?: number | null;
    categoryId: number;
    parentTicketId?: number | null;
};

export type TicketUpdateRequest = {
    title?: string;
    description?: string;
    status?: TicketStatus;
    priority?: TicketPriority;
    assignedToId?: number | null;
    categoryId?: number;
    parentTicketId?: number | null;
};

export type AttachmentResponse = {
    attachmentId: number;
    ticketId: number;
    fileName?: string;
    filename?: string;
    contentType?: string;
    size?: number;
    url?: string;
    uploadedAt?: string;
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

export function getTickets() {
    return request<BackendTicket[]>("/api/v1/tickets");
}

export function getTicket(ticketId: number) {
    return request<BackendTicket>(`/api/v1/tickets/${ticketId}`);
}

export function createTicket(payload: TicketCreateRequest) {
    return request<BackendTicket>("/api/v1/tickets", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export function updateTicket(ticketId: number, payload: TicketUpdateRequest) {
    return request<BackendTicket>(`/api/v1/tickets/${ticketId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}

export function deleteTicket(ticketId: number) {
    return request<void>(`/api/v1/tickets/${ticketId}`, {
        method: "DELETE",
    });
}

export function getTicketAttachments(ticketId: number) {
    return request<AttachmentResponse[]>(`/api/v1/tickets/${ticketId}/attachments`);
}