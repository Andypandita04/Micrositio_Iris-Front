import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

import { obtenerEmpleados } from '../../../services/empleadosService';
import { obtenerTodas as obtenerCategorias } from '../../../services/categoriaService'; // Nuevo import
import Modal from '../../../components/ui/Modal/Modal';
import Button from '../../../components/ui/Button/Button';
import styles from './NuevoProyectoModal.module.css';
import { crearProyecto } from '../../../services/proyectosService';

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

interface Categoria { // Nueva interfaz
  id_categoria: number;
  nombre: string;
  created_at: string;
  updated_at: string;
}

interface CreateProyectoData {
  titulo: string;
  descripcion: string;
  id_categoria: number;
  id_lider: number;
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

const NuevoProyectoModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onProyectoCreado: (proyectoId: string) => void;
}> = ({ isOpen, onClose, onProyectoCreado }) => {
  const [formData, setFormData] = useState<CreateProyectoData>({
    titulo: '',
    descripcion: '',
    id_categoria: 1, // Cambiado a 0 para forzar selección
    id_lider: 0
  });
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]); // Nuevo estado
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [loadingEmpleados, setLoadingEmpleados] = useState(false);
  const [loadingCategorias, setLoadingCategorias] = useState(false); // Nuevo estado de carga

  useEffect(() => {
    if (isOpen) {
      cargarEmpleados();
      cargarCategorias(); // Nueva función
      setFormData({
        titulo: '',
        descripcion: '',
        id_categoria: 1, // Cambiado a 0 para forzar selección
        id_lider: 0
      });
      setErrors({});
    }
  }, [isOpen]);

  const cargarEmpleados = async () => {
    try {
      setLoadingEmpleados(true);
      setErrors(prev => ({ ...prev, empleados: '' }));
      const empleadosData = await obtenerEmpleados();
      setEmpleados(empleadosData);
    } catch (error) {
      setErrors(prev => ({ ...prev, empleados: 'Error al cargar empleados' }));
    } finally {
      setLoadingEmpleados(false);
    }
  };

  // Nueva función para cargar categorías
  const cargarCategorias = async () => {
    try {
      setLoadingCategorias(true);
      setErrors(prev => ({ ...prev, categorias: '' }));
      const categoriasData = await obtenerCategorias();
      setCategorias(categoriasData);
    } catch (error) {
      setErrors(prev => ({ ...prev, categorias: 'Error al cargar categorías' }));
    } finally {
      setLoadingCategorias(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.titulo.trim()) newErrors.titulo = 'El nombre del proyecto es requerido';
    if (!formData.descripcion.trim()) newErrors.descripcion = 'La descripción es requerida';
    if (!formData.id_lider || formData.id_lider === 0) newErrors.id_lider = 'Debes seleccionar un líder para el proyecto';
    //if (!formData.id_categoria || formData.id_categoria === 0) newErrors.id_categoria = 'Debes seleccionar una categoría'; // Nueva validación
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setLoading(true);
      const nuevoProyecto = await crearProyecto(formData);
      onClose();
      onProyectoCreado(nuevoProyecto.id_proyecto?.toString() || nuevoProyecto.id?.toString());
    } catch (error) {
      setErrors({ general: 'Error al crear el proyecto. Intenta nuevamente.' });
    } finally {
      setLoading(false);
    }
  };

  const handleLiderSelect = (empleadoId: number) => {
    setFormData(prev => ({ ...prev, id_lider: empleadoId }));
  };

  // Nueva función para manejar cambio de categoría
  const handleCategoriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id_categoria = Number(e.target.value); // Usa Number en lugar de parseInt
    setFormData(prev => ({ ...prev, id_categoria }));
  };

  const getNombreCompleto = (empleado: Empleado) =>
    `${empleado.nombre_pila} ${empleado.apellido_paterno} ${empleado.apellido_materno || ''}`.trim();

  const getIniciales = (empleado: Empleado) =>
    `${empleado.nombre_pila.charAt(0)}${empleado.apellido_paterno.charAt(0)}`.toUpperCase();

  const getAvatarColor = (index: number) => avatarColors[index % avatarColors.length];

  const handleClose = () => {
    if (!loading) onClose();
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
        disabled={loading || loadingEmpleados || loadingCategorias}
      >
        {loading ? 'Creando...' : 'Crear Proyecto'}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Nuevo Proyecto"
      footer={footer}
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        {errors.general && <div className={styles.error}>{errors.general}</div>}

        <div className={styles['form-group']}>
          <label htmlFor="titulo" className={styles.label}>
            Nombre del Proyecto *
          </label>
          <input
            type="text"
            id="titulo"
            value={formData.titulo}
            onChange={e => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
            className={`${styles.input} ${errors.titulo ? styles['input-error'] : ''}`}
            placeholder="Ingresa el nombre del proyecto"
            disabled={loading}
          />
          {errors.titulo && <span className={styles.error}>{errors.titulo}</span>}
        </div>

        <div className={styles['form-group']}>
          <label htmlFor="descripcion" className={styles.label}>
            Descripción *
          </label>
          <textarea
            id="descripcion"
            value={formData.descripcion}
            onChange={e => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
            className={`${styles.input} ${styles.textarea} ${errors.descripcion ? styles['input-error'] : ''}`}
            placeholder="Describe el proyecto"
            rows={3}
            disabled={loading}
          />
          {errors.descripcion && <span className={styles.error}>{errors.descripcion}</span>}
        </div>

        {/* Nuevo selector de categorías */}
        <div className={styles['form-group']}>
          <label htmlFor="categoria" className={styles.label}>
            Categoría *
            {formData.id_categoria > 0 && categorias.length > 0 && (
              <span className={styles['selected-info']}>
                {' '}(Seleccionada: {categorias.find(cat => cat.id_categoria === formData.id_categoria)?.nombre || 'Categoría no encontrada'})
              </span>
            )}
          </label>
          {loadingCategorias ? (
            <div className={styles['loading-empleados']}>
              <p>Cargando categorías...</p>
            </div>
          ) : errors.categorias ? (
            <div className={styles.error}>
              {errors.categorias}
              <Button
                variant="outline"
                onClick={cargarCategorias}
                disabled={loadingCategorias}
                style={{ marginLeft: '10px', fontSize: '12px', padding: '4px 8px' }}
              >
                Reintentar
              </Button>
            </div>
          ) : (
            <select
              id="categoria"
              value={formData.id_categoria}
              onChange={handleCategoriaChange}
              className={`${styles.input} ${styles.select} ${errors.id_categoria ? styles['input-error'] : ''}`}
              disabled={loading || loadingCategorias}
            >
              <option value="0">Selecciona una categoría</option>
              <option value="1" selected>Proyecto Libre</option> {/* Valor por defecto */}
              {categorias.filter(cat => cat.id_categoria !== 1).map(categoria => (
                <option key={categoria.id_categoria} value={categoria.id_categoria}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          )}
          {errors.id_categoria && <span className={styles.error}>{errors.id_categoria}</span>}
        </div>

        {/* Selector de líder con grid bonito y colores */}
        <div className={styles['form-group']}>
          <label className={styles.label}>
            Líder del Proyecto *
            {formData.id_lider > 0 && (
              <span className={styles['selected-info']}>
                {' '}(Seleccionado: {getNombreCompleto(empleados.find(emp => emp.id_empleado === formData.id_lider)!)} )
              </span>
            )}
          </label>
          {loadingEmpleados ? (
            <div className={styles['loading-empleados']}>
              <p>Cargando empleados...</p>
            </div>
          ) : errors.empleados ? (
            <div className={styles.error}>
              {errors.empleados}
              <Button
                variant="outline"
                onClick={cargarEmpleados}
                disabled={loadingEmpleados}
                style={{ marginLeft: '10px', fontSize: '12px', padding: '4px 8px' }}
              >
                Reintentar
              </Button>
            </div>
          ) : empleados.length === 0 ? (
            <div className={styles['no-empleados']}>
              <p>No hay empleados disponibles</p>
            </div>
          ) : (
            <div className={styles['colaboradores-grid']}>
              {empleados.map((empleado, idx) => (
                <div
                  key={empleado.id_empleado}
                  className={`${styles['colaborador-item']} ${formData.id_lider === empleado.id_empleado ? styles['colaborador-selected'] : ''
                    } ${!empleado.activo ? styles['colaborador-inactivo'] : ''}`}
                  onClick={() => !loading && empleado.activo && handleLiderSelect(empleado.id_empleado)}
                  title={!empleado.activo ? 'Empleado inactivo' : 'Seleccionar como líder'}
                  style={{
                    cursor: empleado.activo ? 'pointer' : 'not-allowed',
                  }}
                >
                  <div
                    className={styles['colaborador-avatar']}
                    style={{
                      background: getAvatarColor(idx),
                      color: '#fff',
                      border: formData.id_lider === empleado.id_empleado
                        ? '2.5px solid #fff'
                        : '2.5px solid #fff'
                    }}
                  >
                    {getIniciales(empleado)}
                  </div>
                  <div className={styles['colaborador-info']}>
                    <span className={styles['colaborador-nombre']}>
                      {getNombreCompleto(empleado)}
                      {!empleado.activo && <span className={styles['inactive-badge']}> (Inactivo)</span>}
                    </span>
                    <span className={styles['colaborador-email']}>{empleado.correo}</span>
                  </div>
                  {formData.id_lider === empleado.id_empleado && (
                    <div className={styles['colaborador-check']}>✓</div>
                  )}
                </div>
              ))}
            </div>
          )}
          {errors.id_lider && <span className={styles.error}>{errors.id_lider}</span>}
        </div>
      </form>
    </Modal>
  );
};

export default NuevoProyectoModal;