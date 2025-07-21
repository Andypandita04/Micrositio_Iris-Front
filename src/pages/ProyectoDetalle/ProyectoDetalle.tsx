import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Edit, Trash2 } from 'lucide-react';
import { Proyecto } from '../../types/proyecto';
import { Secuencia, CreateSecuenciaData } from '../../types/secuencia';
import ActionDropdown from '../../components/ui/ActionDropdown/ActionDropdown';
import ConfirmationModal from '../../components/ui/ConfirmationModal/ConfirmationModal';
import EditarProyectoModal from './components/EditarProyectoModal';
import SecuenciasSection from './components/SecuenciasSection';
import FlowEditorSection from './components/FlowEditorSection';
import NuevaSecuenciaModal from './components/NuevaSecuenciaModal';
import ColaboradoresProyecto from './ColaboradoresProyecto';
import LiderProyecto from '../Proyectos/components/LiderProyecto';
import styles from './ProyectoDetalle.module.css';
import { eliminarSecuencia, obtenerSecuenciasPorProyecto, crearSecuencia } from '../../services/secuenciaService';
import { obtenerProyectoPorId } from '../../services/proyectosService';
import { eliminarProyecto } from '../../services/proyectosService';


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
    const fetchData = async () => {
      setLoading(true);
      try {
        if (proyectoId) {
          const id = Number(proyectoId);

          // 1. Obtener proyecto
          const proyectoData = await obtenerProyectoPorId(id);
          const proyectoMapeado: Proyecto = {
            ...proyectoData,
            // Asegura que los campos requeridos por el tipo estén presentes
            id: proyectoData.id,
            nombre: proyectoData.titulo,
            descripcion: proyectoData.descripcion,
            estado: proyectoData.estado.toLowerCase(),
            fecha_inicio: proyectoData.fecha_inicio || proyectoData.creado,
            fecha_fin_estimada: proyectoData.fecha_fin_estimada || '',
            creado: proyectoData.creado,
            colaboradores: [],
          };
          setProyecto(proyectoMapeado);

          // 2. Obtener secuencias (ACTUALIZADO)
          const secuenciasData = await obtenerSecuenciasPorProyecto(id);

          // Asegúrate de que sea un array
          const secuenciasArray = Array.isArray(secuenciasData) ? secuenciasData : [];

          const secuenciasMapeadas = secuenciasArray
            .filter(s => s && s.id !== undefined) // filtra elementos undefined o sin id
            .map((s: any) => ({
              id: s.id?.toString() ?? '',
              nombre: s.nombre ?? '',
              descripcion: s.descripcion ?? '',
              proyectoId: s.id_proyecto?.toString() ?? '',
              fechaCreacion: s.created_at ?? '',
              estado: s.estado || 'activa',
            }));
          setSecuencias(secuenciasMapeadas);

          if (secuenciasMapeadas.length > 0) {
            setSecuenciaSeleccionada(secuenciasMapeadas[0]);
          }
        }
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setProyecto(null);
        setSecuencias([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
  const handleSecuenciaCreada = async (nuevaSecuenciaData: CreateSecuenciaData) => {
    try {
      // Llamar al endpoint real para crear la secuencia
      await crearSecuencia({
        nombre: nuevaSecuenciaData.nombre,
        descripcion: nuevaSecuenciaData.descripcion,
        id_proyecto: nuevaSecuenciaData.id_proyecto,
        // Puedes agregar más campos si tu backend los requiere
      });

      // Refrescar la lista de secuencias desde el backend
      if (proyectoId) {
        const secuenciasData = await obtenerSecuenciasPorProyecto(Number(proyectoId));
        const secuenciasArray = Array.isArray(secuenciasData) ? secuenciasData : [];
        const secuenciasMapeadas = secuenciasArray
          .filter(s => s && s.id !== undefined)
          .map((s: any) => ({
            id: s.id?.toString() ?? '',
            nombre: s.nombre ?? '',
            descripcion: s.descripcion ?? '',
            proyectoId: s.id_proyecto?.toString() ?? '',
            fechaCreacion: s.created_at ?? '',
            estado: s.estado || 'activa',
          }));
        setSecuencias(secuenciasMapeadas);
        // Seleccionar la última secuencia creada
        if (secuenciasMapeadas.length > 0) {
          setSecuenciaSeleccionada(secuenciasMapeadas[secuenciasMapeadas.length - 1]);
        }
      }
      setIsNuevaSecuenciaModalOpen(false);
    } catch (error: any) {
      console.error('Error al crear secuencia:', error);
      if (error.response) {
        console.error('Backend response:', error.response.data);
        // Mostrar el mensaje de error del backend si existe
        if (error.response.data && error.response.data.message) {
          alert('Error del backend: ' + error.response.data.message);
        } else if (typeof error.response.data === 'string') {
          alert('Error del backend: ' + error.response.data);
        } else {
          alert('Error desconocido del backend. Revisa la consola para más detalles.');
        }
      } else {
        alert('Error desconocido al crear la secuencia. Revisa la consola para más detalles.');
      }
    }
  };

  /**
   * Maneja la eliminación de una secuencia
   * @function handleEliminarSecuencia
   * @param {string} secuenciaId - ID de la secuencia a eliminar
   */
  const handleEliminarSecuencia = async (secuenciaId: string) => {
    try {
      await eliminarSecuencia(Number(secuenciaId));

      // Refrescar la lista de secuencias desde el backend
      if (proyectoId) {
        const secuenciasData = await obtenerSecuenciasPorProyecto(Number(proyectoId));
        const secuenciasArray = Array.isArray(secuenciasData) ? secuenciasData : [];
        const secuenciasMapeadas = secuenciasArray
          .filter(s => s && s.id !== undefined)
          .map((s: any) => ({
            id: s.id?.toString() ?? '',
            nombre: s.nombre ?? '',
            descripcion: s.descripcion ?? '',
            proyectoId: s.id_proyecto?.toString() ?? '',
            fechaCreacion: s.created_at ?? '',
            estado: s.estado || 'activa',
          }));
        setSecuencias(secuenciasMapeadas);
        // Seleccionar la primera secuencia si existe
        if (secuenciasMapeadas.length > 0) {
          setSecuenciaSeleccionada(secuenciasMapeadas[0]);
        } else {
          setSecuenciaSeleccionada(null);
        }
      }
    } catch (error) {
      console.error('Error al eliminar secuencia:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
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
      // Llamada al servicio de eliminación
      await eliminarProyecto(Number(proyecto.id));
      
      // Feedback de éxito (podría implementarse con un toast/notificación)
      console.log('Proyecto eliminado exitosamente');
      
      // Redirigir a la lista de proyectos
      //navigator('/proyectos');
      
    } catch (error) {
      console.error('Error al eliminar proyecto:', error);
      
      // Mostrar feedback al usuario (podría implementarse con un modal/notificación)
      alert('No se pudo eliminar el proyecto. Por favor intente nuevamente.');
      
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
              <ColaboradoresProyecto idProyecto={Number(proyecto.id)} />
            </div>

            <div className={styles['meta-section']}>
              <span className={styles['meta-label']}>Fecha de inicio:</span>
              <span className={styles['proyecto-fecha']}>
                {formatearFecha(proyecto.fecha_inicio)}
              </span>
            </div>

            <div className={styles['meta-section']}>
              <span className={styles['meta-label']}>Líder:</span>
              <LiderProyecto idProyecto={Number(proyecto.id)} />
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
          onEditarSecuencia={async () => {
            if (proyectoId) {
              const secuenciasData = await obtenerSecuenciasPorProyecto(Number(proyectoId));
              const secuenciasArray = Array.isArray(secuenciasData) ? secuenciasData : [];
              const secuenciasMapeadas = secuenciasArray
                .filter(s => s && s.id !== undefined)
                .map((s: any) => ({
                  id: s.id?.toString() ?? '',
                  nombre: s.nombre ?? '',
                  descripcion: s.descripcion ?? '',
                  proyectoId: s.id_proyecto?.toString() ?? '',
                  fechaCreacion: s.created_at ?? '',
                  estado: s.estado || 'activa',
                }));
              setSecuencias(secuenciasMapeadas);
              // Mantener la secuencia seleccionada si existe
              if (secuenciaSeleccionada) {
                const actualizada = secuenciasMapeadas.find(s => s.id === secuenciaSeleccionada.id);
                setSecuenciaSeleccionada(actualizada || (secuenciasMapeadas[0] ?? null));
              } else if (secuenciasMapeadas.length > 0) {
                setSecuenciaSeleccionada(secuenciasMapeadas[0]);
              }
            }
          }}
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