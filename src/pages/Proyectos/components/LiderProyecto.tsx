import React, { useEffect, useState } from 'react';
import { obtenerProyectoPorId } from '../../../services/proyectosService';
import { obtenerEmpleados } from '../../../services/empleadosService';

interface Props {
  idProyecto: number;
}

const LiderProyecto: React.FC<Props> = ({ idProyecto }) => {
  const [nombreLider, setNombreLider] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLider = async () => {
      setLoading(true);
      setError(null);
      try {
        const proyecto = await obtenerProyectoPorId(idProyecto);
        const empleados = await obtenerEmpleados();
        const lider = empleados.find((emp: any) => emp.id_empleado === proyecto.id_lider);
        setNombreLider(lider ? `${lider.nombre_pila} ${lider.apellido_paterno}` : 'Sin líder');
      } catch (err) {
        setError('Error al cargar líder');
      } finally {
        setLoading(false);
      }
    };
    fetchLider();
  }, [idProyecto]);

  if (loading) return <span>Cargando líder...</span>;
  if (error) return <span>{error}</span>;
  return <span>{nombreLider}</span>;
};

export default LiderProyecto;
