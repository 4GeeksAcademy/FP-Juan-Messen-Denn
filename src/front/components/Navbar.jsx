import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { LoginModal } from "./LoginModal";
import { RegisterModal } from "./RegisterModal";
import { getGoals, updateGoal, deleteGoal } from "./goals/GoalsService";

const backend_url = import.meta.env.VITE_BACKEND_URL;

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState(null);

  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [goals, setGoals] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [selectedGoal, setSelectedGoal] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    if (token) fetchUser();
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".user-dropdown-container")) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchUser = async () => {
    const res = await fetch(`${backend_url}/api/user/profile`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    if (!res.ok) return;
    const data = await res.json();
    setUser(data);
  };

  const fetchGoals = async () => {
    const data = await getGoals();
    if (data) setGoals(data.filter(g => g));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUser(null);
    window.location.href = "/";
  };

  const openGoalsModal = () => {
    fetchGoals();
    setShowGoalsModal(true);
  };

  const saveEdit = async (id) => {
    if (!editingText.trim()) return;
    const data = await updateGoal(id, { title: editingText });
    if (!data?.goal) return;
    setGoals(goals.map(g => g.id === id ? data.goal : g));
    setEditingId(null);
    setEditingText("");
  };

  const handleDelete = async (id) => {
    await deleteGoal(id);
    setGoals(goals.filter(g => g.id !== id));
    if (selectedGoal === id) setSelectedGoal(null);
  };

  const changeStatus = async (id, status) => {
    const data = await updateGoal(id, { status });
    if (!data?.goal) return;
    setGoals(goals.map(g => g.id === id ? data.goal : g));
  };

  const getInitial = () => {
    if (!user) return "U";
    return (user.name || user.email || "U")[0].toUpperCase();
  };

  const renderAvatar = () => {
    if (!user?.avatar_url) return getInitial();
    if (user.avatar_url.startsWith("http")) {
      return <img src={user.avatar_url} alt="avatar" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />;
    }
    return <span style={{ fontSize: "1.1rem" }}>{user.avatar_url}</span>;
  };

  const statusColors = {
    urgent: { bg: "rgba(230,57,70,0.15)", color: "#e63946", active: "#e63946" },
    progress: { bg: "rgba(168,218,220,0.3)", color: "#457b9d", active: "#457b9d" },
    done: { bg: "rgba(69,123,157,0.15)", color: "#457b9d", active: "#457b9d" }
  };

  return (
    <>
      <nav className="navbar-container">
        <div className="navbar-content">

          {/* Left: POMIFY */}
          <Link to="/" className="navbar-left">
            <span className="navbar-brand">POMIFY</span>
          </Link>

          {/* Center: Your Goals */}
          {isLoggedIn && (
            <button className="btn-goals-center" onClick={openGoalsModal}>
              Your Goals
            </button>
          )}

          {/* Right: Auth o User */}
          <div className="navbar-right">
            {isLoggedIn ? (
              <div className="user-dropdown-container">
                <button
                  className="user-pill"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span className="user-name">{user?.name || "Usuario"}</span>
                  <div className="user-avatar">
                    {renderAvatar()}
                  </div>
                </button>

                {isDropdownOpen && (
                  <div className="dropdown-menu">
                    <Link to="/profile" onClick={() => setIsDropdownOpen(false)}>
                      Editar perfil
                    </Link>
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <button className="btn-outline" onClick={() => setShowRegister(true)}>Register</button>
                <button className="btn-primary" onClick={() => setShowLogin(true)}>Login</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Goals Modal */}
      {showGoalsModal && (
        <div className="gmodal-overlay" onClick={() => setShowGoalsModal(false)}>
          <div className="gmodal-box" onClick={e => e.stopPropagation()}>

            <div className="gmodal-header">
              <h2>Your Goals</h2>
              <button className="gmodal-close" onClick={() => setShowGoalsModal(false)}>✕</button>
            </div>

            <div className="gmodal-list">
              {goals.length === 0 && (
                <p style={{ color: "var(--color-text-secondary)", textAlign: "center", padding: "1rem" }}>
                  No tienes metas todavía.
                </p>
              )}
              {goals.map(goal => (
                <div key={goal.id} className="gmodal-item">
                  <div className="gmodal-item-top">
                    {editingId === goal.id ? (
                      <input
                        className="gmodal-edit-input"
                        value={editingText}
                        onChange={e => setEditingText(e.target.value)}
                        onBlur={() => saveEdit(goal.id)}
                        onKeyDown={e => e.key === "Enter" && saveEdit(goal.id)}
                        autoFocus
                      />
                    ) : (
                      <span className="gmodal-title" onDoubleClick={() => { setEditingId(goal.id); setEditingText(goal.title); }}>
                        {goal.title}
                      </span>
                    )}
                    <div className="gmodal-actions">
                      <button onClick={() => { setEditingId(goal.id); setEditingText(goal.title); }}>✏</button>
                      <button onClick={() => handleDelete(goal.id)}>🗑</button>
                    </div>
                  </div>

                  <div className="gmodal-status">
                    {["urgent", "progress", "done"].map(s => (
                      <button
                        key={s}
                        onClick={() => changeStatus(goal.id, s)}
                        style={{
                          flex: 1,
                          padding: "5px 0",
                          borderRadius: "25px",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "0.72rem",
                          whiteSpace: "nowrap",
                          transition: "all 0.2s ease",
                          background: goal.status === s ? statusColors[s].active : statusColors[s].bg,
                          color: goal.status === s ? "white" : statusColors[s].color,
                          height: "auto",
                          overflow: "visible",
                          display: "inline-block",
                          lineHeight: "1.5"
                        }}
                      >
                        {s === "urgent" ? "Urgent" : s === "progress" ? "In Progress" : "Done"}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="gmodal-footer">
              <button className="btn-primary" onClick={() => { setShowGoalsModal(false); navigate("/goals"); }}>
                View All
              </button>
            </div>

          </div>
        </div>
      )}

      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} onSwitchToRegister={() => { setShowLogin(false); setShowRegister(true); }} />
      )}
      {showRegister && (
        <RegisterModal onClose={() => setShowRegister(false)} onSwitchToLogin={() => { setShowRegister(false); setShowLogin(true); }} />
      )}

      <style jsx>{`
        .navbar-container {
          width: 100%;
          background: var(--color-bg);
          padding: 1rem 2rem;
          display: flex;
          justify-content: center;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
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
          min-width: 120px;
        }
        .navbar-brand {
          font-size: 1.25rem;
          font-weight: 900;
          letter-spacing: 0.05em;
          color: var(--color-text-primary);
        }
        .btn-goals-center {
          display: flex;
          align-items: center;
          background: var(--color-surface);
          border: 1px solid var(--color-divider);
          border-radius: 999px;
          padding: 5px 16px;
          height: 42px;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--color-text-primary);
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .btn-goals-center:hover {
          background: var(--color-divider);
        }
        .navbar-right {
          display: flex;
          align-items: center;
          min-width: 120px;
          justify-content: flex-end;
        }
        .auth-buttons button { margin-left: 0.5rem; }
        .user-dropdown-container { position: relative; }
        .user-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--color-surface);
          border: 1px solid var(--color-divider);
          border-radius: 999px;
          padding: 5px 5px 5px 12px;
          height: 42px;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .user-pill:hover {
          background: var(--color-divider);
        }
        .user-avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: var(--color-btn-primary-bg);
          color: var(--color-btn-primary-text);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.8rem;
          overflow: hidden;
          flex-shrink: 0;
        }
        .user-name {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--color-text-primary);
        }
        .dropdown-menu {
          position: absolute;
          right: 0;
          top: calc(100% + 8px);
          background: var(--color-surface);
          border-radius: 10px;
          padding: 0.5rem 0;
          min-width: 160px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
          border: 0.5px solid var(--color-divider);
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
          font-size: 0.9rem;
          transition: background 0.2s ease;
        }
        .dropdown-menu a:hover,
        .dropdown-menu button:hover { background: rgba(45,58,74,0.06); }
        .gmodal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .gmodal-box {
          background: var(--color-surface);
          border-radius: 16px;
          width: 100%;
          max-width: 480px;
          max-height: 75vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
        }
        .gmodal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid rgba(0,0,0,0.06);
        }
        .gmodal-header h2 { margin: 0; font-size: 1.1rem; }
        .gmodal-close {
          background: transparent;
          border: none;
          font-size: 1rem;
          cursor: pointer;
          color: var(--color-text-secondary);
        }
        .gmodal-list {
          flex: 1;
          overflow-y: auto;
          padding: 1rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .gmodal-item {
          background: var(--color-bg);
          border-radius: 10px;
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .gmodal-item-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
        }
        .gmodal-title {
          font-size: 0.95rem;
          color: var(--color-text-primary);
          cursor: pointer;
          flex: 1;
        }
        .gmodal-edit-input {
          flex: 1;
          border: 1px solid var(--color-divider);
          border-radius: 6px;
          padding: 4px 8px;
          font-size: 0.9rem;
          background: var(--color-surface);
          color: var(--color-text-primary);
        }
        .gmodal-actions {
          display: flex;
          gap: 6px;
        }
        .gmodal-actions button {
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 13px;
          opacity: 0.6;
          transition: opacity 0.2s;
        }
        .gmodal-actions button:hover { opacity: 1; }
        .gmodal-status { display: flex; gap: 8px; }
        .gmodal-footer {
          padding: 1rem 1.5rem;
          border-top: 1px solid rgba(0,0,0,0.06);
          display: flex;
          justify-content: flex-end;
        }
      `}</style>
    </>
  );
};