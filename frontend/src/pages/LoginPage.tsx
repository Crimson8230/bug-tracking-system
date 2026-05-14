import { Bug } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers } from "../API/users";
import { setCurrentUser } from "../auth/currentUser";

export default function LoginPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleLogin(event: React.FormEvent) {
        event.preventDefault();

        setError("");
        setIsLoading(true);

        try {
            const users = await getUsers();
            const enteredUsername = username.trim().toLowerCase();

            const user = users.find(
                (u) => u.username.toLowerCase() === enteredUsername
            );

            if (!user) {
                setError("Benutzername wurde nicht gefunden.");
                return;
            }

            if (!user.active) {
                setError("Dieser Benutzer ist inaktiv.");
                return;
            }

            setCurrentUser(user);
            navigate("/overview");
        } catch (err) {
            console.error(err);
            setError("Benutzer konnten nicht geladen werden.");
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
                        placeholder="Username"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        required
                    />

                    {error && <p className="error-message">{error}</p>}

                    <button type="submit" disabled={isLoading}>
                        {isLoading ? "Prüfe..." : "Sign-In"}
                    </button>
                </form>
            </section>
        </main>
    );
}