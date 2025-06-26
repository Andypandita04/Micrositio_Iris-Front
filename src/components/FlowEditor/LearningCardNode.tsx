import React from 'react';
import { Handle, Position } from 'reactflow';
import { Edit3, Trash2, BookOpen } from 'lucide-react';
import { LearningCardData } from './types';
import './styles/LearningCardNode.css';

interface LearningCardNodeProps {
  data: LearningCardData;
  selected?: boolean;
}

const LearningCardNode: React.FC<LearningCardNodeProps> = ({ data, selected }) => {
  return (
    <div className={`learning-card ${selected ? 'selected' : ''}`}>
      {/* Handle superior para conexiones desde Testing Cards */}
      <Handle 
        type="target" 
        position={Position.Top} 
        className="node-handle" 
      />
      
      {/* Header de la tarjeta */}
      <div className="card-header">
        <div className="card-type">
          <BookOpen size={14} />
          <span>Learning Card</span>
        </div>
        <div className="card-id">#{data.id.slice(-4)}</div>
      </div>

      {/* Cuerpo principal con información */}
      <div className="card-body">
        <div className="result-section">
          <h4>Resultado:</h4>
          <p>{data.result || 'Sin resultados registrados'}</p>
        </div>
        
        <div className="insight-section">
          <h4>Hallazgo accionable:</h4>
          <p>{data.actionableInsight || 'Sin hallazgos registrados'}</p>
        </div>
      </div>

      {/* Footer con botones de acción */}
      <div className="card-footer">
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            data.onEdit(); 
          }} 
          className="card-btn edit"
          title="Editar Learning Card"
        >
          <Edit3 size={12} /> Editar
        </button>
        
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            data.onDelete(); 
          }} 
          className="card-btn delete"
          title="Eliminar Learning Card"
        >
          <Trash2 size={12} />
        </button>
      </div>

      {/* Handle inferior opcional para futuras conexiones */}
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="node-handle" 
      />
    </div>
  );
};

export default LearningCardNode;