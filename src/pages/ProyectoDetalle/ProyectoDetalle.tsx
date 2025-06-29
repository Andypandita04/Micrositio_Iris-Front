import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Edit, Trash2 } from 'lucide-react';
import { proyectosMock } from '../../data/mockData';
import { secuenciasMock } from '../../data/secuenciasMock';
import { Proyecto } from '../../types/proyecto';
import { Secuencia, CreateSecuenciaData } from '../../types/secuencia';
import ActionDropdown from '../../components/ui/ActionDropdown/ActionDropdown';
import ConfirmationModal from '../../components/ui/ConfirmationModal/ConfirmationModal';
import EditarProyectoModal from './components/EditarProyectoModal';
import SecuenciasSection from './components/SecuenciasSection';
import FlowEditorSection from './components/FlowEditorSection';
import NuevaSecuenciaModal from './components/NuevaSecuenciaModal';
import styles from './ProyectoDetalle.module.css';

/**
 * Componente ProyectoDetalle
 * 
 * @component ProyectoDetalle
 * @description Página de detalle de un proyecto que muestra información completa,
 * secuencias asociadas y editor de flujo. Incluye funcionalidades de edición,
 * eliminación con confirmación y gestión de secuencias.
 * 
 * Características principales:
 * - Visualización completa de información del proyecto
 * - Dropdown de acciones (Editar/Borrar) en lugar de botón simple
 * - Gestión de secuencias con borrado seguro
 * - Editor de flujo integrado
 * - Modales de confirmación para acciones destructivas
 * - Estados de carga y manejo de errores
 * 
 * Funcionalidades de seguridad:
 * - Confirmación modal para eliminación de proyecto
 * - Confirmación modal para eliminación de secuencias
 * - Mensajes claros sobre irreversibilidad de acciones
 * - Estados de carga durante operaciones
 * 
 * @returns {JSX.Element} Página de detalle del proyecto
 */
const ProyectoDetalle: React.FC = () => {
  const { proyectoId } = useParams<{ proyectoId: string }>();
  
  // @state: Datos principales
  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [secuencias, setSecuencias] = useState<Secuencia[]>([]);
  const [secuenciaSeleccionada, setSecuenciaSeleccionada] = useState<Secuencia | null>(null);
  
  // @state: Control de modales
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNuevaSecuenciaModalOpen, setIsNuevaSecuenciaModalOpen] = useState(false);
  const [showDeleteProjectModal, setShowDeleteProjectModal] = useState(false);
  
  // @state: Estados de carga
  const [loading, setLoading] = useState(true);
  const [isDeletingProject, setIsDeletingProject] = useState(false);

  /**
   * Efecto para cargar datos del proyecto y secuencias
   * @function useEffect
   */
  useEffect(() => {
    // @simulation: Simular carga de datos desde API
    const timer = setTimeout(() => {
      if (proyectoId) {
        const id = proyectoId.replace('proyecto-', '');
        const proyectoEncontrado = proyectosMock.find(p => p.id === id);
        setProyecto(proyectoEncontrado || null);

        // @data: Cargar secuencias del proyecto
        if (proyectoEncontrado) {
          const secuenciasDelProyecto = secuenciasMock.filter(s => s.proyectoId === proyectoEncontrado.id);
          setSecuencias(secuenciasDelProyecto);
          
          // @selection: Seleccionar la primera secuencia por defecto si existe
          if (secuenciasDelProyecto.length > 0) {
            setSecuenciaSeleccionada(secuenciasDelProyecto[0]);
          }
        }
      }
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [proyectoId]);

  /**
   * Formatea una fecha para mostrar en formato localizado
   * @function formatearFecha
   * @param {string} fecha - Fecha en formato ISO string
   * @returns {string} Fecha formateada en español
   */
  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  /**
   * Maneja la actualización de datos del proyecto
   * @function handleProyectoActualizado
   * @param {Proyecto} proyectoActualizado - Proyecto con datos actualizados
   */
  const handleProyectoActualizado = (proyectoActualizado: Proyecto) => {
    setProyecto(proyectoActualizado);
    setIsEditModalOpen(false);
  };

  /**
   * Maneja la selección de una secuencia
   * @function handleSecuenciaSelect
   * @param {Secuencia} secuencia - Secuencia seleccionada
   */
  const handleSecuenciaSelect = (secuencia: Secuencia) => {
    setSecuenciaSeleccionada(secuencia);
  };

  /**
   * Abre el modal para crear nueva secuencia
   * @function handleNuevaSecuencia
   */
  const handleNuevaSecuencia = () => {
    setIsNuevaSecuenciaModalOpen(true);
  };

  /**
   * Maneja la creación de una nueva secuencia
   * @function handleSecuenciaCreada
   * @param {CreateSecuenciaData} nuevaSecuenciaData - Datos de la nueva secuencia
   */
  const handleSecuenciaCreada = (nuevaSecuenciaData: CreateSecuenciaData) => {
    // @simulation: Simular creación de secuencia con ID único
    const nuevaSecuencia: Secuencia = {
      id: Date.now().toString(),
      nombre: nuevaSecuenciaData.nombre,
      descripcion: nuevaSecuenciaData.descripcion,
      proyectoId: nuevaSecuenciaData.proyectoId,
      fechaCreacion: new Date().toISOString().split('T')[0],
      estado: 'activa'
    };

    // @update: Actualizar la lista de secuencias
    setSecuencias(prev => [...prev, nuevaSecuencia]);
    
    // @selection: Seleccionar la nueva secuencia automáticamente
    setSecuenciaSeleccionada(nuevaSecuencia);
    
    // @cleanup: Cerrar el modal
    setIsNuevaSecuenciaModalOpen(false);

    console.log('Nueva secuencia creada:', nuevaSecuencia);
  };

  /**
   * Maneja la eliminación de una secuencia
   * @function handleEliminarSecuencia
   * @param {string} secuenciaId - ID de la secuencia a eliminar
   */
  const handleEliminarSecuencia = (secuenciaId: string) => {
    // @update: Filtrar secuencias para eliminar la seleccionada
    setSecuencias(prev => prev.filter(s => s.id !== secuenciaId));
    
    // @cleanup: Limpiar selección si era la secuencia eliminada
    if (secuenciaSeleccionada?.id === secuenciaId) {
      setSecuenciaSeleccionada(null);
    }

    console.log('Secuencia eliminada:', secuenciaId);
  };

  /**
   * Inicia el proceso de eliminación del proyecto
   * @function handleDeleteProject
   */
  const handleDeleteProject = () => {
    setShowDeleteProjectModal(true);
  };

  /**
   * Confirma y ejecuta la eliminación del proyecto
   * @function handleConfirmDeleteProject
   */
  const handleConfirmDeleteProject = async () => {
    if (!proyecto) return;

    setIsDeletingProject(true);

    try {
      // @simulation: Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // @todo: Implementar eliminación real del proyecto
      console.log('Proyecto eliminado:', proyecto.id);
      
      // @navigation: Redirigir a lista de proyectos
      // navigate('/proyectos');
      
    } catch (error) {
      console.error('Error al eliminar proyecto:', error);
      // @todo: Mostrar mensaje de error al usuario
    } finally {
      setIsDeletingProject(false);
      setShowDeleteProjectModal(false);
    }
  };

  /**
   * Cancela la eliminación del proyecto
   * @function handleCancelDeleteProject
   */
  const handleCancelDeleteProject = () => {
    setShowDeleteProjectModal(false);
  };

  /**
   * Guarda los cambios del editor de flujo
   * @function handleGuardarCambios
   */
  const handleGuardarCambios = () => {
    console.log('Guardar cambios de la secuencia:', secuenciaSeleccionada?.id);
    // @todo: Implementar lógica para guardar los cambios del FlowEditor
  };

  /**
   * Configuración de acciones para el dropdown
   * @constant dropdownActions
   */
  const dropdownActions = [
    {
      id: 'edit',
      label: 'Editar',
      icon: <Edit size={16} />,
      onClick: () => setIsEditModalOpen(true),
      type: 'default' as const
    },
    {
      id: 'delete',
      label: 'Borrar',
      icon: <Trash2 size={16} />,
      onClick: handleDeleteProject,
      type: 'danger' as const
    }
  ];

  // @render: Estado de carga
  if (loading) {
    return (
      <div className={styles['proyecto-detalle-container']}>
        <div className={styles['proyecto-detalle-content']}>
          <div className={styles['loading-state']}>
            Cargando proyecto...
          </div>
        </div>
      </div>
    );
  }

  // @render: Proyecto no encontrado
  if (!proyecto) {
    return (
      <div className={styles['proyecto-detalle-container']}>
        <div className={styles['proyecto-detalle-content']}>
          <div className={styles['loading-state']}>
            Proyecto no encontrado
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles['proyecto-detalle-container']}>
      <div className={styles['proyecto-detalle-content']}>
        {/* @section: Header del proyecto */}
        <div className={styles['proyecto-header']}>
          <div className={styles['proyecto-header-top']}>
            <div className={styles['proyecto-info']}>
              <h1 className={styles['proyecto-nombre']}>{proyecto.nombre}</h1>
              <p className={styles['proyecto-descripcion']}>{proyecto.descripcion}</p>
            </div>
            
            {/* @component: Dropdown de acciones reemplazando botón Editar */}
            <ActionDropdown
              actions={dropdownActions}
              position="bottom-right"
            />
          </div>

          {/* @section: Metadata del proyecto */}
          <div className={styles['proyecto-meta']}>
            <div className={styles['meta-section']}>
              <span className={styles['meta-label']}>Colaboradores:</span>
              <div className={styles['colaboradores-list']}>
                {proyecto.colaboradores.map((colaborador) => (
                  <div key={colaborador.id} className={styles['colaborador-item']}>
                    <img
                      src={colaborador.avatar}
                      alt={colaborador.nombre}
                      className={styles['colaborador-avatar']}
                    />
                    <span className={styles['colaborador-nombre']}>{colaborador.nombre}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles['meta-section']}>
              <span className={styles['meta-label']}>Fecha de inicio:</span>
              <span className={styles['proyecto-fecha']}>
                {formatearFecha(proyecto.fechaInicio)}
              </span>
            </div>
          </div>
        </div>

        {/* @section: Secuencias del proyecto */}
        <SecuenciasSection
          secuencias={secuencias}
          secuenciaSeleccionada={secuenciaSeleccionada}
          onSecuenciaSelect={handleSecuenciaSelect}
          onNuevaSecuencia={handleNuevaSecuencia}
          onEliminarSecuencia={handleEliminarSecuencia}
        />

        {/* @section: Editor de flujo */}
        <FlowEditorSection
          secuenciaSeleccionada={secuenciaSeleccionada}
          onGuardarCambios={handleGuardarCambios}
        />

        {/* @component: Modal de edición de proyecto */}
        <EditarProyectoModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          proyecto={proyecto}
          onProyectoActualizado={handleProyectoActualizado}
        />

        {/* @component: Modal de nueva secuencia */}
        <NuevaSecuenciaModal
          isOpen={isNuevaSecuenciaModalOpen}
          onClose={() => setIsNuevaSecuenciaModalOpen(false)}
          proyectoId={proyecto.id}
          onSecuenciaCreada={handleSecuenciaCreada}
        />

        {/* @component: Modal de confirmación de eliminación de proyecto */}
        <ConfirmationModal
          isOpen={showDeleteProjectModal}
          onClose={handleCancelDeleteProject}
          onConfirm={handleConfirmDeleteProject}
          title="Borrar Proyecto"
          message={`¿Estás seguro de que quieres borrar el proyecto "${proyecto.nombre}"? Esta acción eliminará todas las secuencias y datos asociados y no puede deshacerse.`}
          confirmText="Confirmar"
          cancelText="Cancelar"
          type="danger"
          isLoading={isDeletingProject}
        />
      </div>
    </div>
  );
};

export default ProyectoDetalle;