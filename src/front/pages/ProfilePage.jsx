import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/profile.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AVATARS = ["🐱", "🐻", "🐰", "🐥", "🐼", "😎"];

const PASSWORD_RULES = [
    { id: "length", label: "At least 8 characters",      test: (p) => p.length >= 8 },
    { id: "number", label: "At least 1 number",           test: (p) => /\d/.test(p) },
    { id: "symbol", label: "At least 1 symbol (!@#$…)",  test: (p) => /[^a-zA-Z0-9]/.test(p) },
];

const getStrength = (password) => {
    const passed = PASSWORD_RULES.filter(r => r.test(password)).length;
    if (passed === 0) return { level: 0, label: "",        color: "transparent" };
    if (passed === 1) return { level: 1, label: "Weak",   color: "#E05252" };
    if (passed === 2) return { level: 2, label: "Fair",   color: "#E0A852" };
    return               { level: 3, label: "Strong", color: "#52A87C" };
};

export const ProfilePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showAvatarPicker, setShowAvatarPicker] = useState(false);
    const [pendingAvatar, setPendingAvatar] = useState(undefined); // undefined = no change

    const [editName, setEditName] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [editPassword, setEditPassword] = useState("");
    const [editPasswordConfirm, setEditPasswordConfirm] = useState("");
    const [passwordTouched, setPasswordTouched] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [editError, setEditError] = useState("");
    const [editSuccess, setEditSuccess] = useState(false);

    const strength = getStrength(editPassword);
    const allRulesPassed = PASSWORD_RULES.every(r => r.test(editPassword));

    useEffect(() => {
        const load = async () => {
            const res = await fetch(`${BACKEND_URL}/api/user/profile`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            if (!res.ok) { navigate("/"); return; }
            const data = await res.json();
            setUser(data);
        };
        load();
    }, []);

    const handleOpenEdit = () => {
        setEditName(user.name || "");
        setEditEmail(user.email || "");
        setEditPassword("");
        setEditPasswordConfirm("");
        setPasswordTouched(false);
        setShowPassword(false);
        setShowPasswordConfirm(false);
        setEditError("");
        setEditSuccess(false);
        setShowEditModal(true);
    };

    const handleSaveEdit = async () => {
        if (!editName.trim() || !editEmail.trim()) {
            setEditError("Name and email are required.");
            return;
        }
        if (editPassword) {
            if (!allRulesPassed) {
                setEditError("Password does not meet security requirements.");
                return;
            }
            if (editPassword !== editPasswordConfirm) {
                setEditError("Passwords do not match.");
                return;
            }
        }

        const body = { name: editName.trim(), email: editEmail.trim() };
        if (editPassword) body.password = editPassword;

        const res = await fetch(`${BACKEND_URL}/api/user/profile`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            const err = await res.json();
            setEditError(err.message || "Error updating profile.");
            return;
        }

        const data = await res.json();
        setUser(data.user);
        setEditSuccess(true);
        setTimeout(() => { setShowEditModal(false); setEditSuccess(false); }, 1200);
    };

    const handleSelectAvatar = (emoji) => {
        setPendingAvatar(emoji || null);
        setShowAvatarPicker(false);
    };

    const handleSaveProfile = async () => {
        const body = {};
        if (pendingAvatar !== undefined) body.avatar_url = pendingAvatar;
        if (editName.trim()) body.name = editName.trim();
        if (editEmail.trim()) body.email = editEmail.trim();
        if (editPassword) {
            if (!allRulesPassed) {
                setEditError("Password does not meet security requirements.");
                return;
            }
            if (editPassword !== editPasswordConfirm) {
                setEditError("Passwords do not match.");
                return;
            }
            body.password = editPassword;
        }

        if (Object.keys(body).length === 0) {
            navigate("/home");
            return;
        }

        const res = await fetch(`${BACKEND_URL}/api/user/profile`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            const err = await res.json();
            setEditError(err.message || "Error updating profile.");
            return;
        }

        const data = await res.json();
        setUser(data.user);
        setPendingAvatar(undefined);
        navigate("/home");
    };

    const handleDeleteAccount = async () => {
        await fetch(`${BACKEND_URL}/api/user/profile`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        localStorage.removeItem("token");
        navigate("/");
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    if (!user) return <div className="prof-loading">Loading...</div>;

    return (
        <div className="prof-page">
            <div className="prof-card">

                {/* BOTÓN HOME */}
                <div className="prof-top-bar">
                    <button
                        className="prof-btn-home"
                        onClick={() => navigate("/home")}
                    >← Home</button>
                    {pendingAvatar !== undefined && (
                        <button
                            className="prof-btn-home"
                            onClick={handleSaveProfile}
                            style={{ margin: 0 }}
                        >Save changes</button>
                    )}
                </div>

                <div className="prof-avatar prof-avatar-clickable" onClick={() => setShowAvatarPicker(!showAvatarPicker)}>
                    {(pendingAvatar !== undefined ? pendingAvatar : user.avatar_url)
                        ? <span className="prof-avatar-emoji">{pendingAvatar !== undefined ? pendingAvatar : user.avatar_url}</span>
                        : <span className="prof-avatar-placeholder">👤</span>
                    }
                    <div className="prof-avatar-overlay">✏️</div>
                </div>

                {showAvatarPicker && (
                    <div className="prof-avatar-picker">
                        {AVATARS.map(emoji => (
                            <button
                                key={emoji}
                                className={`prof-avatar-option ${(pendingAvatar !== undefined ? pendingAvatar : user.avatar_url) === emoji ? "selected" : ""}`}
                                onClick={() => handleSelectAvatar(emoji)}
                            >{emoji}</button>
                        ))}
                        {(pendingAvatar !== undefined ? pendingAvatar : user.avatar_url) && (
                            <button
                                className="prof-avatar-option prof-avatar-remove"
                                onClick={() => handleSelectAvatar(null)}
                                title="Remove avatar"
                            >✕</button>
                        )}
                    </div>
                )}

                <h2 className="prof-name">{user.name}</h2>
                <p className="prof-email">{user.email}</p>

                <button className="prof-btn-edit" onClick={handleOpenEdit}>edit profile</button>
                <button className="prof-btn-logout" onClick={() => setShowLogoutModal(true)}>logout</button>
                <button className="prof-btn-delete" onClick={() => setShowDeleteModal(true)}>delete account</button>
            </div>

            {showEditModal && (
                <div className="prof-overlay" onClick={() => setShowEditModal(false)}>
                    <div className="prof-modal" onClick={e => e.stopPropagation()}>
                        <div className="prof-modal-header">
                            <span className="prof-modal-title">Edit profile</span>
                            <button className="prof-modal-close" onClick={() => setShowEditModal(false)}>✕</button>
                        </div>
                        <div className="prof-modal-body">
                            <label className="prof-label">Name</label>
                            <input className="prof-input" value={editName} onChange={e => setEditName(e.target.value)} placeholder="Your name..." />

                            <label className="prof-label">Email</label>
                            <input className="prof-input" type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} placeholder="Tu email..." />

                            <label className="prof-label">New password <span className="prof-label-optional">(optional)</span></label>
                            <div className="prof-input-wrapper">
                                <input
                                    className="prof-input"
                                    type={showPassword ? "text" : "password"}
                                    value={editPassword}
                                    onChange={e => { setPasswordTouched(true); setEditPassword(e.target.value); }}
                                    placeholder="Minimum 8 characters..."
                                />
                                <button type="button" className="prof-toggle-password" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? "●" : "○"}
                                </button>
                            </div>

                            {passwordTouched && editPassword.length > 0 && (
                                <div className="prof-strength-wrapper">
                                    <div className="prof-strength-track">
                                        <div className="prof-strength-fill" style={{ width: `${(strength.level / 3) * 100}%`, background: strength.color }} />
                                    </div>
                                    <span className="prof-strength-label" style={{ color: strength.color }}>{strength.label}</span>
                                    <ul className="prof-rules">
                                        {PASSWORD_RULES.map(rule => {
                                            const ok = rule.test(editPassword);
                                            return (
                                                <li key={rule.id} className={ok ? "prof-rule-ok" : "prof-rule-fail"}>
                                                    <span>{ok ? "✓" : "✗"}</span> {rule.label}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            )}

                            <label className="prof-label">Confirm password</label>
                            <div className="prof-input-wrapper">
                                <input
                                    className="prof-input"
                                    type={showPasswordConfirm ? "text" : "password"}
                                    value={editPasswordConfirm}
                                    onChange={e => setEditPasswordConfirm(e.target.value)}
                                    placeholder="Repeat your password..."
                                />
                                <button type="button" className="prof-toggle-password" onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}>
                                    {showPasswordConfirm ? "●" : "○"}
                                </button>
                            </div>

                            {editError && <p className="prof-error">{editError}</p>}
                            {editSuccess && <p className="prof-success">✓ Saved successfully</p>}
                        </div>
                        <div className="prof-modal-actions">
                            <button className="prof-btn-cancel" onClick={() => setShowEditModal(false)}>Cancelar</button>
                            <button className="prof-btn-primary" onClick={handleSaveEdit}>Guardar cambios</button>
                        </div>
                    </div>
                </div>
            )}

            {showLogoutModal && (
                <div className="prof-overlay" onClick={() => setShowLogoutModal(false)}>
                    <div className="prof-modal prof-modal-confirm" onClick={e => e.stopPropagation()}>
                        <div className="prof-modal-title">Sign out?</div>
                        <p className="prof-confirm-text">Your current session will be closed.</p>
                        <div className="prof-modal-actions">
                            <button className="prof-btn-cancel" onClick={() => setShowLogoutModal(false)}>Cancel</button>
                            <button className="prof-btn-primary" onClick={handleLogout}>Yes, sign out</button>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="prof-overlay" onClick={() => setShowDeleteModal(false)}>
                    <div className="prof-modal prof-modal-confirm" onClick={e => e.stopPropagation()}>
                        <div className="prof-modal-icon">🗑️</div>
                        <div className="prof-modal-title">Delete account?</div>
                        <p className="prof-confirm-text">This action is permanent and cannot be undone.</p>
                        <div className="prof-modal-actions">
                            <button className="prof-btn-cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                            <button className="prof-btn-danger" onClick={handleDeleteAccount}>Yes, delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};