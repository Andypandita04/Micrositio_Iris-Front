import React from 'react';
import { Handle, Position } from 'reactflow';
import { Edit3, Trash2, BookOpen } from 'lucide-react';
import { LearningCardData } from './types';
import './styles/LearningCardNode.css';

/**
 * Props para el componente LearningCardNode
 */
interface LearningCardNodeProps {
  data: LearningCardData;     // Datos de la Learning Card
  selected?: boolean;         // Indica si el nodo está seleccionado
}

/**
 * Componente personalizado para representar una Learning Card en React Flow
 * 
 * Características:
 * - Muestra resultados y aprendizajes de un experimento
 * - Visualmente distinto de las Testing Cards
 * - Solo permite edición y eliminación (no puede crear nuevos nodos)
 */
const LearningCardNode: React.FC<LearningCardNodeProps> = ({ data, selected }) => {
  return (
    <div className={`learning-card ${selected ? 'selected' : ''}`}>
      {/* Handle superior para conexiones entrantes */}
      <Handle 
        type="target" 
        position={Position.Top} 
        className="node-handle" 
      />
      
      {/* Header de la tarjeta */}
      <div className="card-header">
        <div className="card-type">
          <BookOpen size={16} />
          <span>Learning Card</span>
        </div>
        <div className="card-id">ID: {data.id}</div>
      </div>

      {/* Cuerpo principal con información */}
      <div className="card-body">
        {/* Sección de resultados */}
        <div className="result-section">
          <h4>Resultado:</h4>
          <p>{data.result}</p>
        </div>
        
        {/* Sección de hallazgos accionables */}
        <div className="insight-section">
          <h4>Hallazgo accionable:</h4>
          <p>{data.actionableInsight}</p>
        </div>
      </div>

      {/* Footer con botones de acción */}
      <div className="card-footer">
        {/* Botón para editar la Learning Card */}
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            data.onEdit(); 
          }} 
          className="card-btn edit"
          title="Editar Learning Card"
        >
          <Edit3 size={14} /> Editar
        </button>
        
        {/* Botón para eliminar la Learning Card */}
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            data.onDelete(); 
          }} 
          className="card-btn delete"
          title="Eliminar Learning Card"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Handle inferior para conexiones salientes (opcional) */}
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="node-handle" 
      />
    </div>
  );
};

export default LearningCardNode;