import React, { useState, useEffect } from 'react';
import { X, Save, FileText, BookOpen, Link as LinkIcon, Paperclip, Users, Upload, Plus, Trash2 } from 'lucide-react';
import { Node } from 'reactflow';
import { LearningCardData } from './types';
import DocumentationModal from './components/DocumentationModal';
import CollaboratorSelector from './components/CollaboratorSelector';
import './styles/LearningCardEditModal.css';

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
 * Modal para editar Learning Cards con sistema completo de documentación y colaboradores
 * 
 * @component LearningCardEditModal
 * @description Componente modal que permite editar todos los aspectos de una Learning Card,
 * incluyendo resultados, hallazgos, colaboradores y documentación (URLs y archivos).
 * Replica la funcionalidad completa del TestingCardEditModal adaptada para Learning Cards.
 * 
 * Características principales:
 * - Formulario completo con validación
 * - Sistema de colaboradores con búsqueda typeahead
 * - Sistema de documentación con URLs y archivos (reutiliza componentes)
 * - Drag & Drop para archivos
 * - Límite de 10MB por archivo
 * - Preview de archivos adjuntos
 * - Responsive design
 * 
 * @param {LearningCardEditModalProps} props - Props del componente
 * @returns {JSX.Element} Modal de edición de Learning Card
 */
const LearningCardEditModal: React.FC<LearningCardEditModalProps> = ({ node, onSave, onClose }) => {
  // @state: Datos del formulario
  const [formData, setFormData] = useState<LearningCardData>(node.data);
  
  // @state: Errores de validación
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // @state: Control del modal de documentación
  const [isDocumentationModalOpen, setIsDocumentationModalOpen] = useState(false);
  
  // @state: Colaboradores seleccionados (convertir IDs a objetos)
  const [selectedCollaborators, setSelectedCollaborators] = useState<Collaborator[]>([]);
  
  // @state: Nuevo enlace para añadir
  const [newLink, setNewLink] = useState('');

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
    
    if (!formData.result.trim()) newErrors.result = 'El resultado es requerido';
    if (!formData.actionableInsight.trim()) newErrors.insight = 'El hallazgo accionable es requerido';
    
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
   * Añade un nuevo enlace a la lista
   * @function addLink
   */
  const addLink = () => {
    if (newLink.trim() && !formData.links.includes(newLink.trim())) {
      setFormData({
        ...formData,
        links: [...formData.links, newLink.trim()]
      });
      setNewLink('');
    }
  };

  /**
   * Elimina un enlace de la lista
   * @function removeLink
   * @param {number} index - Índice del enlace a eliminar
   */
  const removeLink = (index: number) => {
    const updatedLinks = formData.links.filter((_, i) => i !== index);
    setFormData({ ...formData, links: updatedLinks });
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
    <div className="learning-modal-backdrop">
      <div className="learning-modal-container">
        {/* @section: Header del modal */}
        <div className="learning-modal-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="learning-modal-icon">
              <BookOpen size={20} />
            </div>
            <h2 className="learning-modal-title">Editar Learning Card</h2>
          </div>
          <button onClick={onClose} className="learning-modal-close-btn">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="learning-modal-form">

          {/* @section: Resultados obtenidos */}
          <div className="learning-form-group">
            <label htmlFor="result" className="learning-form-label">
              <FileText className="learning-form-icon" />
              Resultados Obtenidos
            </label>
            <textarea
              id="result"
              value={formData.result}
              onChange={(e) => setFormData({...formData, result: e.target.value})}
              className={`learning-input textarea ${errors.result ? 'input-error' : ''}`}
              placeholder="Describe los resultados del experimento"
              rows={3}
            />
            {errors.result && <span className="learning-error-text">{errors.result}</span>}
          </div>

          {/* @section: Hallazgo accionable */}
          <div className="learning-form-group">
            <label htmlFor="insight" className="learning-form-label">
              <FileText className="learning-form-icon" />
              Hallazgo Accionable
            </label>
            <textarea
              id="insight"
              value={formData.actionableInsight}
              onChange={(e) => setFormData({...formData, actionableInsight: e.target.value})}
              className={`learning-input textarea ${errors.insight ? 'input-error' : ''}`}
              placeholder="¿Qué aprendizajes podemos aplicar?"
              rows={3}
            />
            {errors.insight && <span className="learning-error-text">{errors.insight}</span>}
          </div>

          {/* @section: Colaboradores 
          <div className="learning-form-group">
            <label className="learning-form-label">
              <Users className="learning-form-icon" />
              Colaboradores
            </label>
            <CollaboratorSelector
              availableCollaborators={mockCollaborators}
              selectedCollaborators={selectedCollaborators}
              onSelectionChange={handleCollaboratorsChange}
              placeholder="Buscar colaboradores..."
              maxVisibleChips={3}
            />
          </div>
          */}
          {/* @section: Enlaces relacionados */}
          <div className="learning-form-group">
            <label htmlFor="links" className="learning-form-label">
              <LinkIcon className="learning-form-icon" />
              Enlaces Relacionados
            </label>
            <div className="learning-links-container">
              {formData.links.map((link, index) => (
                <div key={index} className="learning-link-item">
                  <a href={link} target="_blank" rel="noopener noreferrer" className="learning-link">
                    {link}
                  </a>
                  <button 
                    type="button" 
                    className="learning-remove-btn"
                    onClick={() => removeLink(index)}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <div className="learning-add-link">
                <input
                  type="text"
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  className="learning-input"
                  placeholder="Añadir enlace"
                />
                <button 
                  type="button" 
                  className="learning-add-btn"
                  onClick={addLink}
                  disabled={!newLink.trim()}
                >
                  Añadir
                </button>
              </div>
            </div>
          </div>

          {/* @section: Documentación */}
          <div className="learning-form-group">
            <label className="learning-form-label">
              <Paperclip className="learning-form-icon" />
              Documentación
            </label>
            
            {/* @subsection: URLs de documentación */}
            {formData.documentationUrls && formData.documentationUrls.length > 0 && (
              <div className="documentation-urls">
                <h4>URLs de Referencia:</h4>
                {formData.documentationUrls.map((url, index) => (
                  <div key={index} className="url-item">
                    <a href={url} target="_blank" rel="noopener noreferrer" className="url-link">
                      {url}
                    </a>
                    <button 
                      type="button" 
                      className="learning-remove-btn"
                      onClick={() => removeDocumentationUrl(index)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* @subsection: Archivos adjuntos */}
            {formData.attachments.length > 0 && (
              <div className="learning-attachments-list">
                <h4>Archivos Adjuntos:</h4>
                {formData.attachments.map((file, index) => (
                  <div key={index} className="learning-attachment-item">
                    <span className="learning-file-name">{file.fileName}</span>
                    <span className="file-size">
                      {file.fileSize ? `(${(file.fileSize / 1024 / 1024).toFixed(2)} MB)` : ''}
                    </span>
                    <button 
                      type="button" 
                      className="learning-remove-btn"
                      onClick={() => {
                        const updatedAttachments = formData.attachments.filter((_, i) => i !== index);
                        setFormData({ ...formData, attachments: updatedAttachments });
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* @component: Botón para abrir modal de documentación */}
            <div className="learning-file-upload">
              <button 
                type="button" 
                className="learning-upload-btn"
                onClick={() => setIsDocumentationModalOpen(true)}
              >
                <Upload size={16} />
                Gestionar Documentación
              </button>
              <span className="learning-file-hint">Añadir URLs y archivos de referencia</span>
            </div>
          </div>

          {/* @section: Botones de acción */}
          <div className="learning-form-actions">
            <button type="button" onClick={onClose} className="learning-btn learning-btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="learning-btn learning-btn-primary">
              <Save className="learning-btn-icon" />
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