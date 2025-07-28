import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  FileText, 
  BookOpen, 
  Link as LinkIcon, 
  Upload, 
  Plus, 
  Trash2,
  Eye,
  Download,
  Image,
  File,
  FileVideo,
  FileAudio,
  FileSpreadsheet,
  Presentation
} from 'lucide-react';
import { Node } from 'reactflow';
import { LearningCardData } from './types';
import DocumentationModal from './components/DocumentationModal';
import ConfirmationModal from '../ui/ConfirmationModal/ConfirmationModal';
import { obtenerPorId as obtenerLearningCardPorId, actualizar as actualizarLearningCard } from '../../services/learningCardService';
import { UrlLearningCard, obtenerPorLearningCard, crear as crearUrl, eliminar as eliminarUrl } from '../../services/urlLearningCardService';
import { 
  LearningCardDocument, 
  getDocumentsByLearningCard, 
  uploadDocument, 
  deleteDocument, 
  isImage 
} from '../../services/learningCardDocumentService';
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
  const [isDocumentationModalOpen, setIsDocumentationModalOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDocumentation, setShowDocumentation] = useState(false);
  const [loadingUrls, setLoadingUrls] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [urlToDelete, setUrlToDelete] = useState<UrlLearningCard | null>(null);

  // Estados para documentos
  const [documentos, setDocumentos] = useState<LearningCardDocument[]>([]);
  const [loadingDocumentos, setLoadingDocumentos] = useState(false);
  const [documentoAEliminar, setDocumentoAEliminar] = useState<LearningCardDocument | null>(null);
  const [showDeleteDocumentConfirmation, setShowDeleteDocumentConfirmation] = useState(false);

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

    const cargarDocumentos = async () => {
      if (editingIdLC) {
        setLoadingDocumentos(true);
        try {
          console.log('[LearningCardEditModal] Cargando documentos para ID:', editingIdLC);
          const documentosData = await getDocumentsByLearningCard(editingIdLC);
          console.log('[LearningCardEditModal] Documentos cargados:', documentosData);
          
          // Validación defensiva: asegurar que documentosData sea un array
          const documentosArray = Array.isArray(documentosData) ? documentosData : [];
          setDocumentos(documentosArray);
          
          // Expandir automáticamente la sección de documentación si hay documentos
          if (documentosArray.length > 0) {
            setShowDocumentation(true);
          }
        } catch (error) {
          console.error('[LearningCardEditModal] Error al cargar documentos:', error);
          setErrorMsg('Error al cargar documentos de la Learning Card');
          // En caso de error, asegurar que documentos sea un array vacío
          setDocumentos([]);
        } finally {
          setLoadingDocumentos(false);
        }
      }
    };
    
    cargarDatos();
    cargarUrls();
    cargarDocumentos();
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

  /**
   * Obtiene el icono de Lucide para un tipo de documento
   */
  const getDocumentIconComponent = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return Image;
    if (mimeType === 'application/pdf') return FileText;
    if (mimeType.includes('word')) return File;
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return FileSpreadsheet;
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return Presentation;
    if (mimeType.startsWith('video/')) return FileVideo;
    if (mimeType.startsWith('audio/')) return FileAudio;
    return File;
  };

  /**
   * Trunca nombres de documento para mejor legibilidad
   */
  const truncateDocumentName = (name: string, maxLength: number = 30) => {
    if (name.length <= maxLength) return name;
    
    const extension = name.split('.').pop();
    const nameWithoutExt = name.substring(0, name.lastIndexOf('.'));
    const maxNameLength = maxLength - extension!.length - 4; // 4 para "..." y "."
    
    return `${nameWithoutExt.substring(0, maxNameLength)}...${extension}`;
  };

  /**
   * Maneja la visualización de un documento
   */
  const handleViewDocument = (documento: LearningCardDocument) => {
    console.log('[LearningCardEditModal] Abriendo documento:', documento.document_name);
    
    if (isImage(documento.document_type) || documento.document_type === 'application/pdf') {
      // Abrir en nueva pestaña para PDFs e imágenes
      window.open(documento.document_url, '_blank');
    } else {
      // Descargar directamente para otros tipos
      handleDownloadDocument(documento);
    }
  };

  /**
   * Maneja la descarga de un documento
   */
  const handleDownloadDocument = (documento: LearningCardDocument) => {
    console.log('[LearningCardEditModal] Descargando documento:', documento.document_name);
    
    const link = document.createElement('a');
    link.href = documento.document_url;
    link.download = documento.document_name;
    link.click();
  };

  /**
   * Maneja la eliminación de un documento
   */
  const handleDeleteDocument = (documento: LearningCardDocument) => {
    setDocumentoAEliminar(documento);
    setShowDeleteDocumentConfirmation(true);
  };

  /**
   * Confirma la eliminación de un documento
   */
  const confirmDeleteDocument = async () => {
    if (documentoAEliminar) {
      try {
        console.log('[LearningCardEditModal] Eliminando documento:', documentoAEliminar.id);
        await deleteDocument(documentoAEliminar.id);
        
        // Actualizar la lista eliminando el documento
        setDocumentos(prev => prev.filter(doc => doc.id !== documentoAEliminar.id));
        
        setSuccessMsg('Documento eliminado exitosamente');
        setTimeout(() => setSuccessMsg(''), 3000);
        console.log('[LearningCardEditModal] ✅ Documento eliminado exitosamente');
      } catch (error) {
        console.error('[LearningCardEditModal] Error al eliminar documento:', error);
        setErrorMsg('Error al eliminar documento');
        setTimeout(() => setErrorMsg(''), 3000);
      }
    }
    setShowDeleteDocumentConfirmation(false);
    setDocumentoAEliminar(null);
  };

  /**
   * Renderiza la lista de documentos cargados desde la base de datos
   */
  const renderDocumentos = () => {
    if (loadingDocumentos) {
      return (
        <div className="documentos-loading" style={{ 
          fontSize: '12px', 
          color: 'var(--theme-text-secondary)',
          fontStyle: 'italic',
          padding: '8px 0'
        }}>
          Cargando documentos...
        </div>
      );
    }

    // Validación defensiva: asegurar que documentos sea un array
    if (!Array.isArray(documentos) || documentos.length === 0) {
      return (
        <div className="documentos-empty" style={{ 
          fontSize: '12px', 
          color: 'var(--theme-text-secondary)',
          fontStyle: 'italic',
          padding: '8px 0'
        }}>
          No hay documentos registrados para esta Learning Card
        </div>
      );
    }

    return (
      <div className="documentos-list">
        {documentos.map((documento) => {
          const IconComponent = getDocumentIconComponent(documento.document_type);
          
          return (
            <div key={documento.id} className="documento-item" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              background: 'var(--theme-bg-secondary)',
              border: '1px solid var(--theme-border-primary)',
              borderRadius: '6px',
              marginBottom: '6px',
              fontSize: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                <IconComponent size={16} style={{ color: 'var(--theme-text-secondary)', flexShrink: 0 }} />
                <span 
                  style={{ 
                    color: 'var(--theme-text-primary)',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    flex: 1
                  }}
                  onClick={() => handleViewDocument(documento)}
                  title={documento.document_name}
                >
                  {truncateDocumentName(documento.document_name)}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={() => handleViewDocument(documento)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    color: 'var(--theme-text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '4px'
                  }}
                  title="Ver documento"
                >
                  <Eye size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadDocument(documento)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    color: 'var(--theme-text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '4px'
                  }}
                  title="Descargar documento"
                >
                  <Download size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteDocument(documento)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    color: 'var(--theme-danger)',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '4px'
                  }}
                  title="Eliminar documento"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const addDocumentationFiles = async (files: File[]) => {
    try {
      setLoadingDocumentos(true);
      
      // Subir cada archivo individualmente
      const uploadPromises = files.map(async (file) => {
        console.log('[LearningCardEditModal] Subiendo archivo:', file.name);
        try {
          const documentoSubido = await uploadDocument(editingIdLC, file);
          console.log('[LearningCardEditModal] ✅ Archivo subido exitosamente:', documentoSubido);
          return documentoSubido;
        } catch (error) {
          console.error('[LearningCardEditModal] ❌ Error al subir archivo:', file.name, error);
          throw error;
        }
      });

      // Esperar a que todos los archivos se suban
      const documentosSubidos = await Promise.all(uploadPromises);
      
      // Actualizar la lista de documentos con los nuevos documentos
      setDocumentos(prev => [...prev, ...documentosSubidos]);
      
      setSuccessMsg(`${documentosSubidos.length} archivo(s) subido(s) exitosamente`);
      setTimeout(() => setSuccessMsg(''), 3000);
      
      console.log('[LearningCardEditModal] ✅ Todos los archivos subidos exitosamente');
      
    } catch (error) {
      console.error('[LearningCardEditModal] ❌ Error al subir archivos:', error);
      setErrorMsg('Error al subir los archivos');
      setTimeout(() => setErrorMsg(''), 3000);
    } finally {
      setLoadingDocumentos(false);
    }
  };
  
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
              {(documentationUrls.length > 0 || documentos.length > 0) && (
                <span style={{ 
                  marginLeft: '8px', 
                  fontSize: '11px', 
                  background: 'var(--theme-primary)', 
                  color: 'white', 
                  borderRadius: '12px', 
                  padding: '2px 8px',
                  fontWeight: '600'
                }}>
                  {documentationUrls.length + documentos.length} elemento{(documentationUrls.length + documentos.length) !== 1 ? 's' : ''}
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
                    {documentos.length > 0 && (
                      <span style={{ 
                        marginLeft: '8px', 
                        fontSize: '10px', 
                        background: 'var(--theme-primary)', 
                        color: 'white', 
                        borderRadius: '10px', 
                        padding: '2px 6px' 
                      }}>
                        {documentos.length}
                      </span>
                    )}
                  </h4>

                  {/* Mostrar documentos cargados desde la base de datos */}
                  {renderDocumentos()}

                  <button
                    type="button"
                    className="testing-add-btn"
                    onClick={() => setIsDocumentationModalOpen(true)}
                    disabled={loadingDocumentos}
                  >
                    <Upload size={14} />
                    {loadingDocumentos ? 'Subiendo...' : 'Cargar Archivos'}
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

        {/* @component: Modal de confirmación para eliminar documento */}
        {showDeleteDocumentConfirmation && (
          <ConfirmationModal
            isOpen={showDeleteDocumentConfirmation}
            onClose={() => setShowDeleteDocumentConfirmation(false)}
            onConfirm={confirmDeleteDocument}
            title="Eliminar Documento"
            message={`¿Estás seguro que deseas eliminar este documento?\n\n${documentoAEliminar?.document_name}\n\nEsta acción no se puede deshacer.`}
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