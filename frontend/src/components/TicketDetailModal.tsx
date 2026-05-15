import { useEffect, useState } from "react";
import { updateTicket, type BackendTicket, type TicketStatus } from "../API/tickets";
import { getUsers, type BackendUser } from "../API/users";
import { createComment, getCommentsByTicket, type BackendComment } from "../API/comments";
import "./TicketModal.css";
import { getAuthSession } from "../auth/auth";
import {
    statusLabels,
    priorityLabels,
    statusClasses,
    priorityClasses,
} from "../utils/ticketDisplay";

interface TicketModalProps {
    ticket: BackendTicket | null;
    onClose: () => void;
    onTicketUpdated?: (ticket: BackendTicket) => void;
}


function formatDate(date?: string | null) {
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
    const [selectedStatus, setSelectedStatus] = useState<TicketStatus>("OPEN");
    const [isSavingStatus, setIsSavingStatus] = useState(false);
    const [comments, setComments] = useState<BackendComment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [isLoadingComments, setIsLoadingComments] = useState(false);
    const [isSavingComment, setIsSavingComment] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        setLocalTicket(ticket);
        setSelectedAssignedToId(ticket?.assignedToId?.toString() ?? "");
        setSelectedStatus(ticket?.status ?? "OPEN");
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

    useEffect(() => {
        if (!ticket) return;

        let isMounted = true;
        setIsLoadingComments(true);
        setComments([]);

        getCommentsByTicket(ticket.ticketId)
            .then((loadedComments) => {
                if (isMounted) {
                    setComments(loadedComments);
                }
            })
            .catch((error: unknown) => {
                if (isMounted) {
                    const message = error instanceof Error ? error.message : "Kommentare konnten nicht geladen werden.";
                    setErrorMessage(message);
                }
            })
            .finally(() => {
                if (isMounted) {
                    setIsLoadingComments(false);
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

    const handleSaveStatus = async () => {
        setErrorMessage(null);
        setIsSavingStatus(true);

        try {
            const updatedTicket = await updateTicket(localTicket.ticketId, {
                status: selectedStatus,
            });

            handleUpdatedTicket(updatedTicket);
        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Status konnte nicht gespeichert werden.";

            setErrorMessage(message);
        } finally {
            setIsSavingStatus(false);
        }
    };


    const handleCreateComment = async () => {
        const authSession = getAuthSession();
        console.log("authSession", authSession);

        const authorId = authSession?.user?.userId;

        if (!authorId) {
            setErrorMessage("Kein angemeldeter Benutzer gefunden.");
            return;
        }

        setErrorMessage(null);
        setIsSavingComment(true);

        try {
            const createdComment = await createComment({
                content: newComment.trim(),
                ticketId: localTicket.ticketId,
                userId: authorId,
            });

            setComments((currentComments) => [...currentComments, createdComment]);
            setNewComment("");
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Kommentar konnte nicht gespeichert werden.";
            setErrorMessage(message);
        } finally {
            setIsSavingComment(false);
        }
    };

    const isAssigneeUnchanged =
        selectedAssignedToId === (localTicket.assignedToId?.toString() ?? "");
    const isStatusUnchanged = selectedStatus === localTicket.status;

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
                    <span className={`status ${statusClasses[localTicket.status]}`}>
                        {statusLabels[localTicket.status]}
                    </span>

                    <span className={`priority ${priorityClasses[localTicket.priority]}`}>
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

                    <div className="modal-form-row">
                        <label htmlFor="ticketStatus">Status</label>

                        <select
                            id="ticketStatus"
                            value={selectedStatus}
                            onChange={(event) => setSelectedStatus(event.target.value as TicketStatus)}
                            disabled={isSavingStatus}
                        >
                            {Object.entries(statusLabels).map(([status, label]) => (
                                <option key={status} value={status}>
                                    {label}
                                </option>
                            ))}
                        </select>

                        <button
                            className="secondary-button"
                            type="button"
                            onClick={handleSaveStatus}
                            disabled={isSavingStatus || isStatusUnchanged}
                        >
                            {isSavingStatus ? "Speichert ..." : "Status speichern"}
                        </button>
                    </div>
                </section>


                <section className="modal-section">
                    <h3>Kommentare</h3>

                    {isLoadingComments ? (
                        <p>Kommentare werden geladen ...</p>
                    ) : comments.length === 0 ? (
                        <p>Noch keine Kommentare vorhanden.</p>
                    ) : (
                        <div className="comment-list">
                            {comments.map((comment) => (
                                <article className="comment-card" key={comment.commentId}>
                                    <div className="comment-header">
                                        <strong>
                                            {comment.displayName
                                                ?? comment.username
                                                ?? `User #${comment.userId ?? "unbekannt"}`}
                                        </strong>
                                        <span>{formatDate(comment.createdAt)}</span>
                                    </div>
                                    <p>{comment.content}</p>
                                </article>
                            ))}
                        </div>
                    )}

                    <div className="comment-form">
                        <label htmlFor="newComment">Neuen Kommentar schreiben</label>
                        <textarea
                            id="newComment"
                            rows={4}
                            value={newComment}
                            onChange={(event) => setNewComment(event.target.value)}
                            placeholder="Kommentar eingeben ..."
                            disabled={isSavingComment}
                        />
                        <button
                            className="secondary-button"
                            type="button"
                            onClick={handleCreateComment}
                            disabled={isSavingComment || newComment.trim().length === 0}
                        >
                            {isSavingComment ? "Speichert ..." : "Kommentar speichern"}
                        </button>
                    </div>
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
