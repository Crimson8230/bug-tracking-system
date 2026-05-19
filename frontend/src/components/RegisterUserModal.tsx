import { Send, UserCog } from "lucide-react";
import { FormEvent, useState } from "react";
import { BackendRole } from "../API/roles";
import { registerUser, RegisterRequest } from "../auth/auth";
import "../components/TicketModal.css";

type UserFormState = {
    username: string;
    email: string;
    displayName: string;
    password: string;
    roleId: string;
};

interface RegisterUserModalProps {
    roles: BackendRole[];
    onClose?: () => void;
    onSaved?: () => void | Promise<void>;
    asModal?: boolean;
}

const emptyForm: UserFormState = {
    username: "",
    email: "",
    displayName: "",
    password: "",
    roleId: "",
};

function toPayload(form: UserFormState): RegisterRequest {
    return {
        username: form.username.trim(),
        email: form.email.trim(),
        displayName: form.displayName.trim(),
        password: form.password,
        roleId: Number(form.roleId),
    };
}

export function RegisterUserModal({
                                      roles,
                                      onClose,
                                      onSaved,
                                      asModal = false,
                                  }: RegisterUserModalProps) {
    const [form, setForm] = useState<UserFormState>(emptyForm);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (
            !form.displayName.trim() ||
            !form.username.trim() ||
            !form.email.trim() ||
            !form.password.trim()
        ) {
            setError("Bitte alle Pflichtfelder ausfüllen.");
            return;
        }

        if (!form.roleId) {
            setError("Bitte eine Rolle auswählen.");
            return;
        }

        setError("");
        setIsSaving(true);

        try {
            await registerUser(toPayload(form));
            setForm(emptyForm);
            await onSaved?.();
        } catch (err) {
            console.error(err);
            setError("Benutzer konnte nicht registriert werden.");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <article className={asModal ? "ticket-modal user-modal" : "report-modal-shell user-modal"}>
            <header className="modal-header">
                <div className="info-title">
                    <UserCog size={22} />
                    <div>
                        <p className="eyebrow">Registrierung</p>
                        <h2>Benutzer registrieren</h2>
                    </div>
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
                    <h3>Stammdaten</h3>

                    <div className="form-grid two-columns">
                        <label className="field">
                            <span>Anzeigename *</span>
                            <input
                                required
                                value={form.displayName}
                                onChange={(event) => setForm({ ...form, displayName: event.target.value })}
                                placeholder="z. B. Max Mustermann"
                            />
                        </label>

                        <label className="field">
                            <span>Benutzername *</span>
                            <input
                                required
                                value={form.username}
                                onChange={(event) => setForm({ ...form, username: event.target.value })}
                                placeholder="z. B. max.mustermann"
                            />
                        </label>

                        <label className="field">
                            <span>E-Mail *</span>
                            <input
                                required
                                type="email"
                                value={form.email}
                                onChange={(event) => setForm({ ...form, email: event.target.value })}
                                placeholder="z. B. max.mustermann@example.com"
                            />
                        </label>

                        <label className="field">
                            <span>Passwort *</span>
                            <input
                                required
                                type="password"
                                value={form.password}
                                onChange={(event) => setForm({ ...form, password: event.target.value })}
                                placeholder="Passwort vergeben"
                            />
                        </label>
                    </div>
                </section>

                <section className="modal-section">
                    <h3>Berechtigung</h3>

                    <div className="form-grid two-columns">
                        <label className="field">
                            <span>Rolle *</span>
                            <select
                                required
                                value={form.roleId}
                                onChange={(event) => setForm({ ...form, roleId: event.target.value })}
                            >
                                <option value="" disabled>
                                    Rolle auswählen
                                </option>
                                {roles.map((role) => (
                                    <option key={role.roleId} value={role.roleId}>
                                        {role.roleName}
                                    </option>
                                ))}
                            </select>
                        </label>
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
                        {isSaving ? "Registriere..." : "Benutzer registrieren"}
                    </button>
                </div>
            </form>
        </article>
    );
}