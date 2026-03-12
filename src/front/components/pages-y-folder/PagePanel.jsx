import { useRef, useState, useCallback } from 'react';
import { motion, useInView } from 'motion/react';
import './PagePanel.css';

const AnimatedItem = ({ children, delay = 0, index, onMouseEnter, onClick }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.5, triggerOnce: false });
  return (
    <motion.div
      ref={ref}
      data-index={index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      initial={{ scale: 0.7, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
      transition={{ duration: 0.2, delay }}
      style={{ marginBottom: '8px', cursor: 'pointer' }}
    >
      {children}
    </motion.div>
  );
};

const PagePanel = ({
  pages = [],
  activeFolder = null,
  onOpenPage,
  onMovePage,
  onDeletePage,
  onCreatePage,
  onUpdatePage,
  showCreateForm = false,
  onCancelCreate,
  onSubmitCreate,
  showGradients = true,
  displayScrollbar = true,
}) => {
  const listRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [topGradientOpacity, setTopGradientOpacity] = useState(0);
  const [bottomGradientOpacity, setBottomGradientOpacity] = useState(1);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [editingPage, setEditingPage] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const folderPages = activeFolder ? pages.filter(p => p.folder.id === activeFolder.id) : [];

  const handleScroll = useCallback(e => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    setTopGradientOpacity(Math.min(scrollTop / 50, 1));
    const bottomDistance = scrollHeight - (scrollTop + clientHeight);
    setBottomGradientOpacity(scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1));
  }, []);

  const handleSubmitCreate = () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    onSubmitCreate(newTitle.trim(), newContent.trim());
    setNewTitle('');
    setNewContent('');
  };

  const handleCancelCreate = () => {
    setNewTitle('');
    setNewContent('');
    onCancelCreate();
  };

  const handleStartEdit = (page, e) => {
    e.stopPropagation();
    setEditingPage(page);
    setEditTitle(page.title);
    setEditContent(page.content);
  };

  const handleSubmitEdit = () => {
    if (!editTitle.trim() || !editContent.trim()) return;
    onUpdatePage(editingPage.id, editTitle.trim(), editContent.trim());
    setEditingPage(null);
  };

  const handleCancelEdit = () => {
    setEditingPage(null);
    setEditTitle('');
    setEditContent('');
  };

  // Vista: formulario inline de edición
  if (editingPage) return (
    <div className="page-create-form">
      <div className="page-create-header">
        <span className="page-create-title">Editar página</span>
        <button className="page-create-close" onClick={handleCancelEdit}>✕</button>
      </div>
      <div className="page-create-body">
        <label className="page-create-label">Título</label>
        <input
          className="page-create-input"
          placeholder="Título de la página..."
          value={editTitle}
          onChange={e => setEditTitle(e.target.value)}
          autoFocus
        />
        <label className="page-create-label">Contenido</label>
        <textarea
          className="page-create-textarea"
          placeholder="Escribe tus apuntes aquí..."
          value={editContent}
          onChange={e => setEditContent(e.target.value)}
        />
      </div>
      <div className="page-create-footer">
        <button className="page-create-btn-cancel" onClick={handleCancelEdit}>Cancelar</button>
        <button className="page-create-btn-submit" onClick={handleSubmitEdit}>Guardar cambios</button>
      </div>
    </div>
  );

  // Vista: formulario inline de creación
  if (showCreateForm) return (
    <div className="page-create-form">
      <div className="page-create-header">
        <span className="page-create-title">Nueva página</span>
        <button className="page-create-close" onClick={handleCancelCreate}>✕</button>
      </div>
      <div className="page-create-body">
        <label className="page-create-label">Título</label>
        <input
          className="page-create-input"
          placeholder="Título de la página..."
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          autoFocus
        />
        <label className="page-create-label">Contenido</label>
        <textarea
          className="page-create-textarea"
          placeholder="Escribe tus apuntes aquí..."
          value={newContent}
          onChange={e => setNewContent(e.target.value)}
        />
      </div>
      <div className="page-create-footer">
        <button className="page-create-btn-cancel" onClick={handleCancelCreate}>Cancelar</button>
        <button className="page-create-btn-submit" onClick={handleSubmitCreate}>Crear página</button>
      </div>
    </div>
  );

  if (!activeFolder) return (
    <div className="page-empty">
      <div className="page-empty-icon">📁</div>
      <div className="page-empty-text">Selecciona una carpeta para ver sus páginas</div>
    </div>
  );

  if (folderPages.length === 0) return (
    <div className="page-empty">
      <div className="page-empty-icon">📝</div>
      <div className="page-empty-text">No hay páginas en esta carpeta</div>
      <button className="page-empty-btn" onClick={onCreatePage}>+ Crear nueva página o nota</button>
    </div>
  );

  return (
    <div className="page-list-container">
      <div
        ref={listRef}
        className={`page-scroll-list ${!displayScrollbar ? 'no-scrollbar' : ''}`}
        onScroll={handleScroll}
      >
        {folderPages.map((page, index) => (
          <AnimatedItem
            key={page.id}
            delay={index * 0.05}
            index={index}
            onMouseEnter={() => setSelectedIndex(index)}
            onClick={() => { setSelectedIndex(index); onOpenPage(page); }}
          >
            <div className={`page-animated-item ${selectedIndex === index ? 'selected' : ''}`}>
              <p className="item-title">{page.title}</p>
              <p className="item-preview">{page.content}</p>
              <div className="item-actions" onClick={e => e.stopPropagation()}>
                <button className="item-act-btn edit" onClick={(e) => handleStartEdit(page, e)} title="Editar página">✏️</button>
                <button className="item-act-btn move" onClick={() => onMovePage(page)} title="Cambiar de carpeta">📂</button>
                <button className="item-act-btn del" onClick={() => onDeletePage(page)} title="Eliminar página">✕</button>
              </div>
            </div>
          </AnimatedItem>
        ))}
      </div>
      {showGradients && (
        <>
          <div className="page-top-gradient" style={{ opacity: topGradientOpacity }} />
          <div className="page-bottom-gradient" style={{ opacity: bottomGradientOpacity }} />
        </>
      )}
    </div>
  );
};

export default PagePanel;
