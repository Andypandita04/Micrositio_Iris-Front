import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, FileText, Tag, ClipboardList, ChevronDown } from 'lucide-react';
import { Node } from 'reactflow';
import { TestingCardData } from './types';
import './styles/TestingCardEditModal.css';

interface TestingCardEditModalProps {
  node: Node<TestingCardData>;
  onSave: (data: TestingCardData) => void;
  onClose: () => void;
}

const TestingCardEditModal: React.FC<TestingCardEditModalProps> = ({ node, onSave, onClose }) => {
  const [formData, setFormData] = useState<TestingCardData>(node.data);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showMetrics, setShowMetrics] = useState(false);
  const [showCriteria, setShowCriteria] = useState(false);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = 'El título es requerido';
    if (!formData.hypothesis.trim()) newErrors.hypothesis = 'La hipótesis es requerida';
    if (!formData.description.trim()) newErrors.description = 'La descripción es requerida';
    if (!formData.startDate) newErrors.startDate = 'La fecha de inicio es requerida';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleMetricChange = (index: number, field: string, value: string | number) => {
    const updatedMetrics = [...formData.metrics];
    updatedMetrics[index] = { ...updatedMetrics[index], [field]: value };
    setFormData({ ...formData, metrics: updatedMetrics });
  };

  const addMetric = () => {
    setFormData({
      ...formData,
      metrics: [...formData.metrics, { metric: '', unit: '', value: 0 }]
    });
  };

  const removeMetric = (index: number) => {
    const updatedMetrics = formData.metrics.filter((_, i) => i !== index);
    setFormData({ ...formData, metrics: updatedMetrics });
  };

  return (
    <div className="testing-modal-backdrop">
      <div className="testing-modal-container">
        <div className="testing-modal-header">
          <div className="testing-modal-icon">
            <ClipboardList size={20} />
          </div>
          <h2 className="testing-modal-title">Editar Testing Card</h2>
          <button onClick={onClose} className="testing-modal-close-btn">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="testing-modal-form">
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

          <div className="testing-form-row">
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
                  + Añadir Métrica
                </button>
              </div>
            )}
          </div>

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
      </div>
    </div>
  );
};

export default TestingCardEditModal;