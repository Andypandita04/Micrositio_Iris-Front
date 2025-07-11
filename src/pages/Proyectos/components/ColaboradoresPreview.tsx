import React from 'react';
import ColaboradoresProyecto from '../../ProyectoDetalle/ColaboradoresProyecto';


interface Props {
  idProyecto: number;
}

const ColaboradoresPreview: React.FC<Props> = ({ idProyecto }) => {
  // Simplemente reutiliza el componente de detalle pero con estilos mínimos
  return (
    <div style={{ minHeight: 32 }}>
      <ColaboradoresProyecto idProyecto={idProyecto} />
    </div>
  );
};

export default ColaboradoresPreview;
