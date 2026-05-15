import {
  Plus,
  Search,
  Shield,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { BackendUser, deleteUser, getUsers } from "../API/users";
import { CreateRoleForm } from "../components/CreateRoleModal";
import { RegisterUserModal } from "../components/RegisterUserModal";
import { BackendRole, getRoles } from "../API/roles";
import AppSidebar from "../components/AppSidebar";


export default function UserManagementPage() {
  const [users, setUsers] = useState<BackendUser[]>([]);
  const [roles, setRoles] = useState<BackendRole[]>([]);
  const [query, setQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<BackendUser | null>(null);
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isRoleFormOpen, setIsRoleFormOpen] = useState(false);

  async function loadData() {
    setIsLoading(true);
    setError(null);

    try {
      const [loadedUsers, loadedRoles] = await Promise.all([getUsers(), getRoles()]);
      setUsers(loadedUsers);
      setRoles(loadedRoles);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Benutzerdaten konnten nicht geladen werden.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return users;

    return users.filter((user) =>
      [user.username, user.email, user.displayName, user.roleName ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [query, users]);

  const activeUsersCount = users.filter((user) => user.active).length;
  const inactiveUsersCount = users.length - activeUsersCount;

  function openCreateForm() {
    setSelectedUser(null);
    setIsUserFormOpen(true);
  }

  async function handleDelete(user: BackendUser) {
    if (!window.confirm(`Benutzer ${user.displayName} wirklich löschen?`)) return;

    setError(null);

    try {
      await deleteUser(user.userId);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Benutzer konnte nicht gelöscht werden.");
    }
  }

  return (
    <main className="overview-page">
      <AppSidebar activeItem="users" />

      <section className="overview-content">
        <header className="overview-header">
          <div>
            <p className="eyebrow">Administration</p>
            <h1>Benutzerverwaltung</h1>
          </div>

          <button className="primary-button" type="button" onClick={openCreateForm}>
            <Plus size={18} />
            Benutzer anlegen
          </button>

            <button className="primary-button" type="button" onClick={() => setIsRoleFormOpen(true)}>
                <Shield size={18} />
                Rolle anlegen
            </button>
        </header>

        <section className="stats-grid">
          <article className="stat-card">
            <span>Benutzer gesamt</span>
            <strong>{users.length}</strong>
          </article>
            <article className="stat-card">
                <span>Inaktiv</span>
                <strong>{inactiveUsersCount}</strong>
            </article>
            <article className="stat-card roles-card">
                <span>Verfügbare Rollen</span>
                <div className="roles-list">
                    {roles.length === 0 ? (
                        <strong>Keine Rollen</strong>) : (
                        roles.map((role) => (
                            <span className="role-pill" key={role.roleId}>
                                {role.roleName}
                            </span>
                        ))
                    )}
                </div>
            </article>
        </section>

        {error && <div className="user-alert">{error}</div>}

        <section className="ticket-panel">
          <div className="ticket-toolbar">
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Benutzer suchen..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>

            <button className="secondary-button" type="button" onClick={loadData}>
              Aktualisieren
            </button>
          </div>

          <div className="ticket-table user-table">
            <div className="ticket-row user-row ticket-head">
              <span>ID</span>
              <span>Name</span>
              <span>Benutzername</span>
              <span>E-Mail</span>
              <span>Rolle</span>
              <span>Status</span>
              <span>Aktionen</span>
            </div>

            {isLoading && <div className="user-empty-state">Benutzer werden geladen...</div>}

            {!isLoading && filteredUsers.length === 0 && (
              <div className="user-empty-state">Keine Benutzer gefunden.</div>
            )}

            {!isLoading && filteredUsers.map((user) => (
              <div className="ticket-row user-row" key={user.userId}>
                <span className="ticket-id">#{user.userId}</span>
                <span className="ticket-title">{user.displayName}</span>
                <span>{user.username}</span>
                <span>{user.email}</span>
                <span className="role-pill">
                  <Shield size={14} />
                  {user.roleName ?? "Keine Rolle"}
                </span>
                <span className={user.active ? "status status-erledigt" : "status status-abgelehnt"}>
                  {user.active ? "Aktiv" : "Inaktiv"}
                </span>
                <span className="user-actions">
                  <button className="secondary-button icon-only danger-button" type="button" onClick={() => handleDelete(user)} aria-label="Benutzer löschen">
                    <Trash2 size={16} />
                  </button>
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="stats-grid">
          <article className="stat-card">
            <span>Suchtreffer</span>
            <strong>{filteredUsers.length}</strong>
          </article>
        </section>
      </section>

      {isUserFormOpen && (
        <div className="modal-backdrop" onClick={() => setIsUserFormOpen(false)}>
          <div onClick={(event) => event.stopPropagation()}>
            <RegisterUserModal
              asModal
              roles={roles}
              onClose={() => {
                setIsUserFormOpen(false);
              }}
              onSaved={async () => {
                setIsUserFormOpen(false);
                await loadData();
              }}
            />
          </div>
        </div>
      )}
        {isRoleFormOpen && (
            <div className="modal-backdrop" onClick={() => setIsRoleFormOpen(false)}>
                <div onClick={(event) => event.stopPropagation()}>
                    <CreateRoleForm
                        asModal
                        onClose={() => setIsRoleFormOpen(false)}
                        onCreated={async () => {
                            setIsRoleFormOpen(false);
                            await loadData();
                        }}
                    />
                </div>
            </div>
        )}
    </main>
  );
}
