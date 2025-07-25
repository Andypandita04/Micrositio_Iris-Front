import React, { useState, useEffect } from 'react';
import { X, Save, FileText, BookOpen, Link as LinkIcon, Upload, Plus, Trash2 } from 'lucide-react';
import { Node } from 'reactflow';
import { LearningCardData } from './types';
import DocumentationModal from './components/DocumentationModal';
import ConfirmationModal from '../ui/ConfirmationModal/ConfirmationModal';
import { obtenerPorId as obtenerLearningCardPorId, actualizar as actualizarLearningCard } from '../../services/learningCardService';
import { UrlLearningCard, obtenerPorLearningCard, crear as crearUrl, eliminar as eliminarUrl } from '../../services/urlLearningCardService';
import './styles/TestingCardEditModal.css';

/**
 * Props para el componente LearningCardEditModal
 * @interface LearningCardEditModalProps
 */
interface LearningCardEditModalProps {
  /** Nodo de Learning Card a editar */
  node: Node<LearningCardData>;
  /** Función callback para guardar los cambios */
  onSave: (data: LearningCardData) => void;
  /** Función callback para cerrar el modal */
  onClose: () => void;
  /** ID de la Learning Card a editar */
  editingIdLC: number;
}

/**
 * Modal para editar Learning Cards con sistema completo de documentación
 * 
 * @component LearningCardEditModal
 * @description Componente modal que permite editar todos los aspectos de una Learning Card,
 * incluyendo resultados, hallazgos y documentación (URLs y archivos).
 * Replica la funcionalidad completa del TestingCardEditModal adaptada para Learning Cards.
 * 
 * Características principales:
 * - Formulario completo con validación
 * - Sistema de documentación con URLs y archivos (reutiliza componentes)
 * - Drag & Drop para archivos
 * - Límite de 10MB por archivo
 * - Preview de archivos adjuntos
 * - Responsive design
 * 
 * @param {LearningCardEditModalProps} props - Props del componente
 * @returns {JSX.Element} Modal de edición de Learning Card
 */
const LearningCardEditModal: React.FC<LearningCardEditModalProps> = ({ node, onSave, onClose, editingIdLC }) => {
  // @state: Datos del formulario
  const [formData, setFormData] = useState<LearningCardData>({
    ...node.data,
    resultado: node.data.resultado || '',
    hallazgo: node.data.hallazgo || '',
    estado: node.data.estado || 'CUMPLIDO',
  });

  // @state: Loading y feedback
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Estados locales para links, documentación y archivos adjuntos
  const [documentationUrls, setDocumentationUrls] = useState<UrlLearningCard[]>([]);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [isDocumentationModalOpen, setIsDocumentationModalOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDocumentation, setShowDocumentation] = useState(false);
  const [loadingUrls, setLoadingUrls] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [urlToDelete, setUrlToDelete] = useState<UrlLearningCard | null>(null);

  // Opciones de estado para la Learning Card
  const statusOptions = [
    { value: 'CUMPLIDO', label: 'Cumplido' },
    { value: 'RECHAZADO', label: 'Rechazado' },
    { value: 'REPETIR', label: 'Repetir' },
    { value: 'VALIDADA', label: 'Validada' },
  ];

  /**
   * Efecto para cargar datos reales de la BD al abrir el modal
   * @function useEffect
   */
  useEffect(() => {
    const cargarDatos = async () => {
      if (editingIdLC) {
        setLoading(true);
        try {
          // Cargar datos de la Learning Card
          const data = await obtenerLearningCardPorId(editingIdLC);
          setFormData(prevFormData => ({ ...prevFormData, ...data }));
          
        } catch (error) {
          console.error('[LearningCardEditModal] Error al cargar datos:', error);
          setErrorMsg('Error al cargar datos de la Learning Card');
        } finally {
          setLoading(false);
        }
      }
    };
    
    const cargarUrls = async () => {
      if (editingIdLC) {
        setLoadingUrls(true);
        try {
          // Cargar URLs asociadas
          const urlsData = await obtenerPorLearningCard(editingIdLC);
          console.log('[LearningCardEditModal] URLs cargadas:', urlsData);
          setDocumentationUrls(urlsData || []);
          
          // Expandir automáticamente la sección de documentación si hay URLs
          if (urlsData && urlsData.length > 0) {
            setShowDocumentation(true);
          }
        } catch (error) {
          console.error('[LearningCardEditModal] Error al cargar URLs:', error);
          setErrorMsg('Error al cargar URLs de la Learning Card');
        } finally {
          setLoadingUrls(false);
        }
      }
    };
    
    cargarDatos();
    cargarUrls();
  }, [editingIdLC]);

  // Funciones para manejar URLs
  const addDocumentationUrl = async (url: string) => {
    try {
      console.log('[LearningCardEditModal] Agregando URL:', url, 'para LC:', editingIdLC);
      const nuevaUrl = await crearUrl({
        id_learning_card: editingIdLC,
        url: url
      });
      console.log('[LearningCardEditModal] URL creada:', nuevaUrl);
      setDocumentationUrls(prev => [...prev, nuevaUrl]);
      setSuccessMsg('URL agregada exitosamente');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      console.error('[LearningCardEditModal] Error al agregar URL:', error);
      setErrorMsg('Error al agregar la URL');
      setTimeout(() => setErrorMsg(''), 3000);
    }
  };

  const handleDeleteUrl = (urlObj: UrlLearningCard) => {
    setUrlToDelete(urlObj);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteUrl = async () => {
    if (urlToDelete) {
      try {
        console.log('[LearningCardEditModal] Eliminando URL:', urlToDelete.id_url_lc);
        await eliminarUrl(urlToDelete.id_url_lc);
        setDocumentationUrls(prev => prev.filter(url => url.id_url_lc !== urlToDelete.id_url_lc));
        setSuccessMsg('URL eliminada exitosamente');
        setTimeout(() => setSuccessMsg(''), 3000);
      } catch (error) {
        console.error('[LearningCardEditModal] Error al eliminar URL:', error);
        setErrorMsg('Error al eliminar la URL');
        setTimeout(() => setErrorMsg(''), 3000);
      }
    }
    setShowDeleteConfirmation(false);
    setUrlToDelete(null);
  };

  const removeDocumentationUrl = (index: number) => {
    const urlObj = documentationUrls[index];
    handleDeleteUrl(urlObj);
  };

  const addDocumentationFiles = (files: File[]) => {
    const newAttachments = files.map(file => ({
      fileName: file.name,
      fileUrl: URL.createObjectURL(file),
      fileSize: file.size
    }));
    setAttachments([...attachments, ...newAttachments]);
  };
  const removeAttachment = (index: number) => setAttachments(attachments.filter((_, i) => i !== index));

  // Validación y submit
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    // Añadir validaciones básicas si es necesario
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Maneja el envío del formulario
   * @function handleSubmit
   * @param {React.FormEvent} e - Evento del formulario
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      setErrorMsg('');
      setSuccessMsg('');
      
      // Limpiar payload: solo enviar campos válidos al backend
      const {
        id_learning_card,
        id_testing_card,
        resultado,
        hallazgo,
        estado,
      } = formData;
      
      const payload = {
        ...formData,
        id_learning_card: id_learning_card,
        id_testing_card: id_testing_card,
        resultado: resultado?.trim() || '',
        hallazgo: hallazgo?.trim() || '',
        estado: estado || 'CUMPLIDO',
      };
      
      // Log para depuración
      console.log('[LearningCardEditModal] Payload enviado:', payload, 'editingIdLC:', editingIdLC);
      
      try {
        await actualizarLearningCard(editingIdLC, payload);
        setSuccessMsg('¡Learning Card guardada exitosamente!');
        onSave(payload); // Notifica al padre
      } catch (err: any) {
        // Mostrar mensaje detallado del backend si existe
        let backendMsg = 'Error al guardar Learning Card en la base de datos';
        if (err?.response?.data?.detail) {
          backendMsg = err.response.data.detail;
        } else if (err?.message) {
          backendMsg = err.message;
        }
        setErrorMsg(backendMsg);
        // Log para depuración
        console.error('[LearningCardEditModal] Error al actualizar:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  /**
   * Efecto para manejar el cierre del modal con tecla ESC
   * @function useEffect
   */
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  /**
   * Efecto para loguear el editingIdLC y el estado de las URLs
   * @function useEffect
   */
  useEffect(() => {
    console.log('[LearningCardEditModal] Estado actual:', {
      editingIdLC,
      documentationUrlsCount: documentationUrls.length,
      loadingUrls,
      showDocumentation
    });
  }, [editingIdLC, documentationUrls, loadingUrls, showDocumentation]);

  return (
    <div className="testing-modal-backdrop">
      <div className="testing-modal-container">
        {/* @section: Header del modal */}
        <div className="testing-modal-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="testing-modal-icon">
              <BookOpen size={20} />
            </div>
            <h2 className="testing-modal-title">Editar Learning Card</h2>
          </div>
          <button onClick={onClose} className="testing-modal-close-btn">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="testing-modal-form">
          {loading && <div className="testing-form-loading">Cargando...</div>}
          {successMsg && <div className="testing-form-success">{successMsg}</div>}
          {errorMsg && <div className="testing-form-error">{errorMsg}</div>}

          {/* @section: Estado de la Learning Card */}
          <div className="testing-form-group">
            <label htmlFor="estado" className="testing-form-label">
              Estado de la Learning Card
            </label>
            <select
              id="estado"
              value={formData.estado ?? ''}
              onChange={e => setFormData({ ...formData, estado: e.target.value as any })}
              className="testing-status-badge"
              style={{
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                padding: '2px 10px',
                minWidth: 80,
                textAlign: 'center',
                textTransform: 'capitalize',
                letterSpacing: 0.5,
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
              }}
            >
              <option value="">Selecciona estado</option>
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* @section: Resultados obtenidos */}
          <div className="testing-form-group">
            <label htmlFor="result" className="testing-form-label">
              <FileText className="testing-form-icon" />
              Resultados Obtenidos
            </label>
            <textarea
              id="result"
              value={formData.resultado ?? ''}
              onChange={(e) => setFormData({...formData, resultado: e.target.value})}
              className={`testing-input textarea ${errors.resultado ? 'input-error' : ''}`}
              placeholder="Describe los resultados del experimento"
              rows={3}
            />
            {errors.resultado && <span className="testing-error-text">{errors.resultado}</span>}
          </div>

          {/* @section: Hallazgo accionable */}
          <div className="testing-form-group">
            <label htmlFor="insight" className="testing-form-label">
              <FileText className="testing-form-icon" />
              Hallazgo Accionable
            </label>
            <textarea
              id="insight"
              value={formData.hallazgo ?? ''}
              onChange={(e) => setFormData({ ...formData, hallazgo: e.target.value })}
              className={`testing-input textarea ${errors.hallazgo ? 'input-error' : ''}`}
              placeholder="¿Qué aprendizajes podemos aplicar?"
              rows={3}
            />
            {errors.hallazgo && <span className="testing-error-text">{errors.hallazgo}</span>}
          </div>

          {/* @section: Documentación expandible */}
          <div className="testing-form-section">
            <button
              type="button"
              className="testing-form-section-toggle"
              onClick={() => setShowDocumentation(!showDocumentation)}
            >
              <span className={`toggle-icon${showDocumentation ? ' open' : ''}`}>▼</span>
              <span>Documentación</span>
              {documentationUrls.length > 0 && (
                <span style={{ 
                  marginLeft: '8px', 
                  fontSize: '11px', 
                  background: 'var(--theme-primary)', 
                  color: 'white', 
                  borderRadius: '12px', 
                  padding: '2px 8px',
                  fontWeight: '600'
                }}>
                  {documentationUrls.length} URL{documentationUrls.length !== 1 ? 's' : ''}
                </span>
              )}
            </button>

            {showDocumentation && (
              <div className="testing-form-section-content">
                {/* @subsection: URLs de documentación */}
                <div className="documentation-subsection">
                  <h4 className="subsection-title">
                    <LinkIcon size={14} />
                    URLs de Referencia
                    {documentationUrls.length > 0 && (
                      <span style={{ 
                        marginLeft: '8px', 
                        fontSize: '10px', 
                        background: 'var(--theme-primary)', 
                        color: 'white', 
                        borderRadius: '10px', 
                        padding: '2px 6px' 
                      }}>
                        {documentationUrls.length}
                      </span>
                    )}
                  </h4>

                  {loadingUrls && (
                    <div className="loading-urls" style={{ 
                      fontSize: '12px', 
                      color: 'var(--theme-text-secondary)',
                      fontStyle: 'italic',
                      padding: '8px 0'
                    }}>
                      Cargando URLs...
                    </div>
                  )}

                  {!loadingUrls && documentationUrls.length === 0 && (
                    <div className="no-urls" style={{ 
                      fontSize: '12px', 
                      color: 'var(--theme-text-secondary)',
                      fontStyle: 'italic',
                      padding: '8px 0'
                    }}>
                      No hay URLs registradas para esta Learning Card
                    </div>
                  )}

                  {!loadingUrls && documentationUrls.length > 0 && (
                    <div className="urls-list">
                      {documentationUrls.map((urlObj, index) => (
                        <div key={urlObj.id_url_lc} className="url-item">
                          <a href={urlObj.url} target="_blank" rel="noopener noreferrer" className="url-link">
                            {urlObj.url}
                          </a>
                          <button
                            type="button"
                            className="testing-remove-btn"
                            onClick={() => removeDocumentationUrl(index)}
                            title="Eliminar URL"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    className="testing-add-btn"
                    onClick={() => setIsDocumentationModalOpen(true)}
                  >
                    <Plus size={14} />
                    Añadir URL
                  </button>
                </div>

                {/* @subsection: Archivos adjuntos */}
                <div className="documentation-subsection">
                  <h4 className="subsection-title">
                    <Upload size={14} />
                    Archivos Adjuntos
                  </h4>

                  {attachments && attachments.length > 0 && (
                    <div className="attachments-list">
                      {attachments.map((file, index) => (
                        <div key={index} className="attachment-item">
                          <span className="file-name">{file.fileName}</span>
                          <span className="file-size">
                            {file.fileSize ? `(${(file.fileSize / 1024 / 1024).toFixed(2)} MB)` : ''}
                          </span>
                          <button
                            type="button"
                            className="testing-remove-btn"
                            onClick={() => removeAttachment(index)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    className="testing-add-btn"
                    onClick={() => setIsDocumentationModalOpen(true)}
                  >
                    <Upload size={14} />
                    Cargar Archivos
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* @section: Botones de acción */}
          <div className="testing-form-actions">
            <button type="button" onClick={onClose} className="testing-btn testing-btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="testing-btn testing-btn-primary">
              <Save className="testing-btn-icon" />
              Guardar Cambios
            </button>
          </div>
        </form>

        {/* @component: Modal de documentación reutilizado */}
        {isDocumentationModalOpen && (
          <DocumentationModal
            isOpen={isDocumentationModalOpen}
            onClose={() => setIsDocumentationModalOpen(false)}
            onAddUrl={addDocumentationUrl}
            onAddFiles={addDocumentationFiles}
          />
        )}

        {/* @component: Modal de confirmación para eliminar URL */}
        {showDeleteConfirmation && (
          <ConfirmationModal
            isOpen={showDeleteConfirmation}
            onClose={() => setShowDeleteConfirmation(false)}
            onConfirm={confirmDeleteUrl}
            title="Eliminar URL"
            message={`¿Estás seguro que deseas eliminar esta URL?\n\n${urlToDelete?.url}`}
            confirmText="Eliminar"
            cancelText="Cancelar"
            type="danger"
          />
        )}
      </div>
    </div>
  );
};

export default LearningCardEditModal;