import { Save } from "lucide-react";
import { useState } from "react";
import { createCategory } from "../API/categories";
import "../components/TicketModal.css";

interface CreateCategoryModalProps {
    onClose?: () => void;
    onCreated?: () => void;
    asModal?: boolean;
}

export default function CreateCategoryModal({
                                                onClose,
                                                onCreated,
                                                asModal = true,
                                            }: CreateCategoryModalProps) {
    const [categoryName, setCategoryName] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const trimmedName = categoryName.trim();

        if (!trimmedName) {
            setError("Bitte gib einen Kategorienamen ein.");
            return;
        }

        setError("");
        setIsSaving(true);

        try {
            await createCategory({
                categoryName: trimmedName,
            });

            setCategoryName("");
            onCreated?.();
            onClose?.();
        } catch (err) {
            console.error(err);
            setError("Kategorie konnte nicht gespeichert werden.");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <article className={asModal ? "ticket-modal" : "report-modal-shell"}>
        <header className="modal-header">
        <div>
            <p className="eyebrow">Neue Kategorie</p>
    <h2>Kategorie erstellen</h2>
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

    <form className="modal-form" onSubmit={handleSubmit}>
    {error && <p className="error-message">{error}</p>}

        <section className="modal-section">
        <h3>Kategoriedaten</h3>

        <div className="form-grid">
    <label className="field field-full">
        <span>Kategoriename *</span>
        <input
    type="text"
    required
    value={categoryName}
    onChange={(e) => setCategoryName(e.target.value)}
    placeholder="z. B. Frontend"
    autoFocus
    />
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
    disabled={isSaving}
    >
    <Save size={18} />
    {isSaving ? "Speichere..." : "Kategorie speichern"}
    </button>
    </div>
    </form>
    </article>
);
}