import { LogOut, Bug, Filter, Plus, Search, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {useEffect, useState} from "react";
import {getTickets} from "../API/tickets";
import TicketDetailModal from "../components/TicketDetailModal";
import {ReportBugForm} from "../components/ReportBugModal";

type BackendTicket = {
    ticket_id: number;
    title: string;
    description: string;
    status: "OPEN" | "IN_ANALYSIS" | "IN_PROGRESS" | "DONE" | "CANCELLED";
    priority: "LOW" | "MEDIUM" | "HIGH";
    created_at: string;
    updated_at?: string;
};

export default function BugOverviewPage() {

    const navigate = useNavigate();
    const [tickets, setTickets] = useState<BackendTicket[]>([]);
    const [showReportBugModal, setShowReportBugModal] = useState(false);
    const [selectedTicket, setSelectedTicket] =
        useState<BackendTicket | null>(null);


    useEffect(() => {
        getTickets()
            .then(setTickets)
            .catch(console.error);
    }, []);

    const openTicketsCount = tickets.filter(
        (ticket) => ticket.status !== "DONE" && ticket.status !== "CANCELLED"
    ).length;

    const criticalTicketsCount = tickets.filter(
        (ticket) => ticket.priority === "HIGH"
    ).length;

    const inProgressTicketsCount = tickets.filter(
        (ticket) => ticket.status === "IN_PROGRESS"
    ).length;

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
                        onClick={() => setShowReportBugModal(true)}
                    >
                        <Plus size={18} />
                        Report Bug
                    </button>
                </header>

                <section className="stats-grid">
                    <article className="stat-card">
                        <span>Offene Tickets</span>
                        <strong>{openTicketsCount}</strong>
                    </article>

                    <article className="stat-card">
                        <span>Kritisch</span>
                        <strong>{criticalTicketsCount}</strong>
                    </article>

                    <article className="stat-card">
                        <span>In Bearbeitung</span>
                        <strong>{inProgressTicketsCount}</strong>
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
                            <div className="ticket-row" key={ticket.ticket_id}
                                onClick={() => setSelectedTicket(ticket)}>
                                <span className="ticket-id">#{ticket.ticket_id}</span>
                                <span className="ticket-title">{ticket.title}</span>
                                <span>{ticket.status}</span>
                                <span>{ticket.priority}</span>
                                <span>Nicht zugewiesen</span>
                                <span>
                                    {new Date(ticket.created_at).toLocaleDateString("de-DE")}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            </section>
            <TicketDetailModal
                ticket={selectedTicket}
                onClose={() => setSelectedTicket(null)}
            />
            {showReportBugModal && (
                <div
                    className="modal-backdrop"
                    onClick={() => setShowReportBugModal(false)}
                >
                    <div onClick={(e) => e.stopPropagation()}>
                        <ReportBugForm
                            asModal
                            onClose={() => setShowReportBugModal(false)}
                            onCreated={() => {
                                setShowReportBugModal(false);
                                getTickets();
                            }}
                        />
                    </div>
                </div>
            )}
        </main>
    );
}
