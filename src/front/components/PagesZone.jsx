import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getFolders, createFolder } from "./pages-y-folder/FolderServices";
import { getPages, createPage } from "./pages-y-folder/PageServices";
import "../styles/pagesZone.css";

export const PagesZone = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [folders, setFolders] = useState([]);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
    const [showLoadModal, setShowLoadModal] = useState(false);
    const [newFolderTitle, setNewFolderTitle] = useState("");
    const [selectedFolder, setSelectedFolder] = useState("");
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [editingPageId, setEditingPageId] = useState(null);
    const [loadFolderId, setLoadFolderId] = useState("");
    const [loadPages, setLoadPages] = useState([]);
    const [loadingPages, setLoadingPages] = useState(false);

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
        const stored = localStorage.getItem("pz_edit_page");
        if (stored) {
            const page = JSON.parse(stored);
            setTitle(page.title);
            setContent(page.content);
            setEditingPageId(page.id);
            localStorage.removeItem("pz_edit_page");
        }
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

    useEffect(() => {
        if (!loadFolderId) { setLoadPages([]); return; }
        const load = async () => {
            setLoadingPages(true);
            const data = await getPages(parseInt(loadFolderId));
            if (data) setLoadPages(data);
            setLoadingPages(false);
        };
        load();
    }, [loadFolderId]);

    const handleSave = async () => {
        if (!selectedFolder) return;
        if (!title.trim()) {
            setError("El título no puede estar vacío.");
            return;
        }
        const data = await createPage(parseInt(selectedFolder), title.trim(), content.trim());
        if (data) {
            setSaved(true);
            setShowSaveModal(false);
            setTitle("");
            setContent("");
            setSelectedFolder("");
            setEditingPageId(null);
            setError("");
            setTimeout(() => setSaved(false), 3000);
        }
    };

    const handleOpenSaveModal = () => {
        if (!title.trim()) {
            setError("Escribe un título antes de guardar.");
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

    const handleSelectLoadPage = (page) => {
        setTitle(page.title);
        setContent(page.content);
        setEditingPageId(page.id);
        setShowLoadModal(false);
        setLoadFolderId("");
        setLoadPages([]);
    };

    const handleCancelLoad = () => {
        setShowLoadModal(false);
        setLoadFolderId("");
        setLoadPages([]);
    };

    return (
        <div className="pz-container">
            <div className="pz-header">
                <h2 className="pz-title">
                    {editingPageId ? "Editando página" : "comienza a escribir..."}
                </h2>
                <div className="pz-header-right">
                    {saved && <span className="pz-saved-badge">✓ guardado</span>}

                    <button className="pz-save-inline-btn" onClick={handleOpenSaveModal}>
                        guardar
                    </button>

                    <div className="pz-dropdown-wrapper" ref={dropdownRef}>
                        <button
                            className="pz-dropdown-btn"
                            onClick={() => setShowDropdown(!showDropdown)}
                        >+</button>
                        {showDropdown && (
                            <div className="pz-dropdown-menu">
                                <button
                                    className="pz-dropdown-item"
                                    onClick={() => { setShowDropdown(false); setShowCreateFolderModal(true); }}
                                >
                                    Nueva carpeta
                                </button>
                                <button
                                    className="pz-dropdown-item"
                                    onClick={() => { setShowDropdown(false); setShowLoadModal(true); }}
                                >
                                    Cargar página
                                </button>
                                <button
                                    className="pz-dropdown-item"
                                    onClick={() => { setShowDropdown(false); navigate("/folders"); }}
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

            {/* MODAL CARGAR PÁGINA */}
            {showLoadModal && (
                <div className="pz-overlay" onClick={handleCancelLoad}>
                    <div className="pz-modal" onClick={e => e.stopPropagation()}>
                        <div className="pz-modal-title">Cargar página</div>
                        {folders.length === 0 ? (
                            <p className="pz-modal-empty">No tienes carpetas todavía.</p>
                        ) : (
                            <>
                                <label className="pz-modal-label">Carpeta</label>
                                <select
                                    className="pz-select"
                                    value={loadFolderId}
                                    onChange={e => setLoadFolderId(e.target.value)}
                                >
                                    <option value="">-- Selecciona una carpeta --</option>
                                    {folders.map(f => (
                                        <option key={f.id} value={f.id}>{f.title}</option>
                                    ))}
                                </select>

                                {loadFolderId && (
                                    <>
                                        <label className="pz-modal-label" style={{ marginTop: "12px" }}>Página</label>
                                        {loadingPages ? (
                                            <p className="pz-modal-empty">Cargando...</p>
                                        ) : loadPages.length === 0 ? (
                                            <p className="pz-modal-empty">Esta carpeta no tiene páginas.</p>
                                        ) : (
                                            <div className="pz-page-list">
                                                {loadPages.map(page => (
                                                    <button
                                                        key={page.id}
                                                        className="pz-page-item"
                                                        onClick={() => handleSelectLoadPage(page)}
                                                    >
                                                        <span className="pz-page-item-title">{page.title}</span>
                                                        <span className="pz-page-item-preview">{page.content?.slice(0, 50)}...</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                        <div className="pz-modal-actions" style={{ marginTop: "16px" }}>
                            <button className="pz-btn-cancel" onClick={handleCancelLoad}>Cancelar</button>
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