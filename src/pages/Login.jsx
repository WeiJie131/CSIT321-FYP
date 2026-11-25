
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import "../styles/Auth.css";

function Login() {

    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin(event) {

        event.preventDefault();

        setError("");
        setLoading(true);

        try {

            await login(email.trim(), password);

            navigate("/", { replace: true });

        } catch (err) {

            const message = err.message.toLowerCase();

            if (
                message.includes("not approved") ||
                message.includes("hook") ||
                message.includes("not active")
            ) {
                setError(
                    "Your account is pending approval or is currently unavailable. Please contact the administrator if necessary."
                );

            } else {
                setError(
                    "Unable to log in. Please check your credentials and account status."
                );
            }

        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page login-page">

            <header className="login-brand">

                <img
                    src="/gardenlens.png"
                    alt="GardenLens Logo"
                    className="login-logo"
                />

                <p>Singapore Botanic Gardens</p>

            </header>

            <img
                src="/login-image.jpg"
                alt="Singapore Botanic Gardens"
                className="login-banner"
            />

            <main className="auth-content">

                <h1 className="login-title">Login</h1>

                <form
                    className="auth-form"
                    onSubmit={handleLogin}
                >

                    <div className="auth-field">
                        <label htmlFor="login-email">
                            Email
                        </label>

                        <input
                            id="login-email"
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label htmlFor="login-password">
                            Password
                        </label>

                        <div className="password-field">

                            <input
                                id="login-password"
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                autoComplete="current-password"
                                required
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >
                                {showPassword
                                    ? <EyeOff size={19} />
                                    : <Eye size={19} />
                                }
                            </button>

                        </div>
                    </div>

                    {error && (
                        <p className="auth-error" role="alert">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    <Link
                        to="/register"
                        className="create-account-link"
                    >
                        Create New Account
                    </Link>

                </form>

                <Link to="/" className="skip-link">
                    Back to Homepage
                </Link>

            </main>

        </div>
    );
}

export default Login;
