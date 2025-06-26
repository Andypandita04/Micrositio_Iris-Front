import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Edit } from 'lucide-react';
import { proyectosMock } from '../../data/mockData';
import { Proyecto } from '../../types/proyecto';
import Button from '../../components/ui/Button/Button';
import FlowEditor from '../../components/FlowEditor/FlowEditor';
import EditarProyectoModal from './components/EditarProyectoModal';
import styles from './ProyectoDetalle.module.css';

const ProyectoDetalle: React.FC = () => {
  const { proyectoId } = useParams<{ proyectoId: string }>();
  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos
    const timer = setTimeout(() => {
      if (proyectoId) {
        const id = proyectoId.replace('proyecto-', '');
        const proyectoEncontrado = proyectosMock.find(p => p.id === id);
        setProyecto(proyectoEncontrado || null);
      }
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [proyectoId]);

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleProyectoActualizado = (proyectoActualizado: Proyecto) => {
    setProyecto(proyectoActualizado);
    setIsEditModalOpen(false);
  };

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
        <div className={styles['proyecto-header']}>
          <div className={styles['proyecto-header-top']}>
            <div className={styles['proyecto-info']}>
              <h1 className={styles['proyecto-nombre']}>{proyecto.nombre}</h1>
              <p className={styles['proyecto-descripcion']}>{proyecto.descripcion}</p>
            </div>
            <Button
              variant="outline"
              icon={<Edit size={16} />}
              onClick={() => setIsEditModalOpen(true)}
            >
              Editar
            </Button>
          </div>

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

        <div className={styles['flow-section']}>
          <div className={styles['flow-header']}>
            <h2 className={styles['flow-title']}>Editor de Flujo del Proyecto</h2>
          </div>
          <div className={styles['flow-container']}>
            <FlowEditor />
          </div>
        </div>

        <EditarProyectoModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          proyecto={proyecto}
          onProyectoActualizado={handleProyectoActualizado}
        />
      </div>
    </div>
  );
};

export default ProyectoDetalle;