import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { LoginModal } from "./LoginModal";
import { RegisterModal } from "./RegisterModal";

export const Navbar = () => {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-content">
        {/* Left: Logo / Username */}
        <Link to="/" className="navbar-left">
          <div className="logo-circle">{isLoggedIn ? "U" : "G"}</div>
          <span className="navbar-brand">POMIFY</span>
        </Link>

        {/* Right: Dropdown */}
        <div className="navbar-right">
          {isLoggedIn ? (
            <div className="dropdown-container">
              <button
                className="btn-dropdown"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                ⚙️
              </button>
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/folders" onClick={() => setIsDropdownOpen(false)}>
                    Mis Carpetas
                  </Link>
                  <Link to="/music" onClick={() => setIsDropdownOpen(false)}>
                    Playlists
                  </Link>
                  <Link to="/profile" onClick={() => setIsDropdownOpen(false)}>
                    Perfil
                  </Link>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <button
                className="btn-outline"
                onClick={() => setShowRegister(true)}
              >
                Register
              </button>
              <button
                className="btn-primary"
                onClick={() => setShowLogin(true)}
              >
                Login
              </button>
            </div>
          )}
        </div>
      </div>

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSwitchToRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      )}

      {showRegister && (
        <RegisterModal
          onClose={() => setShowRegister(false)}
          onSwitchToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      )}

      {/* ===== STYLES ===== */}
      <style jsx>{`
        .navbar-container {
          width: 100%;
          background: var(--color-bg);
          padding: 1rem 2rem;
          display: flex;
          justify-content: center;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .navbar-content {
          width: 100%;
          max-width: 1200px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .navbar-left {
          display: flex;
          align-items: center;
          text-decoration: none;
        }
        .logo-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--color-btn-primary-bg);
          color: var(--color-btn-primary-text);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          margin-right: 0.5rem;
        }
        .navbar-brand {
          font-size: 1.25rem;
          font-weight: 900;
          letter-spacing: 0.05em;
          color: var(--color-text-primary);
        }
        .navbar-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .auth-buttons button {
          margin-left: 0.5rem;
        }
        .dropdown-container {
          position: relative;
        }
        .btn-dropdown {
          background: var(--color-btn-primary-bg);
          color: var(--color-btn-primary-text);
          border: none;
          padding: 0.5rem 0.75rem;
          border-radius: 6px;
          cursor: pointer;
          font-size: 1.2rem;
        }
        .dropdown-menu {
          position: absolute;
          right: 0;
          top: 110%;
          background: var(--color-surface);
          border-radius: 8px;
          padding: 0.5rem 0;
          min-width: 180px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
          z-index: 50;
        }
        .dropdown-menu a,
        .dropdown-menu button {
          padding: 0.75rem 1rem;
          text-decoration: none;
          color: var(--color-text-primary);
          background: transparent;
          border: none;
          text-align: left;
          cursor: pointer;
          font-size: 0.95rem;
          transition: background 0.2s ease;
        }
        .dropdown-menu a:hover,
        .dropdown-menu button:hover {
          background: rgba(45, 58, 74, 0.06);
        }
      `}</style>
    </nav>
  );
};