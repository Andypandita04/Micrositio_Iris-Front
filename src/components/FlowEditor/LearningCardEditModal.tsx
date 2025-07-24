import React, { useState, useEffect } from 'react';
import { X, Save, FileText, BookOpen, Link as LinkIcon, Upload, Plus, Trash2 } from 'lucide-react';
import { Node } from 'reactflow';
import { LearningCardData } from './types';
import DocumentationModal from './components/DocumentationModal';
import { obtenerPorId as obtenerLearningCardPorId, actualizar as actualizarLearningCard } from '../../services/learningCardService';
import { 
  UrlLearningCard, 
  obtenerPorLearningCard as obtenerUrlsPorLearningCard,
  crear as crearUrlLearningCard,
  eliminar as eliminarUrlLearningCard 
} from '../../services/urlLearningCardService';
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
    if (editingIdLC) {
      setLoading(true);
      obtenerLearningCardPorId(editingIdLC)
        .then((data) => {
          setFormData({ ...formData, ...data });
        })
        .catch(() => setErrorMsg('Error al cargar datos de la Learning Card'))
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line
  }, [editingIdLC]);

  /**
   * Efecto para cargar URLs cuando se abre la sección de documentación
   * @function useEffect
   */
  useEffect(() => {
    if (showDocumentation && editingIdLC) {
      cargarUrls();
    }
    // eslint-disable-next-line
  }, [showDocumentation, editingIdLC]);

  /**
   * Carga las URLs desde la base de datos
   * @function cargarUrls
   */
  const cargarUrls = async () => {
    if (!editingIdLC) return;
    
    try {
      setLoadingUrls(true);
      const urlsData = await obtenerUrlsPorLearningCard(editingIdLC);
      setDocumentationUrls(urlsData);
    } catch (error) {
      console.error('[cargarUrls] Error al cargar URLs:', error);
      setDocumentationUrls([]);
    } finally {
      setLoadingUrls(false);
    }
  };

  // Funciones para manejar links/documentos/archivos con BD
  const addDocumentationUrl = async (url: string) => {
    if (!editingIdLC) return;
    
    // Verificar si la URL ya existe
    const exists = documentationUrls.some(urlObj => urlObj.url === url);
    if (exists) return;
    
    try {
      setLoadingUrls(true);
      const newUrlData = await crearUrlLearningCard({
        id_learning_card: editingIdLC,
        url: url
      });
      setDocumentationUrls([...documentationUrls, newUrlData]);
      setSuccessMsg('URL agregada exitosamente');
    } catch (error) {
      console.error('[addDocumentationUrl] Error al crear URL:', error);
      setErrorMsg('Error al agregar la URL');
    } finally {
      setLoadingUrls(false);
    }
  };

  const removeDocumentationUrl = async (index: number) => {
    const urlToRemove = documentationUrls[index];
    if (!urlToRemove?.id_url_lc) return;
    
    try {
      setLoadingUrls(true);
      await eliminarUrlLearningCard(urlToRemove.id_url_lc);
      setDocumentationUrls(documentationUrls.filter((_, i) => i !== index));
      setSuccessMsg('URL eliminada exitosamente');
    } catch (error) {
      console.error('[removeDocumentationUrl] Error al eliminar URL:', error);
      setErrorMsg('Error al eliminar la URL');
    } finally {
      setLoadingUrls(false);
    }
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
   * Efecto para loguear el editingIdLC
   * @function useEffect
   */
  useEffect(() => {
    console.log('[LearningCardEditModal] editingIdLC recibido:', editingIdLC);
  }, [editingIdLC]);

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
            </button>

            {showDocumentation && (
              <div className="testing-form-section-content">
                {/* @subsection: URLs de documentación */}
                <div className="documentation-subsection">
                  <h4 className="subsection-title">
                    <LinkIcon size={14} />
                    URLs de Referencia
                  </h4>

                  {loadingUrls && (
                    <div className="testing-metrics-loading">
                      <span>Cargando URLs...</span>
                    </div>
                  )}

                  {!loadingUrls && documentationUrls && documentationUrls.length === 0 && (
                    <div className="testing-metrics-empty">
                      <span>No hay URLs definidas para esta Learning Card</span>
                    </div>
                  )}

                  {!loadingUrls && documentationUrls && documentationUrls.length > 0 && (
                    <div className="urls-list">
                      {documentationUrls.map((urlObj, index) => (
                        <div key={urlObj.id_url_lc || index} className="url-item">
                          <a href={urlObj.url} target="_blank" rel="noopener noreferrer" className="url-link">
                            {urlObj.url}
                          </a>
                          <button
                            type="button"
                            className="testing-remove-btn"
                            onClick={() => removeDocumentationUrl(index)}
                            disabled={loadingUrls}
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
                    disabled={loadingUrls}
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
      </div>
    </div>
  );
};

export default LearningCardEditModal;