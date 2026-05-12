import { ArrowLeft, Bug, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { createTicket } from "../API/tickets";
import "../components/TicketModal.css";

type Priority = "LOW" | "MEDIUM" | "HIGH";

interface ReportBugFormProps {
    onClose?: () => void;
    onCreated?: () => void;
    asModal?: boolean;
}

const priorities: { value: Priority; label: string }[] = [
    { value: "LOW", label: "Niedrig" },
    { value: "MEDIUM", label: "Normal" },
    { value: "HIGH", label: "Hoch" },
];

export function ReportBugForm({
                                  onClose,
                                  onCreated,
                                  asModal = false,
                              }: ReportBugFormProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<Priority>("MEDIUM");
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        setError("");
        setIsSaving(true);

        try {
            await createTicket({
                title,
                description,
                status: "OPEN",
                priority,
                created_at: new Date().toISOString(),
            });

            onCreated?.();
        } catch (err) {
            console.error(err);
            setError("Ticket konnte nicht gespeichert werden.");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <article className={asModal ? "ticket-modal" : "report-modal-shell"}>
            <header className="modal-header">
                <div>
                    <p className="eyebrow">Neues Ticket</p>
                    <h2>Bug melden</h2>
                </div>

                {onClose && (
                    <button
                        className="secondary-button"
                        type="button"
                        onClick={onClose}
                    >
                        Schließen
                    </button>
                )}
            </header>

            <form
                id="report-bug-form"
                className="modal-form"
                onSubmit={handleSubmit}
            >
                {error && <p className="error-message">{error}</p>}

                <section className="modal-section">
                    <h3>Ticketdaten</h3>

                    <div className="form-grid">
                        <label className="field field-full">
                            <span>Titel *</span>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="z. B. Login schlägt fehl"
                            />
                        </label>

                        <label className="field field-full">
                            <span>Beschreibung</span>
                            <textarea
                                rows={7}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Beschreibe den Fehler..."
                            />
                        </label>

                        <label className="field">
                            <span>Priorität *</span>
                            <select
                                value={priority}
                                onChange={(e) =>
                                    setPriority(e.target.value as Priority)
                                }
                            >
                                {priorities.map((priority) => (
                                    <option
                                        key={priority.value}
                                        value={priority.value}
                                    >
                                        {priority.label}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                </section>

                <section className="modal-meta">
                    <div>
                        <span>Status</span>
                        <strong>Neu</strong>
                    </div>

                    <div>
                        <span>Erstellt</span>
                        <strong>Beim Speichern</strong>
                    </div>

                    <div>
                        <span>Bearbeiter</span>
                        <strong>Nicht zugewiesen</strong>
                    </div>
                </section>

                <div className="modal-actions">
                    {onClose && (
                        <button
                            className="secondary-button"
                            type="button"
                            onClick={onClose}
                        >
                            Abbrechen
                        </button>
                    )}

                    <button
                        className="primary-button"
                        type="submit"
                        disabled={isSaving}
                    >
                        <Send size={18} />
                        {isSaving ? "Speichere..." : "Ticket speichern"}
                    </button>
                </div>
            </form>
        </article>
    );
}

export default function ReportBugPage() {
    const navigate = useNavigate();

    return (
        <main className="report-page">
            <section className="report-shell">
                <header className="report-header">
                    <button
                        className="secondary-button"
                        type="button"
                        onClick={() => navigate("/overview")}
                    >
                        <ArrowLeft size={18} />
                        Zurück
                    </button>

                    <div className="report-title-block">
                        <div className="report-icon">
                            <Bug size={30} />
                        </div>
                        <div>
                            <p className="eyebrow">Neues Ticket</p>
                            <h1>Bug melden</h1>
                        </div>
                    </div>
                </header>

                <ReportBugForm
                    onCreated={() => navigate("/overview")}
                />
            </section>
        </main>
    );
}