import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Calendar, 
  FileText, 
  Tag, 
  ClipboardList, 
  ChevronDown,
  Link as LinkIcon,
  Upload,
  Plus,
  Trash2,
  Users
} from 'lucide-react';
import { Node } from 'reactflow';
import { TestingCardData } from './types';
import DocumentationModal from './components/DocumentationModal';
import CollaboratorSelector from './components/CollaboratorSelector';
import './styles/TestingCardEditModal.css';

/**
 * Props para el componente TestingCardEditModal
 * @interface TestingCardEditModalProps
 */
interface TestingCardEditModalProps {
  /** Nodo de Testing Card a editar */
  node: Node<TestingCardData>;
  /** Función callback para guardar los cambios */
  onSave: (data: TestingCardData) => void;
  /** Función callback para cerrar el modal */
  onClose: () => void;
}

/**
 * Interfaz para colaboradores (mock data)
 * @interface Collaborator
 */
interface Collaborator {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

/**
 * Mock data de colaboradores disponibles
 * @constant mockCollaborators
 */
const mockCollaborators: Collaborator[] = [
  {
    id: '1',
    name: 'Ana García',
    email: 'ana.garcia@empresa.com',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    role: 'Product Manager'
  },
  {
    id: '2',
    name: 'Carlos Rodríguez',
    email: 'carlos.rodriguez@empresa.com',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    role: 'UX Designer'
  },
  {
    id: '3',
    name: 'María López',
    email: 'maria.lopez@empresa.com',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    role: 'Developer'
  },
  {
    id: '4',
    name: 'David Martínez',
    email: 'david.martinez@empresa.com',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    role: 'Data Analyst'
  },
  {
    id: '5',
    name: 'Laura Sánchez',
    email: 'laura.sanchez@empresa.com',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    role: 'QA Engineer'
  }
];

/**
 * Modal para editar Testing Cards con sistema de documentación completo
 * 
 * @component TestingCardEditModal
 * @description Componente modal que permite editar todos los aspectos de una Testing Card,
 * incluyendo información básica, métricas, criterios, colaboradores y documentación (URLs y archivos).
 * 
 * Características principales:
 * - Formulario completo con validación
 * - Sistema de colaboradores con búsqueda typeahead
 * - Sistema de documentación con URLs y archivos
 * - Secciones colapsables para mejor organización
 * - Drag & Drop para archivos
 * - Límite de 10MB por archivo
 * - Preview de archivos adjuntos
 * - Responsive design
 * 
 * @param {TestingCardEditModalProps} props - Props del componente
 * @returns {JSX.Element} Modal de edición de Testing Card
 */
const TestingCardEditModal: React.FC<TestingCardEditModalProps> = ({ node, onSave, onClose }) => {
  // @state: Datos del formulario
  const [formData, setFormData] = useState<TestingCardData>(node.data);
  
  // @state: Errores de validación
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // @state: Control de secciones expandibles
  const [showMetrics, setShowMetrics] = useState(false);
  const [showCriteria, setShowCriteria] = useState(false);
  const [showCollaborators, setShowCollaborators] = useState(false);
  const [showDocumentation, setShowDocumentation] = useState(false);
  
  // @state: Control del modal de documentación
  const [isDocumentationModalOpen, setIsDocumentationModalOpen] = useState(false);
  
  // @state: Colaboradores seleccionados (convertir IDs a objetos)
  const [selectedCollaborators, setSelectedCollaborators] = useState<Collaborator[]>([]);

  /**
   * Efecto para inicializar colaboradores seleccionados
   * @function useEffect
   */
  useEffect(() => {
    // @logic: Convertir IDs de colaboradores a objetos completos
    if (formData.collaborators) {
      const collaboratorObjects = mockCollaborators.filter(
        collaborator => formData.collaborators?.includes(collaborator.id)
      );
      setSelectedCollaborators(collaboratorObjects);
    }
  }, [formData.collaborators]);

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
   * Valida todos los campos del formulario
   * @function validateForm
   * @returns {boolean} true si el formulario es válido
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = 'El título es requerido';
    if (!formData.hypothesis.trim()) newErrors.hypothesis = 'La hipótesis es requerida';
    if (!formData.description.trim()) newErrors.description = 'La descripción es requerida';
    if (!formData.startDate) newErrors.startDate = 'La fecha de inicio es requerida';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Maneja el envío del formulario
   * @function handleSubmit
   * @param {React.FormEvent} e - Evento del formulario
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  /**
   * Actualiza una métrica específica
   * @function handleMetricChange
   * @param {number} index - Índice de la métrica
   * @param {string} field - Campo a actualizar
   * @param {string | number} value - Nuevo valor
   */
  const handleMetricChange = (index: number, field: string, value: string | number) => {
    const updatedMetrics = [...formData.metrics];
    updatedMetrics[index] = { ...updatedMetrics[index], [field]: value };
    setFormData({ ...formData, metrics: updatedMetrics });
  };

  /**
   * Añade una nueva métrica vacía
   * @function addMetric
   */
  const addMetric = () => {
    setFormData({
      ...formData,
      metrics: [...formData.metrics, { metric: '', unit: '', value: 0 }]
    });
  };

  /**
   * Elimina una métrica por índice
   * @function removeMetric
   * @param {number} index - Índice de la métrica a eliminar
   */
  const removeMetric = (index: number) => {
    const updatedMetrics = formData.metrics.filter((_, i) => i !== index);
    setFormData({ ...formData, metrics: updatedMetrics });
  };

  /**
   * Maneja el cambio de colaboradores seleccionados
   * @function handleCollaboratorsChange
   * @param {Collaborator[]} collaborators - Nuevos colaboradores seleccionados
   */
  const handleCollaboratorsChange = (collaborators: Collaborator[]) => {
    setSelectedCollaborators(collaborators);
    setFormData({
      ...formData,
      collaborators: collaborators.map(c => c.id)
    });
  };

  /**
   * Añade una nueva URL de documentación
   * @function addDocumentationUrl
   * @param {string} url - URL a añadir
   */
  const addDocumentationUrl = (url: string) => {
    if (!formData.documentationUrls) {
      setFormData({ ...formData, documentationUrls: [url] });
    } else {
      setFormData({ 
        ...formData, 
        documentationUrls: [...formData.documentationUrls, url] 
      });
    }
  };

  /**
   * Elimina una URL de documentación
   * @function removeDocumentationUrl
   * @param {number} index - Índice de la URL a eliminar
   */
  const removeDocumentationUrl = (index: number) => {
    if (formData.documentationUrls) {
      const updatedUrls = formData.documentationUrls.filter((_, i) => i !== index);
      setFormData({ ...formData, documentationUrls: updatedUrls });
    }
  };

  /**
   * Añade archivos de documentación
   * @function addDocumentationFiles
   * @param {File[]} files - Archivos a añadir
   */
  const addDocumentationFiles = (files: File[]) => {
    const newAttachments = files.map(file => ({
      fileName: file.name,
      fileUrl: URL.createObjectURL(file),
      fileSize: file.size
    }));

    setFormData({
      ...formData,
      attachments: [...formData.attachments, ...newAttachments]
    });
  };

  return (
    <div className="testing-modal-backdrop">
      <div className="testing-modal-container">
        {/* @section: Header del modal */}
        <div className="testing-modal-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="testing-modal-icon">
              <ClipboardList size={20} />
            </div>
            <h2 className="testing-modal-title">Editar Testing Card</h2>
          </div>
          <button onClick={onClose} className="testing-modal-close-btn">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="testing-modal-form">
          {/* @section: Estado de la Testing Card */}
          <div className="testing-form-group">
            <label htmlFor="status" className="testing-form-label">
              Estado de la Testing Card
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={e => {
                const value = e.target.value as 'En validación' | 'En proceso' | 'Terminado' | 'Escoger estado';
                setFormData(prev => ({ ...prev, status: value as any }));
              }}
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
              <option value="En validación">En validación</option>
              <option value="En proceso">En proceso</option>
              <option value="Terminado">Terminado</option>
            </select>
          </div>
          {/* @section: Información básica */}
          <div className="testing-form-group">
            <label htmlFor="title" className="testing-form-label">
              <Tag className="testing-form-icon" />
              Título del Experimento
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className={`testing-input ${errors.title ? 'input-error' : ''}`}
              placeholder="¿Qué quieres probar?"
            />
            {errors.title && <span className="testing-error-text">{errors.title}</span>}
          </div>

          <div className="testing-form-group">
            <label htmlFor="hypothesis" className="testing-form-label">
              <FileText className="testing-form-icon" />
              Hipótesis
            </label>
            <textarea
              id="hypothesis"
              value={formData.hypothesis}
              onChange={(e) => setFormData({...formData, hypothesis: e.target.value})}
              className={`testing-input textarea ${errors.hypothesis ? 'input-error' : ''}`}
              placeholder="Creemos que..."
              rows={2}
            />
            {errors.hypothesis && <span className="testing-error-text">{errors.hypothesis}</span>}
          </div>

          {/* @section: Configuración del experimento */}
          <div className="testing-form-row">
            

            <div className="testing-form-group">
              <label htmlFor="experimentCategory" className="testing-form-label">
                Categoría
              </label>
              <select
                id="experimentCategory"
                value={formData.experimentCategory}
                onChange={(e) => setFormData({...formData, experimentCategory: e.target.value as any})}
                className="testing-input"
              >
                <option value="Descubrimiento">Descubrimiento</option>
                <option value="Validación">Validación</option>
              </select>
            </div>

            <div className="testing-form-group">
              <label htmlFor="experimentType" className="testing-form-label">
                Tipo de Experimento
              </label>
              <select
                id="experimentType"
                value={formData.experimentType}
                onChange={(e) => setFormData({...formData, experimentType: e.target.value as any})}
                className="testing-input"
              >
                <option value="Entrevista">Entrevista</option>
                <option value="Prototipo">Prototipo</option>
                <option value="Encuesta">Encuesta</option>
                <option value="A/B Test">A/B Test</option>
              </select>
            </div>
          </div>

          <div className="testing-form-group">
            <label htmlFor="description" className="testing-form-label">
              <FileText className="testing-form-icon" />
              Descripción
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className={`testing-input textarea ${errors.description ? 'input-error' : ''}`}
              placeholder="Describe cómo realizarás el experimento"
              rows={3}
            />
            {errors.description && <span className="testing-error-text">{errors.description}</span>}
          </div>

          {/* @section: Colaboradores expandible 
          <div className="testing-form-section">
            <button 
              type="button" 
              className="testing-form-section-toggle"
              onClick={() => setShowCollaborators(!showCollaborators)}
            >
              <ChevronDown className={`toggle-icon ${showCollaborators ? 'open' : ''}`} />
              <Users className="testing-form-icon" />
              <span>Colaboradores</span>
            </button>
            
            {showCollaborators && (
              <div className="testing-form-section-content">
                <CollaboratorSelector
                  availableCollaborators={mockCollaborators}
                  selectedCollaborators={selectedCollaborators}
                  onSelectionChange={handleCollaboratorsChange}
                  placeholder="Buscar colaboradores..."
                  maxVisibleChips={3}
                />
              </div>
            )}
          </div>
          */}

          {/* @section: Documentación expandible */}
          <div className="testing-form-section">
            <button 
              type="button" 
              className="testing-form-section-toggle"
              onClick={() => setShowDocumentation(!showDocumentation)}
            >
              <ChevronDown className={`toggle-icon ${showDocumentation ? 'open' : ''}`} />
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
                  
                  {formData.documentationUrls && formData.documentationUrls.length > 0 && (
                    <div className="urls-list">
                      {formData.documentationUrls.map((url, index) => (
                        <div key={index} className="url-item">
                          <a href={url} target="_blank" rel="noopener noreferrer" className="url-link">
                            {url}
                          </a>
                          <button 
                            type="button" 
                            className="testing-remove-btn"
                            onClick={() => removeDocumentationUrl(index)}
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
                  
                  {formData.attachments && formData.attachments.length > 0 && (
                    <div className="attachments-list">
                      {formData.attachments.map((file, index) => (
                        <div key={index} className="attachment-item">
                          <span className="file-name">{file.fileName}</span>
                          <span className="file-size">
                            {file.fileSize ? `(${(file.fileSize / 1024 / 1024).toFixed(2)} MB)` : ''}
                          </span>
                          <button 
                            type="button" 
                            className="testing-remove-btn"
                            onClick={() => {
                              const updatedAttachments = formData.attachments.filter((_, i) => i !== index);
                              setFormData({ ...formData, attachments: updatedAttachments });
                            }}
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

          {/* @section: Métricas expandibles */}
          <div className="testing-form-section">
            <button 
              type="button" 
              className="testing-form-section-toggle"
              onClick={() => setShowMetrics(!showMetrics)}
            >
              <ChevronDown className={`toggle-icon ${showMetrics ? 'open' : ''}`} />
              <span>Métricas a Medir</span>
            </button>
            
            {showMetrics && (
              <div className="testing-form-section-content">
                {formData.metrics.map((metric, index) => (
                  <div key={index} className="testing-metric-row">
                    <input
                      type="text"
                      value={metric.metric}
                      onChange={(e) => handleMetricChange(index, 'metric', e.target.value)}
                      className="testing-input small"
                      placeholder="Nombre métrica"
                    />
                    <input
                      type="text"
                      value={metric.unit}
                      onChange={(e) => handleMetricChange(index, 'unit', e.target.value)}
                      className="testing-input small"
                      placeholder="Unidad"
                    />
                    <input
                      type="number"
                      value={metric.value}
                      onChange={(e) => handleMetricChange(index, 'value', parseFloat(e.target.value))}
                      className="testing-input small"
                      placeholder="Valor"
                    />
                    <button 
                      type="button" 
                      className="testing-remove-btn"
                      onClick={() => removeMetric(index)}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <button 
                  type="button" 
                  className="testing-add-btn"
                  onClick={addMetric}
                >
                  <Plus size={14} />
                  Añadir Métrica
                </button>
              </div>
            )}
          </div>

          {/* @section: Fechas y responsable */}
          <div className="testing-form-row">
            <div className="testing-form-group">
              <label htmlFor="startDate" className="testing-form-label">
                <Calendar className="testing-form-icon" />
                Fecha Inicio
              </label>
              <input
                type="date"
                id="startDate"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                className={`testing-input ${errors.startDate ? 'input-error' : ''}`}
              />
              {errors.startDate && <span className="testing-error-text">{errors.startDate}</span>}
            </div>

            <div className="testing-form-group">
              <label htmlFor="endDate" className="testing-form-label">
                <Calendar className="testing-form-icon" />
                Fecha Fin
              </label>
              <input
                type="date"
                id="endDate"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                className="testing-input"
                min={formData.startDate}
              />
            </div>
          </div>

          <div className="testing-form-group">
            <label htmlFor="responsible" className="testing-form-label">
              Responsable
            </label>
            <input
              type="text"
              id="responsible"
              value={formData.responsible}
              onChange={(e) => setFormData({...formData, responsible: e.target.value})}
              className="testing-input"
              placeholder="Nombre del responsable"
            />
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

        {/* @component: Modal de documentación */}
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

export default TestingCardEditModal;