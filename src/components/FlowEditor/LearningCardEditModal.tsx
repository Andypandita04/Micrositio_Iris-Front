import React, { useState, useEffect } from 'react';
import { X, Save, FileText, BookOpen, Link as LinkIcon, Paperclip } from 'lucide-react';
import { Node } from 'reactflow';
import { LearningCardData } from './types';
import './styles/LearningCardEditModal.css';

interface LearningCardEditModalProps {
  node: Node<LearningCardData>;
  onSave: (data: LearningCardData) => void;
  onClose: () => void;
}

const LearningCardEditModal: React.FC<LearningCardEditModalProps> = ({ node, onSave, onClose }) => {
  const [formData, setFormData] = useState<LearningCardData>(node.data);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newLink, setNewLink] = useState('');

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.result.trim()) newErrors.result = 'El resultado es requerido';
    if (!formData.actionableInsight.trim()) newErrors.insight = 'El hallazgo accionable es requerido';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const addLink = () => {
    if (newLink.trim() && !formData.links.includes(newLink.trim())) {
      setFormData({
        ...formData,
        links: [...formData.links, newLink.trim()]
      });
      setNewLink('');
    }
  };

  const removeLink = (index: number) => {
    const updatedLinks = formData.links.filter((_, i) => i !== index);
    setFormData({ ...formData, links: updatedLinks });
  };

  return (
    <div className="learning-modal-backdrop">
      <div className="learning-modal-container">
        <div className="learning-modal-header">
          <div className="learning-modal-icon">
            <BookOpen size={20} />
          </div>
          <h2 className="learning-modal-title">Editar Learning Card</h2>
          <button onClick={onClose} className="learning-modal-close-btn">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="learning-modal-form">
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

          <div className="learning-form-group">
            <label className="learning-form-label">
              <Paperclip className="learning-form-icon" />
              Archivos Adjuntos
            </label>
            <div className="learning-file-upload">
              <button type="button" className="learning-upload-btn">
                Subir Archivo
              </button>
              <span className="learning-file-hint">Formatos soportados: PDF, PNG, JPG</span>
            </div>
            {formData.attachments.length > 0 && (
              <div className="learning-attachments-list">
                {formData.attachments.map((file, index) => (
                  <div key={index} className="learning-attachment-item">
                    <span className="learning-file-name">{file.fileName}</span>
                    <button 
                      type="button" 
                      className="learning-remove-btn"
                      onClick={() => {}}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

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
      </div>
    </div>
  );
};

export default LearningCardEditModal;