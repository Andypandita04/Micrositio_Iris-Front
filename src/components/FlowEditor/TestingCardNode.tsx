import React from 'react';
import { Handle, Position } from 'reactflow';
import { Edit3, Trash2, Plus, ClipboardList } from 'lucide-react';
import { TestingCardData } from './types';
import './styles/TestingCardNode.css';

interface TestingCardNodeProps {
  data: TestingCardData;
  selected?: boolean;
}

const TestingCardNode: React.FC<TestingCardNodeProps> = ({ data, selected }) => {
  return (
    <div className={`testing-card ${selected ? 'selected' : ''}`}>
      {/* Handle superior para conexiones entrantes */}
      <Handle 
        type="target" 
        position={Position.Top} 
        className="node-handle" 
      />
      
      {/* Handles laterales para conexiones entre Testing Cards */}
      <Handle 
        type="source" 
        position={Position.Left} 
        id="left"
        className="node-handle" 
      />
      <Handle 
        type="target" 
        position={Position.Left} 
        id="left-target"
        className="node-handle" 
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        id="right"
        className="node-handle" 
      />
      <Handle 
        type="target" 
        position={Position.Right} 
        id="right-target"
        className="node-handle" 
      />
      
      {/* Header de la tarjeta */}
      <div className="card-header">
        <div className="experiment-type">
          <ClipboardList size={14} />
          <span>{data.experimentType}</span>
        </div>
        <div className="card-id">#{data.id.slice(-4)}</div>
      </div>

      {/* Cuerpo principal con información */}
      <div className="card-body">
        <h3 className="card-title">{data.title}</h3>
        <p className="card-description">{data.description}</p>
        
        <div className="card-dates">
          <span className="dates-text">{data.startDate} - {data.endDate}</span>
          <span className={`status-badge ${data.status.toLowerCase().replace(' ', '-')}`}>
            {data.status}
          </span>
        </div>
      </div>

      {/* Footer con botones de acción */}
      <div className="card-footer">
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            data.onAddTesting(); 
          }} 
          className="card-btn add-testing"
          title="Añadir Testing Card conectada"
        >
          <Plus size={12} /> TC
        </button>
        
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            data.onAddLearning(); 
          }} 
          className="card-btn add-learning"
          title="Añadir Learning Card conectada"
        >
          <Plus size={12} /> LC
        </button>
        
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            data.onEdit(); 
          }} 
          className="card-btn edit"
          title="Editar Testing Card"
        >
          <Edit3 size={12} />
        </button>
        
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            data.onDelete(); 
          }} 
          className="card-btn delete"
          title="Eliminar Testing Card"
        >
          <Trash2 size={12} />
        </button>
      </div>

      {/* Handle inferior para conexiones a Learning Cards */}
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id="learning"
        className="node-handle" 
      />
    </div>
  );
};

export default TestingCardNode;