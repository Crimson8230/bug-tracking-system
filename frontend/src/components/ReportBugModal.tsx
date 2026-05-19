import { ArrowLeft, Bug, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { createTicket, type TicketCreateRequest, type TicketPriority } from "../API/tickets";
import { getCategories, type BackendCategory } from "../API/categories";
import { getAuthSession } from "../auth/auth";
import "../components/TicketModal.css";

interface ReportBugFormProps {
    onClose?: () => void;
    onCreated?: () => void;
    asModal?: boolean;
}

const priorities: { value: TicketPriority; label: string }[] = [
    { value: "LOW", label: "Niedrig" },
    { value: "MEDIUM", label: "Normal" },
    { value: "HIGH", label: "Hoch" },
    { value: "CRITICAL", label: "Kritisch" },
];

export function ReportBugForm({
                                  onClose,
                                  onCreated,
                                  asModal = false,
                              }: ReportBugFormProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<TicketPriority>("MEDIUM");
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");
    const authSession = getAuthSession();
    const currentUser = authSession?.user;

    const [categories, setCategories] = useState<BackendCategory[]>([]);
    const [categoryId, setCategoryId] = useState("");
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);

    useEffect(() => {
        getCategories()
            .then(setCategories)
            .catch((err) => {
                console.error(err);
                setError("Kategorien konnten nicht geladen werden.");
            })
            .finally(() => setIsLoadingCategories(false));
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!categoryId) {
            setError("Bitte wähle eine Kategorie aus.");
            return;
        }

        if (!currentUser?.userId) {
            setError("Du musst angemeldet sein, um ein Ticket zu erstellen.");
            setIsSaving(false);
            return;
        }

        setError("");
        setIsSaving(true);

        try {

            const payload: TicketCreateRequest = {
                title: title.trim(),
                description: description.trim(),
                priority,
                reportedById: currentUser.userId,
                assignedToId: null,
                categoryId: Number(categoryId),
                parentTicketId: null,
            };

            await createTicket(payload);

            setTitle("");
            setDescription("");
            setPriority("MEDIUM");
            setCategoryId("");

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
                                maxLength={1000}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Beschreibe den Fehler..."
                            />
                        </label>

                        <label className="field">
                            <span>Kategorie *</span>

                            <select
                                required
                                value={categoryId}
                                disabled={isLoadingCategories || categories.length === 0}
                                onChange={(e) => setCategoryId(e.target.value)}
                            >
                                <option value="">
                                    {isLoadingCategories
                                        ? "Kategorien werden geladen..."
                                        : "Kategorie auswählen"}
                                </option>

                                {categories.map((category) => (
                                    <option
                                        key={category.categoryId}
                                        value={String(category.categoryId)}
                                    >
                                        {category.categoryName}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="field">
                            <span>Priorität *</span>
                            <select
                                value={priority}
                                onChange={(e) =>
                                    setPriority(e.target.value as TicketPriority)
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
                        disabled={isSaving || isLoadingCategories || categories.length === 0}
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