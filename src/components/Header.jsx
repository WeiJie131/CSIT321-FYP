import { Menu } from "lucide-react";

function Header({ onMenuClick }) {
  return (
    <header className="header">
      <button
        className="menu-button"
        onClick={onMenuClick}
        aria-label="Open navigation menu"
      >
        <Menu size={25} />
      </button>

      <img
        src="/gardenlens.png"
        alt="GardenLens Logo"
        className="header-logo"
      />
    </header>
  );
}

export default Header;