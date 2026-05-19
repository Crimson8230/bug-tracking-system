import { Send } from "lucide-react";
import { useState } from "react";
import { createRole } from "../API/roles";
import "../components/TicketModal.css";

interface CreateRoleFormProps {
    onClose?: () => void;
    onCreated?: () => void;
    asModal?: boolean;
}

export function CreateRoleForm({
                                   onClose,
                                   onCreated,
                                   asModal = false,
                               }: CreateRoleFormProps) {
    const [roleName, setRoleName] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        setError("");
        setIsSaving(true);

        try {
            await createRole({
                roleName: roleName.trim(),
            });

            setRoleName("");
            onCreated?.();
        } catch (err) {
            console.error(err);
            setError("Rolle konnte nicht gespeichert werden.");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <article className={asModal ? "ticket-modal" : "report-modal-shell"}>
        <header className="modal-header">
        <div>
            <p className="eyebrow">Neue Rolle</p>
    <h2>Rolle anlegen</h2>
    </div>

    {onClose && (
        <button className="secondary-button" type="button" onClick={onClose}>
        Schließen
        </button>
    )}
    </header>

    <form className="modal-form" onSubmit={handleSubmit}>
    {error && <p className="error-message">{error}</p>}

        <section className="modal-section">
        <h3>Rollendaten</h3>

        <div className="form-grid">
    <label className="field field-full">
        <span>Rollenname *</span>
        <input
    type="text"
    required
    value={roleName}
    onChange={(event) => setRoleName(event.target.value)}
    placeholder="z. B. ADMIN"
        />
        </label>
        </div>
        </section>

        <section className="modal-meta">
        <div>
            <span>Typ</span>
        <strong>Benutzerrolle</strong>
        </div>

        <div>
        <span>Status</span>
        <strong>Neu</strong>
        </div>

        <div>
        <span>Verwendung</span>
        <strong>Nach Speichern auswählbar</strong>
    </div>
    </section>

    <div className="modal-actions">
        {onClose && (
            <button className="secondary-button" type="button" onClick={onClose}>
        Abbrechen
        </button>
)}

    <button className="primary-button" type="submit" disabled={isSaving}>
    <Send size={18} />
    {isSaving ? "Speichere..." : "Rolle speichern"}
    </button>
    </div>
    </form>
    </article>
);
}