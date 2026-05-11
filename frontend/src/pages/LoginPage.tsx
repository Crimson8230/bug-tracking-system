import { Bug } from "lucide-react";
import { useNavigate } from "react-router-dom";



export default function LoginPage() {

    const navigate = useNavigate();

    return (
        <main className="login-page">
            <section className="login-card">
                <div className="login-icon">
                    <Bug className="bug-icon" size={60} />
                </div>

                <h1>BUG-REPORT-SYSTEM</h1>
                <p>Bitte melden Sie sich mit Ihrem Benutzerkonto an.</p>

                <form
                    className="login-form"
                    onSubmit={(event) => {
                        event.preventDefault();
                        navigate("/overview");
                    }}
                    >
                    <input type="text" placeholder="user" />
                    <input type="password" placeholder="password" />

                    <button type="submit">Sign-In</button>

                </form>
            </section>
        </main>
    );
}