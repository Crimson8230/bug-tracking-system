import { AlertTriangle, ArrowLeft, Bug, FileUp, Info, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { createTicket } from "../API/tickets";

type Priority = "Kritisch" | "Hoch" | "Normal" | "Niedrig";
type Category = "Frontend" | "Backend" | "Datenbank" | "Login" | "Sonstiges";

const priorities: Priority[] = ["Kritisch", "Hoch", "Normal", "Niedrig"];
const categories: Category[] = ["Frontend", "Backend", "Datenbank", "Login", "Sonstiges"];

function mapPriority(priority: Priority) {
    switch (priority) {
        case "Hoch":
        case "Kritisch":
            return "HIGH";
        case "Normal":
            return "MEDIUM";
        case "Niedrig":
            return "LOW";
    }
}

export default function ReportBugPage() {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [steps, setSteps] = useState("");
    const [expected, setExpected] = useState("");
    const [actual, setActual] = useState("");
    const [priority, setPriority] = useState<Priority>("Normal");
    const [category, setCategory] = useState<Category>("Frontend");
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setIsSaving(true);

        try {
            await createTicket({
                title,
                description: `
Kategorie: ${category}

Beschreibung:
${description}

Schritte zur Reproduktion:
${steps}

Erwartetes Verhalten:
${expected}

Tatsächliches Verhalten:
${actual}
                `.trim(),
                status: "OPEN",
                priority: mapPriority(priority),
                created_at: new Date().toISOString(),
            });

            navigate("/overview");
        } catch (err) {
            console.error(err);
            setError("Ticket konnte nicht gespeichert werden.");
        } finally {
            setIsSaving(false);
        }
    }

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

                    <button
                        className="primary-button"
                        type="submit"
                        form="report-bug-form"
                        disabled={isSaving}
                    >
                        <Send size={18} />
                        {isSaving ? "Speichere..." : "Ticket speichern"}
                    </button>
                </header>

                {error && <p className="error-message">{error}</p>}

                <div className="report-layout">
                    <form
                        id="report-bug-form"
                        className="report-form"
                        onSubmit={handleSubmit}
                    >
                        <section className="form-card">
                            <div className="card-heading">
                                <h2>Fehlerbeschreibung</h2>
                                <p>Beschreibe den Fehler so genau wie möglich.</p>
                            </div>

                            <div className="form-grid">
                                <label className="field field-full">
                                    <span>Titel *</span>
                                    <input
                                        type="text"
                                        required
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="z. B. Login schlägt bei gültigen Zugangsdaten fehl"
                                    />
                                </label>

                                <label className="field field-full">
                                    <span>Detaillierte Fehlerbeschreibung *</span>
                                    <textarea
                                        rows={5}
                                        required
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Was ist passiert? Wann tritt der Fehler auf?"
                                    />
                                </label>

                                <label className="field field-full">
                                    <span>Schritte zur Reproduktion *</span>
                                    <textarea
                                        rows={4}
                                        required
                                        value={steps}
                                        onChange={(e) => setSteps(e.target.value)}
                                        placeholder={"1. Login-Seite öffnen\n2. Benutzername und Passwort eingeben\n3. Auf Anmelden klicken"}
                                    />
                                </label>
                            </div>
                        </section>

                        <section className="form-card">
                            <div className="card-heading">
                                <h2>Verhalten</h2>
                                <p>Vergleiche erwartetes und tatsächliches Verhalten.</p>
                            </div>

                            <div className="form-grid two-columns">
                                <label className="field">
                                    <span>Erwartetes Verhalten *</span>
                                    <textarea
                                        rows={5}
                                        required
                                        value={expected}
                                        onChange={(e) => setExpected(e.target.value)}
                                    />
                                </label>

                                <label className="field">
                                    <span>Tatsächliches Verhalten *</span>
                                    <textarea
                                        rows={5}
                                        required
                                        value={actual}
                                        onChange={(e) => setActual(e.target.value)}
                                    />
                                </label>
                            </div>
                        </section>

                        <section className="form-card">
                            <div className="card-heading">
                                <h2>Klassifizierung</h2>
                                <p>Priorität und Kategorie helfen bei der Bearbeitung.</p>
                            </div>

                            <div className="form-grid two-columns">
                                <label className="field">
                                    <span>Priorität *</span>
                                    <select
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value as Priority)}
                                    >
                                        {priorities.map((priority) => (
                                            <option key={priority}>{priority}</option>
                                        ))}
                                    </select>
                                </label>

                                <label className="field">
                                    <span>Kategorie</span>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value as Category)}
                                    >
                                        {categories.map((category) => (
                                            <option key={category}>{category}</option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                        </section>

                        <section className="form-card">
                            <div className="card-heading">
                                <h2>Anhang</h2>
                                <p>Wird aktuell noch nicht ans Backend übertragen.</p>
                            </div>

                            <label className="upload-box">
                                <FileUp size={28} />
                                <strong>Datei hier ablegen oder auswählen</strong>
                                <span>Maximal 10 MB pro Datei</span>
                                <input type="file" disabled />
                            </label>
                        </section>
                    </form>

                    <aside className="report-sidebar">
                        <section className="info-card">
                            <div className="info-title">
                                <Info size={20} />
                                <h2>Hinweise</h2>
                            </div>
                            <ul>
                                <li>Pflichtfelder müssen ausgefüllt sein.</li>
                                <li>Der Status wird automatisch auf „Neu“ gesetzt.</li>
                                <li>Nach dem Speichern erhält das Ticket eine eindeutige ID.</li>
                            </ul>
                        </section>

                        <section className="warning-card">
                            <AlertTriangle size={22} />
                            <div>
                                <strong>Kritische Bugs</strong>
                                <p>Kritische Tickets werden aktuell als HIGH gespeichert.</p>
                            </div>
                        </section>
                    </aside>
                </div>
            </section>
        </main>
    );
}