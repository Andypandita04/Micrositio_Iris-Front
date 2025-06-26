import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, FileText, Tag } from 'lucide-react';
import { Node } from 'reactflow';
import { NodeData } from './types';
import './styles/NodeEditModal.css';

/**
 * Props para el componente NodeEditModal
 */
interface NodeEditModalProps {
  node: Node<NodeData>;
  onSave: (data: Omit<NodeData, 'onEdit' | 'onDelete' | 'onAddChild'>) => void;
  onClose: () => void;
}

/**
 * Componente modal para editar los datos de un nodo
 * Permite modificar nombre, descripción y fecha del nodo
 */
const NodeEditModal: React.FC<NodeEditModalProps> = ({ node, onSave, onClose }) => {
  // Estados locales para los campos del formulario
  const [nombre, setNombre] = useState(node.data.nombre);
  const [descripcion, setDescripcion] = useState(node.data.descripcion);
  const [fecha, setFecha] = useState(node.data.fecha);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  /**
   * Efecto para manejar la tecla ESC y cerrar el modal
   */
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  /**
   * Valida los campos del formulario
   */
  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    } else if (descripcion.trim().length < 5) {
      newErrors.descripcion = 'La descripción debe tener al menos 5 caracteres';
    }

    if (!fecha) {
      newErrors.fecha = 'La fecha es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave({
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        fecha,
      });
    }
  };

  /**
   * Maneja el clic en el backdrop del modal
   */
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-container">
        {/* Header del modal */}
        <div className="modal-header">
          <h2 className="modal-title">Editar Nodo</h2>
          <button
            onClick={onClose}
            className="modal-close-btn"
            title="Cerrar modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="modal-form">
          {/* Campo Nombre */}
          <div className="form-group">
            <label htmlFor="node-name" className="form-label">
              <Tag className="form-icon" />
              Nombre del Nodo
            </label>
            <input
              type="text"
              id="node-name"
              className={`input ${errors.nombre ? 'input-error' : ''}`}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ingresa el nombre del nodo"
              maxLength={50}
            />
            {errors.nombre && (
              <span className="error-text">{errors.nombre}</span>
            )}
          </div>

          {/* Campo Descripción */}
          <div className="form-group">
            <label htmlFor="node-description" className="form-label">
              <FileText className="form-icon" />
              Descripción
            </label>
            <textarea
              id="node-description"
              className={`input textarea ${errors.descripcion ? 'input-error' : ''}`}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Describe la función o propósito de este nodo"
              rows={3}
              maxLength={200}
            />
            {errors.descripcion && (
              <span className="error-text">{errors.descripcion}</span>
            )}
            <div className="character-count">
              {descripcion.length}/200 caracteres
            </div>
          </div>

          {/* Campo Fecha */}
          <div className="form-group">
            <label htmlFor="node-date" className="form-label">
              <Calendar className="form-icon" />
              Fecha
            </label>
            <input
              type="date"
              id="node-date"
              className={`input ${errors.fecha ? 'input-error' : ''}`}
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
            {errors.fecha && (
              <span className="error-text">{errors.fecha}</span>
            )}
          </div>

          {/* Botones del formulario */}
          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              <Save className="btn-icon" />
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NodeEditModal;