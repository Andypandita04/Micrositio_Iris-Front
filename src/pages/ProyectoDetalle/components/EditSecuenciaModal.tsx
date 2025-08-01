import React, { useState, useEffect } from 'react';
import { X, Save, FileText } from 'lucide-react';
import { Secuencia, CreateSecuenciaData } from '../../../types/secuencia';
import styles from './NuevaSecuenciaModal.module.css';
import { actualizarSecuencia } from '../../../services/secuenciaService';

interface EditSecuenciaModalProps {
  isOpen: boolean;
  onClose: () => void;
  secuencia: Secuencia | null;
  onSecuenciaEditada: (secuencia: Secuencia) => Promise<void>;
}

const EditSecuenciaModal: React.FC<EditSecuenciaModalProps> = ({
  isOpen,
  onClose,
  secuencia,
  onSecuenciaEditada
}) => {
  const [formData, setFormData] = useState<CreateSecuenciaData>({
    nombre: '',
    descripcion: '',
    id_proyecto: 0
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (secuencia) {
      setFormData({
        nombre: secuencia.nombre,
        descripcion: secuencia.descripcion,
        id_proyecto: Number(secuencia.proyectoId)
      });
    }
  }, [secuencia]);

  useEffect(() => {
    if (!isOpen) {
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre de la secuencia es requerido';
    } else if (formData.nombre.trim().length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    } else if (formData.nombre.trim().length > 50) {
      newErrors.nombre = 'El nombre no puede exceder 50 caracteres';
    }
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    } else if (formData.descripcion.trim().length < 10) {
      newErrors.descripcion = 'La descripción debe tener al menos 10 caracteres';
    } else if (formData.descripcion.trim().length > 200) {
      newErrors.descripcion = 'La descripción no puede exceder 200 caracteres';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !secuencia) return;
    setIsSubmitting(true);
    try {
      const updatedSecuencia = {
        ...secuencia,
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
      };
      await actualizarSecuencia(Number(secuencia.id), updatedSecuencia);
      await onSecuenciaEditada({ ...updatedSecuencia, id: secuencia.id, proyectoId: secuencia.proyectoId, fechaCreacion: secuencia.fechaCreacion, estado: secuencia.estado });
      onClose();
    } catch (error) {
      console.error('Error al editar la secuencia:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getCharacterCountClass = (length: number, maxLength: number) => {
    const percentage = (length / maxLength) * 100;
    if (percentage >= 100) return styles['character-count-error'];
    if (percentage >= 80) return styles['character-count-warning'];
    return styles['character-count'];
  };

  if (!isOpen || !secuencia) return null;

  return (
    <div className={styles['modal-backdrop']} onClick={handleBackdropClick}>
      <div className={styles['modal-container']}>
        <div className={styles['modal-header']}>
          <div className={styles['modal-title-container']}>
            <div className={styles['modal-icon']}>
              <FileText size={20} />
            </div>
            <h2 className={styles['modal-title']}>Editar Secuencia</h2>
          </div>
          <button
            onClick={onClose}
            className={styles['modal-close-button']}
            aria-label="Cerrar modal"
            type="button"
          >
            <X size={20} />
          </button>
        </div>
        <div className={styles['modal-body']}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles['form-group']}>
              <label htmlFor="nombre" className={styles['form-label']}>
                Nombre de la Secuencia
              </label>
              <input
                type="text"
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                className={`${styles['form-input']} ${errors.nombre ? styles['form-input-error'] : ''}`}
                maxLength={50}
                disabled={isSubmitting}
              />
              {errors.nombre && (
                <span className={styles['form-error']}>
                  {errors.nombre}
                </span>
              )}
              <div className={getCharacterCountClass(formData.nombre.length, 50)}>
                {formData.nombre.length}/50 caracteres
              </div>
            </div>
            <div className={styles['form-group']}>
              <label htmlFor="descripcion" className={styles['form-label']}>
                Descripción
              </label>
              <textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                className={`${styles['form-input']} ${styles['form-textarea']} ${errors.descripcion ? styles['form-input-error'] : ''}`}
                maxLength={200}
                rows={4}
                disabled={isSubmitting}
              />
              {errors.descripcion && (
                <span className={styles['form-error']}>
                  {errors.descripcion}
                </span>
              )}
              <div className={getCharacterCountClass(formData.descripcion.length, 200)}>
                {formData.descripcion.length}/200 caracteres
              </div>
            </div>
          </form>
        </div>
        <div className={styles['modal-footer']}>
          <button
            type="button"
            onClick={onClose}
            className={`${styles['modal-button']} ${styles['modal-button-secondary']}`}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className={`${styles['modal-button']} ${styles['modal-button-primary']}`}
            disabled={isSubmitting || !formData.nombre.trim() || !formData.descripcion.trim()}
          >
            <Save size={16} className={styles['modal-button-icon']} />
            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSecuenciaModal;
