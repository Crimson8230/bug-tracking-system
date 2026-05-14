import { Bug, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { clearCurrentUser } from "../auth/currentUser";

type SidebarItemKey =
  | "overview"
  | "assigned"
  | "statistics"
  | "users"
  | "admin";

type NavItem = {
  key: SidebarItemKey;
  label: string;
  path: string;
};

const navItems: NavItem[] = [
  { key: "overview", label: "Übersicht", path: "/overview" },
  { key: "assigned", label: "Zugewiesene Tickets", path: "/overview" },
  { key: "statistics", label: "Statistik", path: "/overview" },
  { key: "users", label: "Benutzerverwaltung", path: "/users" },
  { key: "admin", label: "Adminbereich", path: "/overview" },
];

type AppSidebarProps = {
  activeItem: SidebarItemKey;
};

export default function AppSidebar({ activeItem }: AppSidebarProps) {
  const navigate = useNavigate();

  return (
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
        {navItems.map((item) => (
          <a
            key={item.key}
            className={activeItem === item.key ? "active" : undefined}
            href={item.path}
            onClick={(event) => {
              event.preventDefault();
              navigate(item.path);
            }}
          >
            {item.label}
          </a>
        ))}
      </nav>

        <button
            className="logout-button"
            type="button"
            onClick={() => {
                clearCurrentUser();
                navigate("/login");
            }}
        >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}
