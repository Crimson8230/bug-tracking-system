import { AlertTriangle, ArrowLeft, Bug, FileUp, Info, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Priority = "Kritisch" | "Hoch" | "Normal" | "Niedrig";

type Category = "Frontend" | "Backend" | "Datenbank" | "Login" | "Sonstiges";

const priorities: Priority[] = ["Kritisch", "Hoch", "Normal", "Niedrig"];
const categories: Category[] = ["Frontend", "Backend", "Datenbank", "Login", "Sonstiges"];

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

                    <button className="primary-button" type="button">
                        <Send size={18} />
                        Ticket speichern
                    </button>
                </header>

                <div className="report-layout">
                    <form className="report-form">
                        <section className="form-card">
                            <div className="card-heading">
                                <h2>Fehlerbeschreibung</h2>
                                <p>Beschreibe den Fehler so genau wie möglich.</p>
                            </div>

                            <div className="form-grid">
                                <label className="field field-full">
                                    <span>Titel *</span>
                                    <input type="text" placeholder="z. B. Login schlägt bei gültigen Zugangsdaten fehl" />
                                </label>

                                <label className="field field-full">
                                    <span>Detaillierte Fehlerbeschreibung *</span>
                                    <textarea rows={5} placeholder="Was ist passiert? Wann tritt der Fehler auf?" />
                                </label>

                                <label className="field field-full">
                                    <span>Schritte zur Reproduktion *</span>
                                    <textarea rows={4} placeholder={"1. Login-Seite öffnen\n2. Benutzername und Passwort eingeben\n3. Auf Anmelden klicken"} />
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
                                    <textarea rows={5} placeholder="Der Benutzer sollte erfolgreich angemeldet werden." />
                                </label>

                                <label className="field">
                                    <span>Tatsächliches Verhalten *</span>
                                    <textarea rows={5} placeholder="Es erscheint eine Fehlermeldung oder die Seite lädt endlos." />
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
                                    <select defaultValue="Normal">
                                        {priorities.map((priority) => (
                                            <option key={priority}>{priority}</option>
                                        ))}
                                    </select>
                                </label>

                                <label className="field">
                                    <span>Kategorie</span>
                                    <select defaultValue="Frontend">
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
                                <p>Screenshots, Log-Dateien oder kurze Videos helfen bei der Analyse.</p>
                            </div>

                            <label className="upload-box">
                                <FileUp size={28} />
                                <strong>Datei hier ablegen oder auswählen</strong>
                                <span>Maximal 10 MB pro Datei, keine ausführbaren Dateien</span>
                                <input type="file" />
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
                                <p>Kritische Tickets sollten möglichst genau beschrieben werden, damit sie schnell zugewiesen werden können.</p>
                            </div>
                        </section>
                    </aside>
                </div>
            </section>
        </main>
    );
}
