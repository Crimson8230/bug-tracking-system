import { Filter, Plus, Search, SlidersHorizontal } from "lucide-react";
import {useEffect, useState} from "react";
import {getTickets, type BackendTicket} from "../API/tickets";
import TicketDetailModal from "../components/TicketDetailModal";
import CreateCategoryModal from "../components/CreateCategoryModal";
import {ReportBugForm} from "../components/ReportBugModal";
import AppSidebar from "../components/AppSidebar";
import {
    statusLabels,
    priorityLabels,
    statusClasses,
    priorityClasses,
    getCategoryStyle,
} from "../utils/ticketDisplay";
import { getAuthSession } from "../auth/auth";

export default function BugOverviewPage() {

    const [tickets, setTickets] = useState<BackendTicket[]>([]);
    const [showReportBugModal, setShowReportBugModal] = useState(false);
    const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false);
    const [selectedTicket, setSelectedTicket] =
        useState<BackendTicket | null>(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [showClosedTickets, setShowClosedTickets] = useState(false);
    const [showOnlyMyTickets, setShowOnlyMyTickets] = useState(false);
    const currentUser = getAuthSession()?.user;

    type SortKey =
        | "ticketId"
        | "title"
        | "status"
        | "priority"
        | "categoryName"
        | "reportedByUsername"
        | "assignedToUsername"
        | "createdAt";

    const [sortKey, setSortKey] = useState<SortKey>("ticketId");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");


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

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDirection((current) => current === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortDirection("asc");
        }
    };

    const filteredTickets = tickets.filter((ticket) => {
        const search = searchTerm.toLowerCase().trim();

        const matchesSearch =
            !search ||
            ticket.title.toLowerCase().includes(search) ||
            (ticket.description ?? "").toLowerCase().includes(search);

        const matchesClosedFilter = showClosedTickets
            ? (ticket.status === "DONE" || ticket.status === "CANCELLED")
            : (ticket.status !== "DONE" && ticket.status !== "CANCELLED");

        const matchesAssignedFilter =
            !showOnlyMyTickets ||
            ticket.assignedToId === currentUser?.userId;

        return (
            matchesSearch &&
            matchesClosedFilter &&
            matchesAssignedFilter
        );
    });

    const sortedTickets = [...filteredTickets].sort((a, b) => {
        const aValue = a[sortKey] ?? "";
        const bValue = b[sortKey] ?? "";

        if (sortKey === "createdAt") {
            return sortDirection === "asc"
                ? new Date(aValue).getTime() - new Date(bValue).getTime()
                : new Date(bValue).getTime() - new Date(aValue).getTime();
        }

        if (typeof aValue === "number" && typeof bValue === "number") {
            return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        }

        return sortDirection === "asc"
            ? String(aValue).localeCompare(String(bValue))
            : String(bValue).localeCompare(String(aValue));
    });

    return (
        <main className="overview-page">
            <AppSidebar activeItem="overview" />

            <section className="overview-content">
                <header className="overview-header">
                    <div>
                        <p className="eyebrow">Ticket-System</p>
                        <h1>Bug Übersicht</h1>
                    </div>

                    <div style={{ display: "flex", gap: "0.75rem" }}>
                        <button
                            className="secondary-button"
                            type="button"
                            onClick={() => setShowCreateCategoryModal(true)}
                        >
                            <Plus size={18} />
                            Neue Kategorie
                        </button>

                        <button
                            className="primary-button"
                            type="button"
                            onClick={() => setShowReportBugModal(true)}
                        >
                            <Plus size={18} />
                            Report Bug
                        </button>
                    </div>
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
                            <input
                                type="text"
                                placeholder="Tickets suchen..."
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                            />
                        </div>

                        <button
                            className={`secondary-button ${showClosedTickets ? "active" : ""}`}
                            type="button"
                            onClick={() => setShowClosedTickets((current) => !current)}
                        >
                            <Filter size={17} />
                            {showClosedTickets
                                ? "Offene Tickets anzeigen"
                                : "Geschlossene Tickets anzeigen"}
                        </button>

                        <button
                            className={`secondary-button ${showOnlyMyTickets ? "active" : ""}`}
                            type="button"
                            onClick={() => setShowOnlyMyTickets((current) => !current)}
                        >
                            <SlidersHorizontal size={17} />
                            {showOnlyMyTickets ? "Alle Tickets zeigen" : "Meine Tickets zeigen"}
                        </button>
                    </div>

                    <div className="ticket-table">
                        <div className="ticket-row ticket-head">
                            <button onClick={() => handleSort("ticketId")}>ID</button>
                            <button onClick={() => handleSort("title")}>Titel</button>
                            <button onClick={() => handleSort("status")}>Status</button>
                            <button onClick={() => handleSort("priority")}>Priorität</button>
                            <button onClick={() => handleSort("categoryName")}>Kategorie</button>
                            <button onClick={() => handleSort("reportedByUsername")}>gemeldet von</button>
                            <button onClick={() => handleSort("assignedToUsername")}>Bearbeiter</button>
                            <button onClick={() => handleSort("createdAt")}>Meldedatum</button>
                        </div>

                        {sortedTickets.map((ticket) => (
                            <div className="ticket-row" key={ticket.ticketId}
                                 onClick={() => setSelectedTicket(ticket)}>
                                <span className="ticket-id">#{ticket.ticketId}</span>
                                <span className="ticket-title">{ticket.title}</span>
                                <span className={`status ${statusClasses[ticket.status]}`}>
                                    {statusLabels[ticket.status]}
                                </span>
                                <span className={`priority ${priorityClasses[ticket.priority]}`}>
                                    {priorityLabels[ticket.priority]}
                                </span>
                                <span
                                    className="category-badge"
                                    style={getCategoryStyle(ticket.categoryName)}>
                                    {ticket.categoryName ?? "Keine Kategorie"}
                                </span>
                                <span>{ticket.reportedByUsername}</span>
                                <span>{ticket.assignedToUsername ?? "Nicht zugewiesen"}</span>
                                <span>
                                    {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString("de-DE") : "-"}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            </section>
            <TicketDetailModal
                ticket={selectedTicket}
                onClose={() => setSelectedTicket(null)}
                onTicketUpdated={(updatedTicket) => {
                    setTickets((currentTickets) =>
                        currentTickets.map((ticket) =>
                            ticket.ticketId === updatedTicket.ticketId
                                ? updatedTicket
                                : ticket
                        )
                    );

                    setSelectedTicket(updatedTicket);
                }}
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
                            onCreated={async () => {
                                setShowReportBugModal(false);
                                const updatedTickets = await getTickets();
                                setTickets(updatedTickets);
                            }}
                        />
                    </div>
                </div>
            )}
            {showCreateCategoryModal && (
                <div
                    className="modal-backdrop"
                    onClick={() => setShowCreateCategoryModal(false)}
                >
                    <div onClick={(e) => e.stopPropagation()}>
                        <CreateCategoryModal
                            asModal
                            onClose={() => setShowCreateCategoryModal(false)}
                            onCreated={() => {
                                setShowCreateCategoryModal(false);
                            }}
                        />
                    </div>
                </div>
            )}
        </main>
    );
}
