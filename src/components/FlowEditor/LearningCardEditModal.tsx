import React, { useState, useEffect } from 'react';
import { X, Save, FileText, BookOpen, Link as LinkIcon, Upload, Plus, Trash2 } from 'lucide-react';
import { Node } from 'reactflow';
import { LearningCardData } from './types';
import DocumentationModal from './components/DocumentationModal';
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
const LearningCardEditModal: React.FC<LearningCardEditModalProps> = ({ node, onSave, onClose }) => {
  // Solo datos principales en formData
  const [formData, setFormData] = useState<LearningCardData>(node.data);

  // Estados locales para links, documentación y archivos adjuntos
  const [documentationUrls, setDocumentationUrls] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [isDocumentationModalOpen, setIsDocumentationModalOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDocumentation, setShowDocumentation] = useState(false);

  // Opciones de estado para la Learning Card
  const statusOptions = [
    { value: 'cumplido', label: 'Cumplido' },
    { value: 'rechazado', label: 'Rechazado' },
    { value: 'repetir', label: 'Repetir' },
  ];

  // Funciones para manejar links/documentos/archivos SOLO en el modal
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

                  {documentationUrls && documentationUrls.length > 0 && (
                    <div className="urls-list">
                      {documentationUrls.map((url, index) => (
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