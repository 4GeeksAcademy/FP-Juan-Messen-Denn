import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getFolders, createFolder } from "./pages-y-folder/FolderServices";
import { createPage } from "./pages-y-folder/PageServices";
import "./PagesZone.css";

export const PagesZone = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [folders, setFolders] = useState([]);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
    const [newFolderTitle, setNewFolderTitle] = useState("");
    const [selectedFolder, setSelectedFolder] = useState("");
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            const data = await getFolders();
            if (data) setFolders(data);
        };
        load();
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSave = async () => {
        if (!selectedFolder) return;
        if (!title.trim() || !content.trim()) {
            setError("El título y el contenido no pueden estar vacíos.");
            return;
        }
        const data = await createPage(parseInt(selectedFolder), title.trim(), content.trim());
        if (data) {
            setSaved(true);
            setShowSaveModal(false);
            setTitle("");
            setContent("");
            setSelectedFolder("");
            setError("");
            setTimeout(() => setSaved(false), 3000);
        }
    };

    const handleOpenSaveModal = () => {
        if (!title.trim() || !content.trim()) {
            setError("Escribe un título y contenido antes de guardar.");
            return;
        }
        setError("");
        setShowSaveModal(true);
    };

    const handleCreateFolder = async () => {
        if (!newFolderTitle.trim()) return;
        const data = await createFolder(newFolderTitle.trim());
        if (data) {
            setFolders(prev => [...prev, data]);
            setNewFolderTitle("");
            setShowCreateFolderModal(false);
        }
    };

    return (
        <div className="pz-container">
            <div className="pz-header">
                <h2 className="pz-title">Notas</h2>
                <div className="pz-header-right">
                    {saved && <span className="pz-saved-badge">✓ Guardado</span>}

                    {/* DROPDOWN */}
                    <div className="pz-dropdown-wrapper" ref={dropdownRef}>
                        <button
                            className="pz-dropdown-btn"
                            onClick={() => setShowDropdown(!showDropdown)}
                        >+</button>
                        {showDropdown && (
                            <div className="pz-dropdown-menu">
                                <button
                                    className="pz-dropdown-item"
                                    onClick={() => {
                                        setShowDropdown(false);
                                        setShowCreateFolderModal(true);
                                    }}
                                >
                                    Nueva carpeta
                                </button>
                                <button
                                    className="pz-dropdown-item"
                                    onClick={() => {
                                        setShowDropdown(false);
                                        navigate("/folders");
                                    }}
                                >
                                    Ir a archivos
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <input
                className="pz-input-title"
                placeholder="Título..."
                value={title}
                onChange={e => setTitle(e.target.value)}
            />

            <textarea
                className="pz-textarea"
                placeholder="Escribe tus notas aquí mientras trabajas..."
                value={content}
                onChange={e => setContent(e.target.value)}
            />

            {error && <p className="pz-error">{error}</p>}

            <button className="pz-save-btn" onClick={handleOpenSaveModal}>
                Guardar en carpeta
            </button>

            {/* MODAL GUARDAR */}
            {showSaveModal && (
                <div className="pz-overlay" onClick={() => setShowSaveModal(false)}>
                    <div className="pz-modal" onClick={e => e.stopPropagation()}>
                        <div className="pz-modal-title">¿En qué carpeta guardar?</div>
                        {folders.length === 0 ? (
                            <p className="pz-modal-empty">No tienes carpetas. Crea una primero.</p>
                        ) : (
                            <select
                                className="pz-select"
                                value={selectedFolder}
                                onChange={e => setSelectedFolder(e.target.value)}
                            >
                                <option value="">-- Selecciona una carpeta --</option>
                                {folders.map(f => (
                                    <option key={f.id} value={f.id}>{f.title}</option>
                                ))}
                            </select>
                        )}
                        <div className="pz-modal-actions">
                            <button className="pz-btn-cancel" onClick={() => setShowSaveModal(false)}>Cancelar</button>
                            <button className="pz-btn-primary" disabled={!selectedFolder} onClick={handleSave}>Guardar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL CREAR CARPETA */}
            {showCreateFolderModal && (
                <div className="pz-overlay" onClick={() => setShowCreateFolderModal(false)}>
                    <div className="pz-modal" onClick={e => e.stopPropagation()}>
                        <div className="pz-modal-title">Nueva carpeta</div>
                        <input
                            className="pz-input-title"
                            placeholder="Nombre de la carpeta..."
                            value={newFolderTitle}
                            onChange={e => setNewFolderTitle(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleCreateFolder()}
                            autoFocus
                        />
                        <div className="pz-modal-actions" style={{ marginTop: "16px" }}>
                            <button className="pz-btn-cancel" onClick={() => setShowCreateFolderModal(false)}>Cancelar</button>
                            <button className="pz-btn-primary" onClick={handleCreateFolder}>Crear</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
