import React, { useEffect, useState } from 'react';
import { obtenerPorProyecto } from '../../services/celulaProyectoService';
import { obtenerEmpleados } from '../../services/empleadosService';

interface Colaborador {
  id_empleado: number;
  nombre: string;
}

interface Props {
  idProyecto: number;
}

const ColaboradoresProyecto: React.FC<Props> = ({ idProyecto }) => {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchColaboradores = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Obtener relaciones celula-proyecto por id_proyecto
        const relaciones = await obtenerPorProyecto(idProyecto);
        const ids = relaciones.map((rel: any) => rel.id_empleado);
        // 2. Obtener todos los empleados (puedes optimizar si tienes endpoint por id)
        const empleados = await obtenerEmpleados();
        // 3. Filtrar solo los colaboradores de este proyecto
        const colaboradoresProyecto = empleados
          .filter((emp: any) => ids.includes(emp.id_empleado))
          .map((emp: any) => ({ id_empleado: emp.id_empleado, nombre: `${emp.nombre_pila} ${emp.apellido_paterno}` }));
        setColaboradores(colaboradoresProyecto);
      } catch (err) {
        setError('Error al cargar colaboradores');
      } finally {
        setLoading(false);
      }
    };
    fetchColaboradores();
  }, [idProyecto]);

  if (loading) return <div>Cargando colaboradores...</div>;
  if (error) return <div>{error}</div>;
  if (colaboradores.length === 0) return <div>No hay colaboradores asignados.</div>;

  return (
    <ul>
      {colaboradores.map(col => (
        <li key={col.id_empleado}>{col.nombre}</li>
      ))}
    </ul>
  );
};

export default ColaboradoresProyecto;
