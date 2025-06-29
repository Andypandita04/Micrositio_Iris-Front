import React, { useState } from 'react';
import { Play, Plus, Trash2 } from 'lucide-react';
import { Secuencia } from '../../../types/secuencia';
import Button from '../../../components/ui/Button/Button';
import ConfirmationModal from '../../../components/ui/ConfirmationModal/ConfirmationModal';
import styles from './SecuenciasSection.module.css';

/**
 * Props para el componente SecuenciasSection
 * @interface SecuenciasSectionProps
 */
interface SecuenciasSectionProps {
  /** Lista de secuencias del proyecto */
  secuencias: Secuencia[];
  /** Secuencia actualmente seleccionada */
  secuenciaSeleccionada: Secuencia | null;
  /** Función callback para seleccionar una secuencia */
  onSecuenciaSelect: (secuencia: Secuencia) => void;
  /** Función callback para crear una nueva secuencia */
  onNuevaSecuencia?: () => void;
  /** Función callback para eliminar una secuencia */
  onEliminarSecuencia?: (secuenciaId: string) => void;
}

/**
 * Componente SecuenciasSection
 * 
 * @component SecuenciasSection
 * @description Sección que muestra la lista de secuencias de un proyecto con
 * funcionalidades de selección, creación y eliminación. Incluye confirmación
 * de borrado seguro para prevenir eliminaciones accidentales.
 * 
 * Características principales:
 * - Grid responsive de tarjetas de secuencias
 * - Indicador visual de secuencia seleccionada
 * - Botón de eliminación con confirmación modal
 * - Estados de secuencia con colores diferenciados
 * - Formateo de fechas localizado
 * - Estado vacío con call-to-action
 * 
 * Funcionalidades de seguridad:
 * - Modal de confirmación para eliminación
 * - Mensaje claro sobre irreversibilidad
 * - Botones diferenciados (Cancelar/Confirmar)
 * 
 * @example
 * ```tsx
 * <SecuenciasSection
 *   secuencias={secuenciasDelProyecto}
 *   secuenciaSeleccionada={secuenciaActual}
 *   onSecuenciaSelect={handleSelectSecuencia}
 *   onNuevaSecuencia={handleCreateSecuencia}
 *   onEliminarSecuencia={handleDeleteSecuencia}
 * />
 * ```
 * 
 * @param {SecuenciasSectionProps} props - Props del componente
 * @returns {JSX.Element} Sección de secuencias
 */
const SecuenciasSection: React.FC<SecuenciasSectionProps> = ({
  secuencias,
  secuenciaSeleccionada,
  onSecuenciaSelect,
  onNuevaSecuencia,
  onEliminarSecuencia
}) => {
  // @state: Control del modal de confirmación de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // @state: Secuencia pendiente de eliminación
  const [secuenciaToDelete, setSecuenciaToDelete] = useState<Secuencia | null>(null);
  
  // @state: Estado de carga durante eliminación
  const [isDeleting, setIsDeleting] = useState(false);

  /**
   * Formatea una fecha para mostrar en formato localizado
   * @function formatearFecha
   * @param {string} fecha - Fecha en formato ISO string
   * @returns {string} Fecha formateada en español
   */
  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  /**
   * Inicia el proceso de eliminación de una secuencia
   * @function handleDeleteClick
   * @param {React.MouseEvent} e - Evento de clic para prevenir propagación
   * @param {Secuencia} secuencia - Secuencia a eliminar
   */
  const handleDeleteClick = (e: React.MouseEvent, secuencia: Secuencia) => {
    e.stopPropagation(); // @prevent: Evitar selección de la secuencia
    setSecuenciaToDelete(secuencia);
    setShowDeleteModal(true);
  };

  /**
   * Confirma y ejecuta la eliminación de la secuencia
   * @function handleConfirmDelete
   */
  const handleConfirmDelete = async () => {
    if (!secuenciaToDelete || !onEliminarSecuencia) return;

    setIsDeleting(true);

    try {
      // @action: Simular delay de API para mostrar estado de carga
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // @action: Ejecutar eliminación
      onEliminarSecuencia(secuenciaToDelete.id);
      
      // @cleanup: Limpiar estado
      setShowDeleteModal(false);
      setSecuenciaToDelete(null);
    } catch (error) {
      console.error('Error al eliminar secuencia:', error);
      // @todo: Mostrar mensaje de error al usuario
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Cancela el proceso de eliminación
   * @function handleCancelDelete
   */
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSecuenciaToDelete(null);
  };

  return (
    <div className={styles['secuencias-section']}>
      {/* @section: Header de la sección */}
      <div className={styles['secuencias-header']}>
        <div className={styles['secuencias-title-container']}>
          <h2 className={styles['secuencias-title']}>Secuencias del Proyecto</h2>
          <p className={styles['secuencias-description']}>
            Selecciona una secuencia para visualizar y editar su flujo de trabajo
          </p>
        </div>
      </div>

      {/* @section: Contenido principal */}
      <div className={styles['secuencias-content']}>
        {secuencias.length === 0 ? (
          /* @section: Estado vacío */
          <div className={styles['empty-secuencias']}>
            <h3 className={styles['empty-secuencias-title']}>No hay secuencias</h3>
            <p className={styles['empty-secuencias-description']}>
              Crea tu primera secuencia para comenzar a organizar el flujo de trabajo del proyecto.
            </p>
            {onNuevaSecuencia && (
              <Button
                variant="primary"
                icon={<Plus size={16} />}
                onClick={onNuevaSecuencia}
              >
                Crear Primera Secuencia
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* @section: Grid de secuencias */}
            <div className={styles['secuencias-grid']}>
              {secuencias.map((secuencia) => (
                <div
                  key={secuencia.id}
                  className={`${styles['secuencia-card']} ${
                    secuenciaSeleccionada?.id === secuencia.id ? styles['secuencia-card-selected'] : ''
                  }`}
                  onClick={() => onSecuenciaSelect(secuencia)}
                >
                  {/* @component: Indicador de selección */}
                  {secuenciaSeleccionada?.id === secuencia.id && (
                    <div className={styles['selected-indicator']} />
                  )}
                  
                  {/* @section: Header de la card */}
                  <div className={styles['secuencia-header']}>
                    <h3 className={styles['secuencia-nombre']}>{secuencia.nombre}</h3>
                    <div className={styles['secuencia-actions']}>
                      {/* @component: Badge de estado */}
                      <span className={`${styles['secuencia-estado']} ${styles[`estado-${secuencia.estado}`]}`}>
                        {secuencia.estado}
                      </span>
                      
                      {/* @component: Botón de eliminación */}
                      {onEliminarSecuencia && (
                        <button
                          className={styles['delete-button']}
                          onClick={(e) => handleDeleteClick(e, secuencia)}
                          title="Borrar secuencia"
                          aria-label={`Borrar secuencia ${secuencia.nombre}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* @section: Descripción */}
                  <p className={styles['secuencia-descripcion']}>
                    {secuencia.descripcion}
                  </p>

                  {/* @section: Fecha de creación */}
                  <div className={styles['secuencia-fecha']}>
                    Creada: {formatearFecha(secuencia.fechaCreacion)}
                  </div>
                </div>
              ))}
            </div>

            {/* @section: Botón para nueva secuencia */}
            {onNuevaSecuencia && (
              <div style={{ marginTop: 'var(--spacing-lg)', textAlign: 'center' }}>
                <Button
                  variant="outline"
                  icon={<Plus size={16} />}
                  onClick={onNuevaSecuencia}
                >
                  Nueva Secuencia
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* @component: Modal de confirmación de eliminación */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Borrar Secuencia"
        message={`¿Borrar toda la secuencia "${secuenciaToDelete?.nombre}"? Esta acción no puede deshacerse y se perderán todos los datos asociados.`}
        confirmText="Confirmar"
        cancelText="Cancelar"
        type="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default SecuenciasSection;