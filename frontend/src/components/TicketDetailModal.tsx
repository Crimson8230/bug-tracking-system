import "./TicketModal.css";

type BackendTicket = {
    ticket_id: number;
    title: string;
    description: string;
    status: "OPEN" | "IN_ANALYSIS" | "IN_PROGRESS" | "DONE" | "CANCELLED";
    priority: "LOW" | "MEDIUM" | "HIGH";
    created_at: string;
    updated_at?: string;
};

interface TicketModalProps {
    ticket: BackendTicket | null;
    onClose: () => void;
}

const statusLabels: Record<BackendTicket["status"], string> = {
    OPEN: "Neu",
    IN_ANALYSIS: "In Analyse",
    IN_PROGRESS: "In Bearbeitung",
    DONE: "Erledigt",
    CANCELLED: "Abgelehnt",
};

const priorityLabels: Record<BackendTicket["priority"], string> = {
    LOW: "Niedrig",
    MEDIUM: "Normal",
    HIGH: "Hoch",
};

const statusClass: Record<BackendTicket["status"], string> = {
    OPEN: "status-neu",
    IN_ANALYSIS: "status-in-analyse",
    IN_PROGRESS: "status-in-bearbeitung",
    DONE: "status-erledigt",
    CANCELLED: "status-abgelehnt",
};

const priorityClass: Record<BackendTicket["priority"], string> = {
    LOW: "priority-niedrig",
    MEDIUM: "priority-normal",
    HIGH: "priority-hoch",
};

export default function TicketDetailModal({ ticket, onClose }: TicketModalProps) {
    if (!ticket) return null;

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <article className="ticket-modal" onClick={(e) => e.stopPropagation()}>
                <header className="modal-header">
                    <div>
                        <p className="eyebrow">Ticket #{ticket.ticket_id}</p>
                        <h2>{ticket.title}</h2>
                    </div>

                    <button className="secondary-button" type="button" onClick={onClose}>
                        Schließen
                    </button>
                </header>

                <div className="modal-badges">
                    <span className={`status ${statusClass[ticket.status]}`}>
                        {statusLabels[ticket.status]}
                    </span>

                    <span className={`priority ${priorityClass[ticket.priority]}`}>
                        {priorityLabels[ticket.priority]}
                    </span>
                </div>

                <section className="modal-section">
                    <h3>Beschreibung</h3>
                    <p>{ticket.description}</p>
                </section>

                <section className="modal-meta">
                    <div>
                        <span>Erstellt</span>
                        <strong>
                            {new Date(ticket.created_at).toLocaleString("de-DE")}
                        </strong>
                    </div>

                    <div>
                        <span>Aktualisiert</span>
                        <strong>
                            {ticket.updated_at
                                ? new Date(ticket.updated_at).toLocaleString("de-DE")
                                : "Noch nicht aktualisiert"}
                        </strong>
                    </div>

                    <div>
                        <span>Bearbeiter</span>
                        <strong>Nicht zugewiesen</strong>
                    </div>
                </section>
            </article>
        </div>
    );
}