import { Camera } from "lucide-react";
import { Link } from "react-router-dom";

function BottomNavbar() {
  return (
    <nav className="bottom-navbar">
      <Link
        to="/camera"
        className="camera-button"
        aria-label="Open camera"
      >
        <Camera size={32} strokeWidth={1.8} />
      </Link>
    </nav>
  );
}

export default BottomNavbar;