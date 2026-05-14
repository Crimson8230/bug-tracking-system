import { useEffect, useState } from "react";
import { updateTicket, type BackendTicket } from "../API/tickets";
import { getUsers, type BackendUser } from "../API/users";
import "./TicketModal.css";

interface TicketModalProps {
    ticket: BackendTicket | null;
    onClose: () => void;
    onTicketUpdated?: (ticket: BackendTicket) => void;
}

const statusLabels: Record<BackendTicket["status"], string> = {
    OPEN: "Neu",
    IN_ANALYSIS: "In Analyse",
    IN_PROGRESS: "In Bearbeitung",
    DONE: "Erledigt",
    CLOSED: "Geschlossen",
    CANCELLED: "Abgelehnt",
};

const priorityLabels: Record<BackendTicket["priority"], string> = {
    LOW: "Niedrig",
    MEDIUM: "Normal",
    HIGH: "Hoch",
    CRITICAL: "Kritisch",
};

const statusClass: Record<BackendTicket["status"], string> = {
    OPEN: "status-neu",
    IN_ANALYSIS: "status-in-analyse",
    IN_PROGRESS: "status-in-bearbeitung",
    DONE: "status-erledigt",
    CLOSED: "status-erledigt",
    CANCELLED: "status-abgelehnt",
};

const priorityClass: Record<BackendTicket["priority"], string> = {
    LOW: "priority-niedrig",
    MEDIUM: "priority-normal",
    HIGH: "priority-hoch",
    CRITICAL: "priority-critical",
};

function formatDate(date?: string) {
    return date ? new Date(date).toLocaleString("de-DE") : "-";
}

export default function TicketDetailModal({
                                              ticket,
                                              onClose,
                                              onTicketUpdated,
                                          }: TicketModalProps) {
    const [localTicket, setLocalTicket] = useState<BackendTicket | null>(ticket);
    const [users, setUsers] = useState<BackendUser[]>([]);
    const [selectedAssignedToId, setSelectedAssignedToId] = useState<string>("");
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const [isSavingAssignee, setIsSavingAssignee] = useState(false);
    const [isClosingTicket, setIsClosingTicket] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        setLocalTicket(ticket);
        setSelectedAssignedToId(ticket?.assignedToId?.toString() ?? "");
        setErrorMessage(null);
    }, [ticket]);

    useEffect(() => {
        if (!ticket) return;

        let isMounted = true;
        setIsLoadingUsers(true);

        getUsers()
            .then((loadedUsers) => {
                if (isMounted) {
                    setUsers(loadedUsers);
                }
            })
            .catch((error: unknown) => {
                if (isMounted) {
                    const message = error instanceof Error ? error.message : "Benutzer konnten nicht geladen werden.";
                    setErrorMessage(message);
                }
            })
            .finally(() => {
                if (isMounted) {
                    setIsLoadingUsers(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [ticket]);

    if (!localTicket) return null;

    const handleUpdatedTicket = (updatedTicket: BackendTicket) => {
        setLocalTicket(updatedTicket);
        setSelectedAssignedToId(updatedTicket.assignedToId?.toString() ?? "");
        onTicketUpdated?.(updatedTicket);
    };

    const handleSaveAssignee = async () => {
        setErrorMessage(null);
        setIsSavingAssignee(true);

        try {
            const assignedToId = selectedAssignedToId ? Number(selectedAssignedToId) : null;
            const updatedTicket = await updateTicket(localTicket.ticketId, { assignedToId });
            handleUpdatedTicket(updatedTicket);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Bearbeiter konnte nicht gespeichert werden.";
            setErrorMessage(message);
        } finally {
            setIsSavingAssignee(false);
        }
    };

    const handleCloseTicket = async () => {
        setErrorMessage(null);
        setIsClosingTicket(true);

        try {
            const updatedTicket = await updateTicket(localTicket.ticketId, { status: "CLOSED" });
            handleUpdatedTicket(updatedTicket);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Ticket konnte nicht geschlossen werden.";
            setErrorMessage(message);
        } finally {
            setIsClosingTicket(false);
        }
    };

    const isAssigneeUnchanged =
        selectedAssignedToId === (localTicket.assignedToId?.toString() ?? "");
    const isClosed = localTicket.status === "CLOSED";

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <article className="ticket-modal" onClick={(e) => e.stopPropagation()}>
                <header className="modal-header">
                    <div>
                        <p className="eyebrow">Ticket #{localTicket.ticketId}</p>
                        <h2>{localTicket.title}</h2>
                    </div>

                    <button className="secondary-button" type="button" onClick={onClose}>
                        Schließen
                    </button>
                </header>

                <div className="modal-badges">
                    <span className={`status ${statusClass[localTicket.status]}`}>
                        {statusLabels[localTicket.status]}
                    </span>

                    <span className={`priority ${priorityClass[localTicket.priority]}`}>
                        {priorityLabels[localTicket.priority]}
                    </span>
                </div>

                {errorMessage && (
                    <p className="modal-error" role="alert">
                        {errorMessage}
                    </p>
                )}

                <section className="modal-section">
                    <h3>Beschreibung</h3>
                    <p>{localTicket.description}</p>
                </section>

                <section className="modal-section">
                    <h3>Ticket bearbeiten</h3>

                    <div className="modal-form-row">
                        <label htmlFor="assignedToId">Bearbeiter</label>
                        <select
                            id="assignedToId"
                            value={selectedAssignedToId}
                            onChange={(event) => setSelectedAssignedToId(event.target.value)}
                            disabled={isLoadingUsers || isSavingAssignee}
                        >
                            <option value="">Nicht zugewiesen</option>
                            {users
                                .filter((user) => user.active)
                                .map((user) => (
                                    <option key={user.userId} value={user.userId}>
                                        {user.displayName || user.username}
                                    </option>
                                ))}
                        </select>
                        <button
                            className="secondary-button"
                            type="button"
                            onClick={handleSaveAssignee}
                            disabled={isLoadingUsers || isSavingAssignee || isAssigneeUnchanged}
                        >
                            {isSavingAssignee ? "Speichert ..." : "Bearbeiter speichern"}
                        </button>
                    </div>

                    <button
                        className="secondary-button"
                        type="button"
                        onClick={handleCloseTicket}
                        disabled={isClosingTicket || isClosed}
                    >
                        {isClosingTicket ? "Schließt ..." : isClosed ? "Ticket geschlossen" : "Ticket schließen"}
                    </button>
                </section>

                <section className="modal-meta">
                    <div>
                        <span>Erstellt</span>
                        <strong>{formatDate(localTicket.createdAt)}</strong>
                    </div>

                    <div>
                        <span>Aktualisiert</span>
                        <strong>
                            {localTicket.updatedAt
                                ? formatDate(localTicket.updatedAt)
                                : "Noch nicht aktualisiert"}
                        </strong>
                    </div>

                    <div>
                        <span>Bearbeiter</span>
                        <strong>{localTicket.assignedToUsername ?? "Nicht zugewiesen"}</strong>
                    </div>

                    <div>
                        <span>Reporter</span>
                        <strong>{localTicket.reportedByUsername ?? "Unbekannt"}</strong>
                    </div>

                    <div>
                        <span>Kategorie</span>
                        <strong>{localTicket.categoryName ?? "Keine Kategorie"}</strong>
                    </div>
                </section>
            </article>
        </div>
    );
}
