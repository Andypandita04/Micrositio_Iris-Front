import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { 
  Edit3, 
  Trash2, 
  Plus, 
  ClipboardList, 
  ChevronDown,
  Target,
  Calendar,
  BarChart3,
  Users
} from 'lucide-react';
import { TestingCardData } from './types';
import './styles/TestingCardNode.css';

/**
 * Props para el componente TestingCardNode
 */
interface TestingCardNodeProps {
  /** Datos de la Testing Card */
  data: TestingCardData;
  /** Indica si el nodo está seleccionado */
  selected?: boolean;
}

/**
 * Mock data de colaboradores para mostrar en la card
 * @constant mockCollaborators
 */
const mockCollaborators = [
  {
    id: '1',
    name: 'Ana García',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '2',
    name: 'Carlos Rodríguez',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '3',
    name: 'María López',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '4',
    name: 'David Martínez',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '5',
    name: 'Laura Sánchez',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  }
];

/**
 * Componente TestingCardNode
 * 
 * Renderiza una Testing Card con diseño elegante y funcionalidad expandible.
 * Incluye información básica siempre visible y contenido adicional que se puede
 * mostrar/ocultar con el botón "Ver más". Ahora incluye sección de colaboradores
 * asignados debajo del título.
 * 
 * Características:
 * - Diseño moderno con sombras y gradientes
 * - Sección de colaboradores asignados con avatares
 * - Contenido expandible con animaciones suaves
 * - Handles personalizados para diferentes tipos de conexiones
 * - Botones de acción con estados hover
 * - Información estructurada (hipótesis, métricas, fechas)
 * - Responsive y compatible con modo oscuro
 */
const TestingCardNode: React.FC<TestingCardNodeProps> = ({ data, selected }) => {
  // Estado para controlar si el contenido está expandido
  const [isExpanded, setIsExpanded] = useState(false);

  /**
   * Alterna el estado de expansión del contenido
   */
  const toggleExpanded = () => {
    setIsExpanded(prev => !prev);
  };

  /**
   * Formatea la fecha para mostrar en formato corto
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric'
    });
  };

  /**
   * Obtiene los colaboradores asignados basado en los IDs
   * @function getAssignedCollaborators
   * @returns {Array} Lista de colaboradores asignados
   */
  const getAssignedCollaborators = () => {
    if (!data.collaborators || data.collaborators.length === 0) {
      return [];
    }
    
    return mockCollaborators.filter(collaborator => 
      data.collaborators?.includes(collaborator.id)
    );
  };

  /**
   * Genera las iniciales de un nombre
   * @function getInitials
   * @param {string} name - Nombre completo
   * @returns {string} Iniciales del nombre
   */
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const assignedCollaborators = getAssignedCollaborators();

  return (
    <div className={`testing-card ${selected ? 'selected' : ''}`}>
      {/* Handles para conexiones - Posicionamiento estratégico */}
      
      {/* Handle superior para conexiones entrantes */}
      <Handle 
        type="target" 
        position={Position.Top} 
        className="node-handle" 
        id="top"
      />
      
      {/* Handle izquierdo para conexiones entrantes laterales */}
      <Handle 
        type="target" 
        position={Position.Left} 
        className="node-handle" 
        id="left"
      />
      
      {/* Handle derecho para conexiones a otras Testing Cards */}
      <Handle 
        type="source" 
        position={Position.Right} 
        className="node-handle" 
        id="right"
      />
      
      {/* Handle inferior para conexiones a Learning Cards */}
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="node-handle" 
        id="bottom"
      />
      
      {/* Header de la card con tipo de experimento e ID y estado */}
      <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="experiment-type">
            <ClipboardList size={14} />
            <span>{data.experimentType}</span>
          </div>
          {/* Estado visual */}
          {data.status && (
            <span
              className="testing-status-badge"
              style={{
                backgroundColor:
                  data.status === 'En validación'
                    ? '#facc15' // amarillo
                    : data.status === 'En proceso'
                    ? '#22c55e' // verde
                    : data.status === 'En ejecución'
                    ? '#2563eb' // azul
                    : data.status === 'Terminado'
                    ? '#ef4444' // rojo
                    : '#e5e7eb', // gris por defecto
                color: '#fff',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                padding: '2px 10px',
                marginLeft: 8,
                minWidth: 80,
                textAlign: 'center',
                textTransform: 'capitalize',
                letterSpacing: 0.5,
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
              }}
            >
              {data.status}
            </span>
          )}
        </div>
        <div className="card-id">#{data.id.slice(-4)}</div>
      </div>

      {/* Cuerpo principal con información básica */}
      <div className="card-body">
        {/* Título de la Testing Card */}
        <h3 className="card-title">{data.title}</h3>
        
        {/* @section: Colaboradores asignados - Posición: Debajo del título */}
        {assignedCollaborators.length > 0 && (
          <div className="card-collaborators">
            <div className="collaborators-label">
              <Users size={12} />
              <span>Asignar colaboradores</span>
            </div>
            <div className="collaborators-list">
              {assignedCollaborators.slice(0, 3).map((collaborator) => (
                <div key={collaborator.id} className="collaborator-avatar-container">
                  {collaborator.avatar ? (
                    <img 
                      src={collaborator.avatar} 
                      alt={collaborator.name}
                      className="collaborator-avatar"
                      title={collaborator.name}
                    />
                  ) : (
                    <div 
                      className="collaborator-avatar-placeholder"
                      title={collaborator.name}
                    >
                      {getInitials(collaborator.name)}
                    </div>
                  )}
                </div>
              ))}
              {assignedCollaborators.length > 3 && (
                <div className="collaborator-counter" title={`${assignedCollaborators.length - 3} más`}>
                  +{assignedCollaborators.length - 3}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Descripción básica (siempre visible) */}
        <p className="card-description">{data.description}</p>
        
        {/* Botón para expandir/contraer contenido adicional */}
        <button 
          onClick={toggleExpanded}
          className="expand-button"
          aria-label={isExpanded ? "Ocultar detalles" : "Ver más detalles"}
        >
          <span>{isExpanded ? 'Ver menos' : 'Ver más'}</span>
          <ChevronDown 
            size={16} 
            className={`expand-icon ${isExpanded ? 'expanded' : ''}`}
          />
        </button>

        {/* Contenido expandible con información detallada */}
        <div className={`expandable-content ${isExpanded ? 'expanded' : 'collapsed'}`}>
          {/* Sección de hipótesis */}
          <div className="hypothesis-section">
            <div className="hypothesis-label">
              <Target size={12} style={{ marginRight: '4px' }} />
              Hipótesis
            </div>
            <p className="hypothesis-text">{data.hypothesis}</p>
          </div>

          {/* Sección de métricas si existen */}
          {data.metrics && data.metrics.length > 0 && (
            <div className="metrics-section">
              <div className="metrics-label">
                <BarChart3 size={12} style={{ marginRight: '4px' }} />
                Métricas a medir
              </div>
              <div className="metrics-list">
                {data.metrics.map((metric, index) => (
                  <span key={index} className="metric-item">
                    {metric.metric} ({metric.unit})
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Información adicional del experimento */}
          <div className="experiment-details">
            <div style={{ 
              fontSize: 'var(--font-size-xs)', 
              color: 'var(--theme-text-secondary)',
              marginBottom: 'var(--spacing-xs)'
            }}>
              <strong>Categoría:</strong> {data.experimentCategory}
            </div>
            {data.responsible && (
              <div style={{ 
                fontSize: 'var(--font-size-xs)', 
                color: 'var(--theme-text-secondary)' 
              }}>
                <strong>Responsable:</strong> {data.responsible}
              </div>
            )}
          </div>
        </div>
        
        {/* Información de fechas y estado */}
        <div className="card-dates">
          <span className="dates-text">
            <Calendar size={12} style={{ marginRight: '4px' }} />
            {formatDate(data.startDate)} - {formatDate(data.endDate)}
          </span>
          <span className={`status-badge ${data.status.toLowerCase().replace(' ', '-')}`}>
            {data.status}
          </span>
        </div>
      </div>

      {/* Footer con botones de acción */}
      <div className="card-footer">
        {/* Botón para añadir Testing Card conectada */}
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
        
        {/* Botón para añadir Learning Card conectada */}
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
        
        {/* Botón para editar la Testing Card */}
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
        
        {/* Botón para eliminar la Testing Card */}
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
    </div>
  );
};

export default TestingCardNode;