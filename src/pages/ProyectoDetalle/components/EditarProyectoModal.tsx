import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { colaboradoresDisponibles } from '../../../data/mockData';
import { Proyecto } from '../../../types/proyecto';
import Modal from '../../../components/ui/Modal/Modal';
import Button from '../../../components/ui/Button/Button';
import styles from './EditarProyectoModal.module.css';
import { actualizarProyecto } from '../../../services/proyectosService';

interface EditarProyectoModalProps {
  isOpen: boolean;
  onClose: () => void;
  proyecto: Proyecto;
  onProyectoActualizado: (proyecto: Proyecto) => void;
}

const EditarProyectoModal: React.FC<EditarProyectoModalProps> = ({
  isOpen,
  onClose,
  proyecto,
  onProyectoActualizado
}) => {
  const [formData, setFormData] = useState({
    nombre: proyecto.nombre,
    descripcion: proyecto.descripcion,
    colaboradores: proyecto.colaboradores.map(c => c.id)
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      // Mapea los campos al formato del backend
      const data = {
        titulo: formData.nombre,
        descripcion: formData.descripcion,
        // Puedes agregar estado, id_categoria, etc. si lo necesitas
      };

      // Actualiza el proyecto en el backend
      const proyectoActualizado = await actualizarProyecto(Number(proyecto.id), data);

      // Mapea la respuesta al tipo Proyecto del front
      onProyectoActualizado({
        ...proyecto,
        nombre: proyectoActualizado.titulo,
        descripcion: proyectoActualizado.descripcion,
        // Actualiza otros campos si es necesario
      });
      onClose();
    } catch (error) {
      setErrors({ general: 'Error al actualizar el proyecto' });
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
      <Button variant="outline" onClick={onClose}>
        Cancelar
      </Button>
      <Button
        variant="primary"
        icon={<Save size={16} />}
        onClick={handleSubmit}
      >
        Guardar Cambios
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Proyecto"
      footer={footer}
    >
      <form onSubmit={handleSubmit} className={styles.form}>
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
                className={`${styles['colaborador-item']} ${formData.colaboradores.includes(colaborador.id) ? styles['colaborador-selected'] : ''
                  }`}
                onClick={() => handleColaboradorToggle(colaborador.id)}
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

export default EditarProyectoModal;