import type { BackendTicket } from "../API/tickets";

export const statusLabels: Record<BackendTicket["status"], string> = {
    OPEN: "Neu",
    IN_ANALYSIS: "In Analyse",
    IN_PROGRESS: "In Bearbeitung",
    DONE: "Erledigt",
    CANCELLED: "Abgelehnt",
};

export const priorityLabels: Record<BackendTicket["priority"], string> = {
    LOW: "Niedrig",
    MEDIUM: "Normal",
    HIGH: "Hoch",
    CRITICAL: "Kritisch",
};

export const statusClasses: Record<BackendTicket["status"], string> = {
    OPEN: "status-neu",
    IN_ANALYSIS: "status-in-analyse",
    IN_PROGRESS: "status-in-bearbeitung",
    DONE: "status-erledigt",
    CANCELLED: "status-abgelehnt",
};

export const priorityClasses: Record<BackendTicket["priority"], string> = {
    LOW: "priority-niedrig",
    MEDIUM: "priority-normal",
    HIGH: "priority-hoch",
    CRITICAL: "priority-kritisch",
};

export function getCategoryStyle(categoryName: string | null) {
    const key = categoryName ?? "none";

    let hash = 0;

    for (const char of key) {
        hash = char.charCodeAt(0) + ((hash << 10) - hash);
    }

    const hue = ((hash % 360) + 360) % 360;

    return {
        backgroundColor: `hsl(${hue}, 50%, 60%)`,
        color: `hsl(${hue}, 100%, 10%)`,
        borderColor: `hsl(${hue}, 40%, 40%)`,
    };
}