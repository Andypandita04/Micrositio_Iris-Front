import React, { useState, useEffect } from 'react'; // useEffect agregado para llamadas API
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Proyecto } from '../../types/proyecto'; // tu type Proyecto definido
import Button from '../../components/ui/Button/Button';
import NuevoProyectoModal from './components/NuevoProyectoModal';
import styles from './Proyectos.module.css';
import { getProyectos } from '../../api/ProyectoService'; // import de función API real

/**
 * Componente Proyectos
 * Lista proyectos obtenidos desde el backend y permite crear nuevos.
 */
const Proyectos: React.FC = () => {
  const navigate = useNavigate();

  // Estado de proyectos inicializado como array vacío
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);

  // Estado para controlar apertura de modal de nuevo proyecto
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estado para loading y manejo de errores opcional
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Llama al endpoint GET /api/proyectos al montar el componente.
   */
  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        setLoading(true);
        const data = await getProyectos(); // llamada a backend
        setProyectos(data);
      } catch (err) {
        console.error("Error cargando proyectos:", err);
        setError("Error cargando proyectos");
      } finally {
        setLoading(false);
      }
    };

    fetchProyectos();
  }, []);

  /**
   * Navega a la vista de detalle del proyecto seleccionado.
   * @param proyectoId ID del proyecto
   */
  const handleProyectoClick = (proyectoId: string) => {
    navigate(`/proyectos/${proyectoId}`);
  };

  /**
   * Abre el modal para crear un nuevo proyecto.
   */
  const handleNuevoProyecto = () => {
    setIsModalOpen(true);
  };

  /**
   * Callback cuando se crea un proyecto nuevo.
   * @param proyectoId ID del proyecto creado
   */
  const handleProyectoCreado = (proyectoId: string) => {
    setIsModalOpen(false);
    navigate(`/proyectos/${proyectoId}`);

    // Opcional: recargar lista después de crear
    // fetchProyectos(); // si deseas actualizar listado tras crear
  };

  /**
   * Formatea fecha a un string legible.
   * @param fecha Fecha ISO string
   * @returns Fecha formateada en español
   */
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

        {/* Loading State */}
        {loading && <p>Cargando proyectos...</p>}

        {/* Error State */}
        {error && <p>{error}</p>}

        {/* Empty State */}
        {!loading && proyectos.length === 0 && (
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
        )}

        {/* Lista de proyectos */}
        {!loading && proyectos.length > 0 && (
          <div className={styles['proyectos-grid']}>
            {proyectos.map((proyecto) => (
              <div
                key={proyecto.id}
                className={styles['proyecto-card']}
                onClick={() => handleProyectoClick(proyecto.id)}
              >
                <div className={styles['proyecto-card-header']}>
                  <h3 className={styles['proyecto-nombre']}>{proyecto.titulo}</h3>
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

        {/* Modal para nuevo proyecto */}
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
