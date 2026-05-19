import { Bug } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRoles, BackendRole } from "../API/roles";
import { login, setAuthSession } from "../auth/auth";
import { RegisterUserModal } from "../components/RegisterUserModal";

export default function LoginPage() {
    const navigate = useNavigate();

    const [usernameOrEmail, setUsernameOrEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [roles, setRoles] = useState<BackendRole[]>([]);

    useEffect(() => {
        async function loadRoles() {
            try {
                const loadedRoles = await getRoles();
                setRoles(loadedRoles);
            } catch (err) {
                console.error(err);
            }
        }

        loadRoles();
    }, []);

    async function handleLogin(event: React.FormEvent) {
        event.preventDefault();

        setError("");
        setIsLoading(true);

        try {
            const authResponse = await login({
                usernameOrEmail: usernameOrEmail.trim(),
                password,
            });

            if (!authResponse.user.active) {
                setError("Dieser Benutzer ist inaktiv.");
                return;
            }

            setAuthSession(authResponse);
            navigate("/overview");
        } catch (err) {
            console.error(err);
            setError("Login fehlgeschlagen. Benutzername/E-Mail oder Passwort ist falsch.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="login-page">
            <section className="login-card">
                <div className="login-icon">
                    <Bug className="bug-icon" size={60} />
                </div>

                <h1>BUG-REPORT-SYSTEM</h1>
                <p>Bitte melden Sie sich mit Ihrem Benutzerkonto an.</p>

                <form className="login-form" onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Username oder E-Mail"
                        value={usernameOrEmail}
                        onChange={(event) => setUsernameOrEmail(event.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Passwort"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                    />

                    {error && <p className="error-message">{error}</p>}

                    <button type="submit" disabled={isLoading}>
                        {isLoading ? "Melde an..." : "Sign-In"}
                    </button>

                    <button
                        type="button"
                        className="secondary-button"
                        onClick={() => setIsRegisterOpen(true)}
                    >
                        Benutzer registrieren
                    </button>
                </form>
            </section>

            {isRegisterOpen && (
                <div className="modal-backdrop" onClick={() => setIsRegisterOpen(false)}>
                    <div onClick={(event) => event.stopPropagation()}>
                        <RegisterUserModal
                            asModal
                            roles={roles}
                            onClose={() => setIsRegisterOpen(false)}
                            onSaved={() => setIsRegisterOpen(false)}
                        />
                    </div>
                </div>
            )}
        </main>
    );
}