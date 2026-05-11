const API_URL = "http://localhost:8080/tickets";

export async function getTickets() {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Tickets konnten nicht geladen werden");
    }

    return response.json();
}

export async function createTicket(ticket: {
    title: string;
    description: string;
    status: "OPEN" | "IN_ANALYSIS" | "IN_PROGRESS" | "DONE" | "CANCELLED";
    priority: "LOW" | "MEDIUM" | "HIGH";
    created_at: string;
}) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(ticket),
    });

    if (!response.ok) {
        throw new Error("Ticket konnte nicht gespeichert werden");
    }

    return response.json();
}