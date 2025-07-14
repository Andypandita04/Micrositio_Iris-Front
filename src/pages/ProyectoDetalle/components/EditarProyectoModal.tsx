import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { Proyecto } from '../../../types/proyecto';
import Modal from '../../../components/ui/Modal/Modal';
import Button from '../../../components/ui/Button/Button';
import styles from './EditarProyectoModal.module.css';
import { actualizarProyecto } from '../../../services/proyectosService';
import { obtenerEmpleados } from '../../../services/empleadosService';
import EmpleadoSelector from '../../Proyectos/components/EmpleadoSelector';

interface Empleado {
  id_empleado: number;
  nombre_pila: string;
  apellido_paterno: string;
  apellido_materno?: string;
  celular?: string;
  correo: string;
  numero_empleado: string;
  activo: boolean;
}

interface EditarProyectoModalProps {
  isOpen: boolean;
  onClose: () => void;
  proyecto: Proyecto;
  onProyectoActualizado: (proyecto: Proyecto) => void;
}

const avatarColors = [
  '#10b981', // verde
  '#3b82f6', // azul
  '#f59e42', // naranja
  '#f43f5e', // rosa
  '#a78bfa', // morado
  '#fbbf24', // amarillo
  '#6366f1', // azul oscuro
  '#14b8a6', // turquesa
  '#ef4444', // rojo
  '#8b5cf6', // violeta
];

const EditarProyectoModal: React.FC<EditarProyectoModalProps> = ({
  isOpen,
  onClose,
  proyecto,
  onProyectoActualizado
}) => {
  const [formData, setFormData] = useState({
    nombre: proyecto.nombre,
    descripcion: proyecto.descripcion,
    id_lider: 0, // Se inicializará cuando se carguen los empleados
    fecha_inicio: proyecto.fecha_inicio || '', // <-- nuevo
    fecha_fin_estimada: proyecto.fecha_fin_estimada || '' // <-- nuevo
  });
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [loadingEmpleados, setLoadingEmpleados] = useState(false);

  // Cargar empleados cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      cargarEmpleados();
      // Reset form data con datos del proyecto
      setFormData({
        nombre: proyecto.nombre,
        descripcion: proyecto.descripcion,
        id_lider: 0,
        fecha_inicio: proyecto.fecha_inicio || '',
        fecha_fin_estimada: proyecto.fecha_fin_estimada || ''
      });
      setErrors({});
    }
  }, [isOpen, proyecto]);

  const cargarEmpleados = async () => {
    try {
      setLoadingEmpleados(true);
      setErrors(prev => ({ ...prev, empleados: '' }));
      const empleadosData = await obtenerEmpleados();

      // Mapear empleados al formato esperado
      const empleadosMapeados: Empleado[] = empleadosData.map((empleado: any) => ({
        id_empleado: empleado.id_empleado,
        nombre_pila: empleado.nombre_pila,
        apellido_paterno: empleado.apellido_paterno,
        apellido_materno: empleado.apellido_materno,
        correo: empleado.correo,
        activo: empleado.activo
      }));

      setEmpleados(empleadosMapeados);

      // Si el proyecto tiene un líder, establecerlo
      if (proyecto.lider_id) {
        setFormData(prev => ({ ...prev, id_lider: proyecto.lider_id ?? 0 }));
      }
    } catch (error) {
      console.error('Error al cargar empleados:', error);
      setErrors(prev => ({ ...prev, empleados: 'Error al cargar empleados' }));
    } finally {
      setLoadingEmpleados(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre del proyecto es requerido';
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    }

    if (!formData.id_lider || formData.id_lider === 0) {
      newErrors.id_lider = 'Debes seleccionar un líder para el proyecto';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      // Mapea los campos al formato del backend
      const data = {
        titulo: formData.nombre,
        descripcion: formData.descripcion,
        id_lider: formData.id_lider,
        fecha_inicio: formData.fecha_inicio || null,
        fecha_fin_estimada: formData.fecha_fin_estimada || null
      };

      // Actualiza el proyecto en el backend
      const proyectoActualizado = await actualizarProyecto(Number(proyecto.id), data);

      // Mapea la respuesta al tipo Proyecto del front
      onProyectoActualizado({
        ...proyecto,
        nombre: proyectoActualizado.titulo,
        descripcion: proyectoActualizado.descripcion,
        lider_id: proyectoActualizado.id_lider // Asegúrate de que el backend devuelva este campo
      });
      onClose();
    } catch (error) {
      console.error('Error al actualizar proyecto:', error);
      setErrors({ general: 'Error al actualizar el proyecto' });
    } finally {
      setLoading(false);
    }
  };

  const handleLiderSelect = (empleadoId: number) => {
    setFormData(prev => ({ ...prev, id_lider: empleadoId }));
  };

  const getNombreCompleto = (empleado: Empleado) => {
    return `${empleado.nombre_pila} ${empleado.apellido_paterno} ${empleado.apellido_materno || ''}`.trim();
  };

  const getIniciales = (empleado: Empleado) => {
    return `${empleado.nombre_pila.charAt(0)}${empleado.apellido_paterno.charAt(0)}`.toUpperCase();
  };

  const getAvatarColor = (index: number) => avatarColors[index % avatarColors.length];

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const footer = (
    <>
      <Button variant="outline" onClick={handleClose} disabled={loading}>
        Cancelar
      </Button>
      <Button
        variant="primary"
        icon={<Save size={16} />}
        onClick={handleSubmit}
        disabled={loading || loadingEmpleados}
      >
        {loading ? 'Guardando...' : 'Guardar Cambios'}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Editar Proyecto"
      footer={footer}
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        {errors.general && <div className={styles.error}>{errors.general}</div>}

        <div className={styles['form-group']}>
          <label htmlFor="nombre" className={styles.label}>
            Nombre del Proyecto *
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
            Descripción *
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

        {/* Selector de líder con grid bonito y colores */}
        <EmpleadoSelector
          empleados={empleados}
          loading={loading}
          loadingEmpleados={loadingEmpleados}
          errors={errors}
          selectedId={formData.id_lider}
          onSelect={handleLiderSelect}
          cargarEmpleados={cargarEmpleados}
          getNombreCompleto={getNombreCompleto}
          getIniciales={getIniciales}
          getAvatarColor={getAvatarColor}
        />

        <div className={styles['form-group']}>
          <label htmlFor="fecha_inicio" className={styles.label}>
            Fecha de inicio
          </label>
          <input
            type="date"
            id="fecha_inicio"
            value={formData.fecha_inicio || ''}
            onChange={e => setFormData(prev => ({ ...prev, fecha_inicio: e.target.value }))}
            className={styles.input}
            disabled={loading}
          />
        </div>
        <div className={styles['form-group']}>
          <label htmlFor="fecha_fin_estimada" className={styles.label}>
            Fecha estimada de finalización
          </label>
          <input
            type="date"
            id="fecha_fin_estimada"
            value={formData.fecha_fin_estimada || ''}
            onChange={e => setFormData(prev => ({ ...prev, fecha_fin_estimada: e.target.value }))}
            className={styles.input}
            disabled={loading}
          />
        </div>
      </form>
    </Modal>
  );
};

export default EditarProyectoModal;