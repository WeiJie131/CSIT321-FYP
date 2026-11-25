
import { X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Sidebar({ isOpen, onClose }) {

    const { user, profile, logout } = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {

        try {
            await logout();
            onClose();
            navigate("/");
        } catch {
            alert("Unable to log out. Please try again.");
        }
    }

    return (
        <>
            {isOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={onClose}
                />
            )}

            <aside
                className={`sidebar ${
                    isOpen ? "sidebar-open" : ""
                }`}
                inert={!isOpen}
            >

                <div className="sidebar-header">

                    <h2>GardenLens</h2>

                    <button
                        className="close-button"
                        onClick={onClose}
                        aria-label="Close navigation menu"
                    >
                        <X size={25} />
                    </button>

                </div>

                <nav className="sidebar-links">

                    {user && profile && (
                        <p className="sidebar-welcome">
                            Welcome, {profile.full_name}
                        </p>
                    )}

                    <Link to="/" onClick={onClose}>
                        Home
                    </Link>

                    <Link to="/trails" onClick={onClose}>
                        Trail Games
                    </Link>

                    <Link to="/favourites" onClick={onClose}>
                        Favourites
                    </Link>

                    <Link to="/history" onClick={onClose}>
                        Recognition History
                    </Link>

                    <Link to="/account" onClick={onClose}>
                        Account Details
                    </Link>

                    <Link to="/feedback" onClick={onClose}>
                        Feedback Form
                    </Link>

                    <hr />

                    {user ? (

                        <button
                            className="sidebar-logout"
                            onClick={handleLogout}
                        >
                            Log Out
                        </button>

                    ) : (

                        <>
                            <Link to="/login" onClick={onClose}>
                                Login
                            </Link>

                            <Link to="/register" onClick={onClose}>
                                Register
                            </Link>
                        </>

                    )}

                </nav>

            </aside>
        </>
    );
}

export default Sidebar;
