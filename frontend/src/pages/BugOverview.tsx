import { LogOut, Bug, Filter, Plus, Search, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

type TicketStatus = "Neu" | "In Analyse" | "In Bearbeitung" | "Erledigt" | "Abgelehnt";
type Priority = "Kritisch" | "Hoch" | "Normal" | "Niedrig";

type Ticket = {
    id: string;
    title: string;
    status: TicketStatus;
    priority: Priority;
    assignee: string;
    createdAt: string;
};

const tickets: Ticket[] = [
    {
        id: "#0075",
        title: "Login schlägt bei LDAP-Timeout fehl",
        status: "In Bearbeitung",
        priority: "Kritisch",
        assignee: "Alex Reister",
        createdAt: "07.05.2026",
    },
    {
        id: "#0074",
        title: "Dashboard lädt Statistik nicht vollständig",
        status: "In Analyse",
        priority: "Hoch",
        assignee: "Daniel Riml",
        createdAt: "07.05.2026",
    },
    {
        id: "#0073",
        title: "Kommentar wird nach Speichern nicht angezeigt",
        status: "Neu",
        priority: "Normal",
        assignee: "Nicht zugewiesen",
        createdAt: "06.05.2026",
    },
    {
        id: "#0072",
        title: "Dateiupload akzeptiert ungültigen Dateityp",
        status: "In Bearbeitung",
        priority: "Hoch",
        assignee: "Simon Wabnig",
        createdAt: "06.05.2026",
    },
    {
        id: "#0071",
        title: "Suchfunktion findet Begriffe in Kommentaren nicht",
        status: "Neu",
        priority: "Niedrig",
        assignee: "Nicht zugewiesen",
        createdAt: "05.05.2026",
    },
];

function priorityClass(priority: Priority) {
    return `priority priority-${priority.toLowerCase()}`;
}

function statusClass(status: TicketStatus) {
    return `status status-${status.toLowerCase().replace(" ", "-")}`;
}

export default function BugOverviewPage() {
    const navigate = useNavigate();

    return (
        <main className="overview-page">
            <aside className="sidebar">
                <div className="brand">
                    <div className="brand-icon">
                        <Bug size={24} />
                    </div>
                    <div>
                        <strong>BugTracker</strong>
                        <span>Group 5</span>
                    </div>
                </div>

                <nav className="nav-list">
                    <a className="active" href="#">Übersicht</a>
                    <a href="#">Zugewiesene Tickets</a>
                    <a href="#">Statistik</a>
                    <a href="#">Benutzerverwaltung</a>
                    <a href='#'>Adminbereich</a>
                </nav>
                <button
                    className="logout-button"
                    onClick={() => navigate("/login")}
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </aside>

            <section className="overview-content">
                <header className="overview-header">
                    <div>
                        <p className="eyebrow">Ticket-System</p>
                        <h1>Bug Übersicht</h1>
                    </div>

                    <button
                        className="primary-button"
                        type="button"
                        onClick={() => navigate("/report")}
                    >
                        <Plus size={18} />
                        Report Bug
                    </button>
                </header>

                <section className="stats-grid">
                    <article className="stat-card">
                        <span>Offene Tickets</span>
                        <strong>42</strong>
                    </article>
                    <article className="stat-card">
                        <span>Kritisch</span>
                        <strong>5</strong>
                    </article>
                    <article className="stat-card">
                        <span>In Bearbeitung</span>
                        <strong>13</strong>
                    </article>
                </section>

                <section className="ticket-panel">
                    <div className="ticket-toolbar">
                        <div className="search-box">
                            <Search size={18} />
                            <input type="text" placeholder="Tickets suchen..." />
                        </div>

                        <button className="secondary-button">
                            <Filter size={17} />
                            Filter
                        </button>

                        <button className="secondary-button icon-only" aria-label="Sortierung">
                            <SlidersHorizontal size={17} />
                        </button>
                    </div>

                    <div className="ticket-table">
                        <div className="ticket-row ticket-head">
                            <span>ID</span>
                            <span>Titel</span>
                            <span>Status</span>
                            <span>Priorität</span>
                            <span>Bearbeiter</span>
                            <span>Erstellt</span>
                        </div>

                        {tickets.map((ticket) => (
                            <div className="ticket-row" key={ticket.id}>
                                <span className="ticket-id">{ticket.id}</span>
                                <span className="ticket-title">{ticket.title}</span>
                                <span><span className={statusClass(ticket.status)}>{ticket.status}</span></span>
                                <span><span className={priorityClass(ticket.priority)}>{ticket.priority}</span></span>
                                <span>{ticket.assignee}</span>
                                <span>{ticket.createdAt}</span>
                            </div>
                        ))}
                    </div>
                </section>
            </section>
        </main>
    );
}
