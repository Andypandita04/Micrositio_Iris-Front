import React from 'react';
import { Play, Plus } from 'lucide-react';
import { Secuencia } from '../../../types/secuencia';
import Button from '../../../components/ui/Button/Button';
import styles from './SecuenciasSection.module.css';

interface SecuenciasSectionProps {
  secuencias: Secuencia[];
  secuenciaSeleccionada: Secuencia | null;
  onSecuenciaSelect: (secuencia: Secuencia) => void;
  onNuevaSecuencia?: () => void;
}

const SecuenciasSection: React.FC<SecuenciasSectionProps> = ({
  secuencias,
  secuenciaSeleccionada,
  onSecuenciaSelect,
  onNuevaSecuencia
}) => {
  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={styles['secuencias-section']}>
      <div className={styles['secuencias-header']}>
        <div className={styles['secuencias-title-container']}>
          <h2 className={styles['secuencias-title']}>Secuencias del Proyecto</h2>
          <p className={styles['secuencias-description']}>
            Selecciona una secuencia para visualizar y editar su flujo de trabajo
          </p>
        </div>
      </div>

      <div className={styles['secuencias-content']}>
        {secuencias.length === 0 ? (
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
            <div className={styles['secuencias-grid']}>
              {secuencias.map((secuencia) => (
                <div
                  key={secuencia.id}
                  className={`${styles['secuencia-card']} ${
                    secuenciaSeleccionada?.id === secuencia.id ? styles['secuencia-card-selected'] : ''
                  }`}
                  onClick={() => onSecuenciaSelect(secuencia)}
                >
                  {secuenciaSeleccionada?.id === secuencia.id && (
                    <div className={styles['selected-indicator']} />
                  )}
                  
                  <div className={styles['secuencia-header']}>
                    <h3 className={styles['secuencia-nombre']}>{secuencia.nombre}</h3>
                    <span className={`${styles['secuencia-estado']} ${styles[`estado-${secuencia.estado}`]}`}>
                      {secuencia.estado}
                    </span>
                  </div>

                  <p className={styles['secuencia-descripcion']}>
                    {secuencia.descripcion}
                  </p>

                  <div className={styles['secuencia-fecha']}>
                    Creada: {formatearFecha(secuencia.fechaCreacion)}
                  </div>
                </div>
              ))}
            </div>

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
    </div>
  );
};

export default SecuenciasSection;