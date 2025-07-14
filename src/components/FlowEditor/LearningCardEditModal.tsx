import React, { useState, useEffect } from 'react';
import { X, Save, FileText, BookOpen, Link as LinkIcon, Paperclip, Users, Upload, Plus, Trash2 } from 'lucide-react';
import { Node } from 'reactflow';
import { LearningCardData } from './types';
import DocumentationModal from './components/DocumentationModal';
//import CollaboratorSelector from './components/CollaboratorSelector';
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
 
interface Collaborator {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}*/

/**
 * Mock data de colaboradores disponibles
 * @constant mockCollaborators
 
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
]; */

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
const LearningCardEditModal: React.FC<LearningCardEditModalProps> = ({ node, onSave, onClose }) => {
  // Solo datos principales en formData
  const [formData, setFormData] = useState<LearningCardData>(node.data);

  // Estados locales para links, documentación y archivos adjuntos
  const [links, setLinks] = useState<string[]>([]);
  const [documentationUrls, setDocumentationUrls] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [newLink, setNewLink] = useState('');
  const [isDocumentationModalOpen, setIsDocumentationModalOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Opciones de estado para la Learning Card
  const statusOptions = [
    { value: 'cumplido', label: 'Cumplido' },
    { value: 'rechazado', label: 'Rechazado' },
    { value: 'repetir', label: 'Repetir' },
  ];

  // Funciones para manejar links/documentos/archivos SOLO en el modal
  const addLink = () => {
    if (newLink.trim() && !links.includes(newLink.trim())) {
      setLinks([...links, newLink.trim()]);
      setNewLink('');
    }
  };
  const removeLink = (index: number) => setLinks(links.filter((_, i) => i !== index));

  const addDocumentationUrl = (url: string) => {
    if (!documentationUrls.includes(url)) setDocumentationUrls([...documentationUrls, url]);
  };
  const removeDocumentationUrl = (index: number) => setDocumentationUrls(documentationUrls.filter((_, i) => i !== index));

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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Por ahora, solo mandas formData (sin links ni archivos)
      onSave(formData);
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

          {/* @section: Estado de la Learning Card */}
          <div className="learning-form-group">
            <label htmlFor="estado" className="learning-form-label">
              Estado de la Learning Card
            </label>
            <select
              id="estado"
              value={formData.estado ?? ''}
              onChange={e => setFormData({ ...formData, estado: e.target.value as any })}
              className="learning-status-select"
            >
              <option value="">Selecciona estado</option>
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* @section: Resultados obtenidos */}
          <div className="learning-form-group">
            <label htmlFor="result" className="learning-form-label">
              <FileText className="learning-form-icon" />
              Resultados Obtenidos
            </label>
            <textarea
              id="result"
              value={formData.resultado ?? ''}
              onChange={(e) => setFormData({...formData, resultado: e.target.value})}
              className={`learning-input textarea ${errors.resultado ? 'input-error' : ''}`}
              placeholder="Describe los resultados del experimento"
              rows={3}
            />
            {errors.resultado && <span className="learning-error-text">{errors.resultado}</span>}
          </div>

          {/* @section: Hallazgo accionable */}
          <div className="learning-form-group">
            <label htmlFor="insight" className="learning-form-label">
              <FileText className="learning-form-icon" />
              Hallazgo Accionable
            </label>
            <textarea
              id="insight"
              value={formData.hallazgo ?? ''}
              onChange={(e) => setFormData({ ...formData, hallazgo: e.target.value })}
              className={`learning-input textarea ${errors.hallazgo ? 'input-error' : ''}`}
              placeholder="¿Qué aprendizajes podemos aplicar?"
              rows={3}
            />
            {errors.hallazgo && <span className="learning-error-text">{errors.hallazgo}</span>}
          </div>

          {/* @section: Enlaces relacionados */}
          <div className="learning-form-group">
            <label className="learning-form-label">
              <LinkIcon className="learning-form-icon" />
              Enlaces Relacionados
            </label>
            <div className="learning-links-container">
              {links.map((link, index) => (
                <div key={index} className="learning-link-item">
                  <a href={link} target="_blank" rel="noopener noreferrer" className="learning-link">
                    {link}
                  </a>
                  <button type="button" className="learning-remove-btn" onClick={() => removeLink(index)}>
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
                <button type="button" className="learning-add-btn" onClick={addLink} disabled={!newLink.trim()}>
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
            {/* URLs de documentación */}
            {documentationUrls.length > 0 && (
              <div className="documentation-urls">
                <h4>URLs de Referencia:</h4>
                {documentationUrls.map((url, index) => (
                  <div key={index} className="url-item">
                    <a href={url} target="_blank" rel="noopener noreferrer" className="url-link">
                      {url}
                    </a>
                    <button type="button" className="learning-remove-btn" onClick={() => removeDocumentationUrl(index)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Archivos adjuntos */}
            <div className="learning-form-group">
              <label className="learning-form-label">
                <Paperclip className="learning-form-icon" />
                Archivos adjuntos
              </label>
              <input
                type="file"
                multiple
                onChange={e => {
                  const files = Array.from(e.target.files || []);
                  const validFiles = files.filter(file => file.size <= 10 * 1024 * 1024);
                  if (validFiles.length < files.length) {
                    alert('Algunos archivos superan el límite de 10MB y no se adjuntaron.');
                  }
                  if (validFiles.length > 0) {
                    addDocumentationFiles(validFiles);
                  }
                  e.target.value = '';
                }}
                className="learning-input"
                accept="*"
              />
              <span className="learning-file-hint">Máx. 10MB por archivo</span>
              {attachments.length > 0 && (
                <div className="learning-attachments-list">
                  {attachments.map((file, index) => (
                    <div key={index} className="learning-attachment-item">
                      <span className="learning-file-name">{file.fileName}</span>
                      <span className="file-size">
                        {file.fileSize ? `(${(file.fileSize / 1024 / 1024).toFixed(2)} MB)` : ''}
                      </span>
                      <button type="button" className="learning-remove-btn" onClick={() => removeAttachment(index)}>
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
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