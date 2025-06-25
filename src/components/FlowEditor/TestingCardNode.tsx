import React from 'react';
import { Handle, Position } from 'reactflow';
import { Edit3, Trash2, Plus, FileText, ClipboardList } from 'lucide-react';
import { TestingCardData } from './types';
import './styles/TestingCardNode.css';

/**
 * Props para el componente TestingCardNode
 */
interface TestingCardNodeProps {
  data: TestingCardData;      // Datos de la Testing Card
  selected?: boolean;         // Indica si el nodo está seleccionado
}

/**
 * Componente personalizado para representar una Testing Card en React Flow
 * 
 * Características:
 * - Muestra información clave del experimento
 * - Permite añadir nuevas Testing Cards o Learning Cards conectadas
 * - Ofrece opciones para editar y eliminar
 * - Visualmente distinto de las Learning Cards
 */
const TestingCardNode: React.FC<TestingCardNodeProps> = ({ data, selected }) => {
  return (
    <div className={`testing-card ${selected ? 'selected' : ''}`}>
      {/* Handle superior para conexiones entrantes */}
      <Handle 
        type="target" 
        position={Position.Top} 
        className="node-handle" 
      />
      
      {/* Header de la tarjeta */}
      <div className="card-header">
        <div className="experiment-type">
          <ClipboardList size={16} />
          <span>{data.experimentType}</span>
        </div>
        <div className="card-id">ID: {data.id}</div>
      </div>

      {/* Cuerpo principal con información */}
      <div className="card-body">
        <h3 className="card-title">{data.title}</h3>
        <p className="card-description">{data.description}</p>
        
        <div className="card-dates">
          <span>{data.startDate} - {data.endDate}</span>
          <span className={`status-badge ${data.status.toLowerCase().replace(' ', '-')}`}>
            {data.status}
          </span>
        </div>
      </div>

      {/* Footer con botones de acción */}
      <div className="card-footer">
        {/* Botón para añadir nueva Testing Card conectada */}
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            data.onAddTesting(); 
          }} 
          className="card-btn add-testing"
          title="Añadir Testing Card conectada"
        >
          <Plus size={14} /> TC
        </button>
        
        {/* Botón para añadir Learning Card conectada */}
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            data.onAddLearning(); 
          }} 
          className="card-btn add-learning"
          title="Añadir Learning Card conectada"
        >
          <Plus size={14} /> LC
        </button>
        
        {/* Botón para editar la Testing Card */}
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            data.onEdit(); 
          }} 
          className="card-btn edit"
          title="Editar Testing Card"
        >
          <Edit3 size={14} />
        </button>
        
        {/* Botón para eliminar la Testing Card */}
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            data.onDelete(); 
          }} 
          className="card-btn delete"
          title="Eliminar Testing Card"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Handle inferior para conexiones salientes */}
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="node-handle" 
      />
    </div>
  );
};

export default TestingCardNode;