import React from 'react';
import { Handle, Position } from 'reactflow';
import { Edit3, Trash2, Plus } from 'lucide-react';
import { NodeData } from './types';
import './styles/CustomNode.css';

/**
 * Props para el componente CustomNode
 */
interface CustomNodeProps {
  data: NodeData;
  selected?: boolean;
}

/**
 * Componente de nodo personalizado para React Flow
 * Muestra la información del nodo y proporciona botones para las operaciones CRUD
 */
const CustomNode: React.FC<CustomNodeProps> = ({ data, selected }) => {
  return (
    <div className={`custom-node ${selected ? 'selected' : ''}`}>
      {/* Handle de entrada (parte superior) */}
      <Handle
        type="target"
        position={Position.Top}
        className="custom-handle custom-handle-target"
      />

      {/* Contenido del nodo */}
      <div className="node-content">
        {/* Header con título */}
        <div className="node-header">
          <h3 className="node-title">{data.nombre}</h3>
        </div>

        {/* Cuerpo con información */}
        <div className="node-body">
          <p className="node-description">{data.descripcion}</p>
          <div className="node-date">
            <span className="date-label">Fecha:</span>
            <span className="date-value">{data.fecha}</span>
          </div>
        </div>

        {/* Footer con botones de acción */}
        <div className="node-footer">
          <button
            onClick={(e) => {
              e.stopPropagation();
              data.onEdit();
            }}
            className="node-btn node-btn-edit"
            title="Editar nodo"
          >
            <Edit3 size={14} />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              data.onAddChild();
            }}
            className="node-btn node-btn-add"
            title="Agregar nodo hijo"
          >
            <Plus size={14} />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              data.onDelete();
            }}
            className="node-btn node-btn-delete"
            title="Eliminar nodo"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Handle de salida (parte inferior) */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="custom-handle custom-handle-source"
      />
    </div>
  );
};

export default CustomNode;