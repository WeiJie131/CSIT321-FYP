import { X } from "lucide-react";
import { Link } from "react-router-dom";

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}

      <aside
        className={`sidebar ${isOpen ? "sidebar-open" : ""}`}
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

          <Link to="/login" onClick={onClose}>
            Login
          </Link>

          <Link to="/register" onClick={onClose}>
            Register
          </Link>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;