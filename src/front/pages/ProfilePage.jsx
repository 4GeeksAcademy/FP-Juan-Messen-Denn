import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/profile.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AVATARS = ["🐱", "🐻", "🐰", "🐥", "🐼", "😎"];

const PASSWORD_RULES = [
    { id: "length", label: "Al menos 8 caracteres",      test: (p) => p.length >= 8 },
    { id: "number", label: "Al menos 1 número",           test: (p) => /\d/.test(p) },
    { id: "symbol", label: "Al menos 1 símbolo (!@#$…)",  test: (p) => /[^a-zA-Z0-9]/.test(p) },
];

const getStrength = (password) => {
    const passed = PASSWORD_RULES.filter(r => r.test(password)).length;
    if (passed === 0) return { level: 0, label: "",        color: "transparent" };
    if (passed === 1) return { level: 1, label: "Débil",   color: "#E05252" };
    if (passed === 2) return { level: 2, label: "Regular", color: "#E0A852" };
    return               { level: 3, label: "Fuerte",  color: "#52A87C" };
};

export const ProfilePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showAvatarPicker, setShowAvatarPicker] = useState(false);

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
            setEditError("Nombre y email son obligatorios.");
            return;
        }
        if (editPassword) {
            if (!allRulesPassed) {
                setEditError("La contraseña no cumple los requisitos de seguridad.");
                return;
            }
            if (editPassword !== editPasswordConfirm) {
                setEditError("Las contraseñas no coinciden.");
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
            setEditError(err.message || "Error al actualizar.");
            return;
        }

        const data = await res.json();
        setUser(data.user);
        setEditSuccess(true);
        setTimeout(() => { setShowEditModal(false); setEditSuccess(false); }, 1200);
    };

    const handleSelectAvatar = async (emoji) => {
        const res = await fetch(`${BACKEND_URL}/api/user/profile`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ avatar_url: emoji })
        });
        if (res.ok) {
            const data = await res.json();
            setUser(data.user);
        }
        setShowAvatarPicker(false);
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

    if (!user) return <div className="prof-loading">Cargando...</div>;

    return (
        <div className="prof-page">
            <div className="prof-card">

                {/* BOTÓN HOME */}
                <div className="prof-top-bar">
                    <button
                        className="prof-btn-home"
                        onClick={() => navigate("/home")}
                    >← Home</button>
                </div>

                <div className="prof-avatar prof-avatar-clickable" onClick={() => setShowAvatarPicker(!showAvatarPicker)}>
                    {user.avatar_url
                        ? <span className="prof-avatar-emoji">{user.avatar_url}</span>
                        : <span className="prof-avatar-placeholder">👤</span>
                    }
                    <div className="prof-avatar-overlay">✏️</div>
                </div>

                {showAvatarPicker && (
                    <div className="prof-avatar-picker">
                        {AVATARS.map(emoji => (
                            <button
                                key={emoji}
                                className={`prof-avatar-option ${user.avatar_url === emoji ? "selected" : ""}`}
                                onClick={() => handleSelectAvatar(emoji)}
                            >{emoji}</button>
                        ))}
                    </div>
                )}

                <h2 className="prof-name">{user.name}</h2>
                <p className="prof-email">{user.email}</p>

                <button className="prof-btn-edit" onClick={handleOpenEdit}>editar perfil</button>
                <button className="prof-btn-logout" onClick={() => setShowLogoutModal(true)}>logout</button>
                <button className="prof-btn-delete" onClick={() => setShowDeleteModal(true)}>eliminar cuenta</button>
            </div>

            {showEditModal && (
                <div className="prof-overlay" onClick={() => setShowEditModal(false)}>
                    <div className="prof-modal" onClick={e => e.stopPropagation()}>
                        <div className="prof-modal-header">
                            <span className="prof-modal-title">Editar perfil</span>
                            <button className="prof-modal-close" onClick={() => setShowEditModal(false)}>✕</button>
                        </div>
                        <div className="prof-modal-body">
                            <label className="prof-label">Nombre</label>
                            <input className="prof-input" value={editName} onChange={e => setEditName(e.target.value)} placeholder="Tu nombre..." />

                            <label className="prof-label">Email</label>
                            <input className="prof-input" type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} placeholder="Tu email..." />

                            <label className="prof-label">Nueva contraseña <span className="prof-label-optional">(opcional)</span></label>
                            <div className="prof-input-wrapper">
                                <input
                                    className="prof-input"
                                    type={showPassword ? "text" : "password"}
                                    value={editPassword}
                                    onChange={e => { setPasswordTouched(true); setEditPassword(e.target.value); }}
                                    placeholder="Mínimo 8 caracteres..."
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

                            <label className="prof-label">Confirmar contraseña</label>
                            <div className="prof-input-wrapper">
                                <input
                                    className="prof-input"
                                    type={showPasswordConfirm ? "text" : "password"}
                                    value={editPasswordConfirm}
                                    onChange={e => setEditPasswordConfirm(e.target.value)}
                                    placeholder="Repite la contraseña..."
                                />
                                <button type="button" className="prof-toggle-password" onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}>
                                    {showPasswordConfirm ? "●" : "○"}
                                </button>
                            </div>

                            {editError && <p className="prof-error">{editError}</p>}
                            {editSuccess && <p className="prof-success">✓ Guardado correctamente</p>}
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
                        <div className="prof-modal-title">¿Cerrar sesión?</div>
                        <p className="prof-confirm-text">Se cerrará tu sesión actual.</p>
                        <div className="prof-modal-actions">
                            <button className="prof-btn-cancel" onClick={() => setShowLogoutModal(false)}>Cancelar</button>
                            <button className="prof-btn-primary" onClick={handleLogout}>Sí, salir</button>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="prof-overlay" onClick={() => setShowDeleteModal(false)}>
                    <div className="prof-modal prof-modal-confirm" onClick={e => e.stopPropagation()}>
                        <div className="prof-modal-icon">🗑️</div>
                        <div className="prof-modal-title">¿Eliminar cuenta?</div>
                        <p className="prof-confirm-text">Esta acción es permanente y no se puede deshacer.</p>
                        <div className="prof-modal-actions">
                            <button className="prof-btn-cancel" onClick={() => setShowDeleteModal(false)}>Cancelar</button>
                            <button className="prof-btn-danger" onClick={handleDeleteAccount}>Sí, eliminar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};