import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { proyectosMock } from '../../data/mockData';
import { Proyecto } from '../../types/proyecto';
import Button from '../../components/ui/Button/Button';
import NuevoProyectoModal from './components/NuevoProyectoModal';
import styles from './Proyectos.module.css';

const Proyectos: React.FC = () => {
  const navigate = useNavigate();
  const [proyectos] = useState<Proyecto[]>(proyectosMock);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProyectoClick = (proyectoId: string) => {
  navigate(`/proyectos/${proyectoId}`); 
};

  const handleNuevoProyecto = () => {
    setIsModalOpen(true);
  };

  const handleProyectoCreado = (proyectoId: string) => {
    setIsModalOpen(false);
    navigate(`/proyecto-${proyectoId}`);
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={styles['proyectos-container']}>
      <div className={styles['proyectos-content']}>
        <div className={styles['proyectos-header']}>
          <h1 className={styles['proyectos-title']}>Proyectos</h1>
          <Button
            variant="primary"
            icon={<Plus size={16} />}
            onClick={handleNuevoProyecto}
          >
            Nuevo Proyecto
          </Button>
        </div>

        {proyectos.length === 0 ? (
          <div className={styles['empty-state']}>
            <h2 className={styles['empty-state-title']}>No hay proyectos</h2>
            <p className={styles['empty-state-description']}>
              Comienza creando tu primer proyecto para organizar tu trabajo.
            </p>
            <Button
              variant="primary"
              icon={<Plus size={16} />}
              onClick={handleNuevoProyecto}
            >
              Crear Primer Proyecto
            </Button>
          </div>
        ) : (
          <div className={styles['proyectos-grid']}>
            {proyectos.map((proyecto) => (
              <div
                key={proyecto.id}
                className={styles['proyecto-card']}
                onClick={() => handleProyectoClick(proyecto.id)}
              >
                <div className={styles['proyecto-card-header']}>
                  <h3 className={styles['proyecto-nombre']}>{proyecto.nombre}</h3>
                  <p className={styles['proyecto-descripcion']}>{proyecto.descripcion}</p>
                </div>

                <div className={styles['proyecto-colaboradores']}>
                  <p className={styles['colaboradores-label']}>Colaboradores:</p>
                  <div className={styles['colaboradores-list']}>
                    {proyecto.colaboradores.map((colaborador) => (
                      <img
                        key={colaborador.id}
                        src={colaborador.avatar}
                        alt={colaborador.nombre}
                        className={styles['colaborador-avatar']}
                        title={colaborador.nombre}
                      />
                    ))}
                  </div>
                </div>

                <div className={styles['proyecto-footer']}>
                  <span className={styles['proyecto-fecha']}>
                    {formatearFecha(proyecto.fechaInicio)}
                  </span>
                  <span className={`${styles['proyecto-estado']} ${styles[`estado-${proyecto.estado}`]}`}>
                    {proyecto.estado}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <NuevoProyectoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onProyectoCreado={handleProyectoCreado}
        />
      </div>
    </div>
  );
};

export default Proyectos;