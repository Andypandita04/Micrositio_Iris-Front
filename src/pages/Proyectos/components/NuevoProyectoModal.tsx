import React, { useState } from 'react';
import { Save } from 'lucide-react';

import { colaboradoresDisponibles } from '../../../data/mockData';
import { CreateProyectoData } from '../../../types/proyecto';
import Modal from '../../../components/ui/Modal/Modal';
import Button from '../../../components/ui/Button/Button';
import styles from './NuevoProyectoModal.module.css';
import { crearProyecto } from '../../../services/proyectosService';

interface NuevoProyectoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProyectoCreado: (proyectoId: string) => void;
}

const NuevoProyectoModal: React.FC<NuevoProyectoModalProps> = ({
  isOpen,
  onClose,
  onProyectoCreado
}) => {
  const [formData, setFormData] = useState<CreateProyectoData>({
    nombre: '',
    descripcion: '',
    colaboradores: []
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre del proyecto es requerido';
    }
    
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    }
    
    if (formData.colaboradores.length === 0) {
      newErrors.colaboradores = 'Debe seleccionar al menos un colaborador';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      // Mapear datos del frontend al formato que espera el backend
      const proyectoData = {
        titulo: formData.nombre,
        descripcion: formData.descripcion,
        id_categoria: 1, // Por ahora hardcodeado, después puedes agregar selector
        id_lider: 1 // Por ahora hardcodeado, después puedes agregar selector
      };

      const nuevoProyecto = await crearProyecto(proyectoData);
      
      // Reset form
      setFormData({
        nombre: '',
        descripcion: '',
        colaboradores: []
      });
      setErrors({});
      
      onProyectoCreado(nuevoProyecto.id.toString());
    } catch (error) {
      console.error('Error al crear proyecto:', error);
      setErrors({ general: 'Error al crear el proyecto. Intenta nuevamente.' });
    } finally {
      setLoading(false);
    }
  };

  const handleColaboradorToggle = (colaboradorId: string) => {
    setFormData(prev => ({
      ...prev,
      colaboradores: prev.colaboradores.includes(colaboradorId)
        ? prev.colaboradores.filter(id => id !== colaboradorId)
        : [...prev.colaboradores, colaboradorId]
    }));
  };

  const footer = (
    <>
      <Button variant="outline" onClick={onClose} disabled={loading}>
        Cancelar
      </Button>
      <Button 
        variant="primary" 
        icon={<Save size={16} />}
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? 'Creando...' : 'Crear Proyecto'}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nuevo Proyecto"
      footer={footer}
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        {errors.general && (
          <div className={styles.error}>{errors.general}</div>
        )}
        
        <div className={styles['form-group']}>
          <label htmlFor="nombre" className={styles.label}>
            Nombre del Proyecto
          </label>
          <input
            type="text"
            id="nombre"
            value={formData.nombre}
            onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
            className={`${styles.input} ${errors.nombre ? styles['input-error'] : ''}`}
            placeholder="Ingresa el nombre del proyecto"
            disabled={loading}
          />
          {errors.nombre && <span className={styles.error}>{errors.nombre}</span>}
        </div>

        <div className={styles['form-group']}>
          <label htmlFor="descripcion" className={styles.label}>
            Descripción
          </label>
          <textarea
            id="descripcion"
            value={formData.descripcion}
            onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
            className={`${styles.input} ${styles.textarea} ${errors.descripcion ? styles['input-error'] : ''}`}
            placeholder="Describe el proyecto"
            rows={3}
            disabled={loading}
          />
          {errors.descripcion && <span className={styles.error}>{errors.descripcion}</span>}
        </div>

        <div className={styles['form-group']}>
          <label className={styles.label}>
            Colaboradores
          </label>
          <div className={styles['colaboradores-grid']}>
            {colaboradoresDisponibles.map((colaborador) => (
              <div
                key={colaborador.id}
                className={`${styles['colaborador-item']} ${
                  formData.colaboradores.includes(colaborador.id) ? styles['colaborador-selected'] : ''
                }`}
                onClick={() => !loading && handleColaboradorToggle(colaborador.id)}
              >
                <img
                  src={colaborador.avatar}
                  alt={colaborador.nombre}
                  className={styles['colaborador-avatar']}
                />
                <div className={styles['colaborador-info']}>
                  <span className={styles['colaborador-nombre']}>{colaborador.nombre}</span>
                  <span className={styles['colaborador-email']}>{colaborador.email}</span>
                </div>
              </div>
            ))}
          </div>
          {errors.colaboradores && <span className={styles.error}>{errors.colaboradores}</span>}
        </div>
      </form>
    </Modal>
  );
};

export default NuevoProyectoModal;