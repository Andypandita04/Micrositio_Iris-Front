import React, { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { 
  Edit3, 
  Trash2, 
  BookOpen, 
  ChevronDown,
  FileText,
  Lightbulb,
  ExternalLink
} from 'lucide-react';
import { LearningCardData } from './types';
import { UrlLearningCard, obtenerPorLearningCard } from '../../services/urlLearningCardService';
import './styles/LearningCardNode.css';

/**
 * Props para el componente LearningCardNode
 */
interface LearningCardNodeProps {
  /** Datos de la Learning Card */
  data: LearningCardData & {
    onEdit: () => void;
    onDelete: () => void;
  };
  /** Indica si el nodo está seleccionado */
  selected?: boolean;
}


/**
 * Componente LearningCardNode
 * 
 * Renderiza una Learning Card con diseño elegante y funcionalidad expandible.
 * Muestra resultados y hallazgos de experimentos con contenido adicional
 * que se puede mostrar/ocultar. Ahora incluye sección de colaboradores
 * (co-autores) en la sección derecha superior.
 * 
 * Características:
 * - Diseño moderno con tema verde para diferenciarse de Testing Cards
 * - Sección de co-autores en la parte superior derecha
 * - Contenido expandible con animaciones suaves
 * - Secciones diferenciadas para resultados e insights
 * - Enlaces y archivos adjuntos en contenido expandible
 * - Handle superior para conexiones desde Testing Cards
 * - Responsive y compatible con modo oscuro
 */
const LearningCardNode: React.FC<LearningCardNodeProps> = ({ data, selected }) => {
  // Estado visual para la Learning Card: Cumplido, Rechazado, Repetir, Validada
  const statusMap: Record<string, { label: string; className: string }> = {
    'cumplido': { label: 'Cumplido', className: 'learning-status-cumplido' },
    'rechazado': { label: 'Rechazado', className: 'learning-status-rechazado' },
    'repetir': { label: 'Repetir', className: 'learning-status-repetir' },
    'validada': { label: 'Validada', className: 'learning-status-validada' },
  };
  const statusKey = (data.estado || '').toLowerCase();
  const statusInfo = statusMap[statusKey];
  // Estado para controlar si el contenido está expandido
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Estado para las URLs de la Learning Card
  const [urls, setUrls] = useState<UrlLearningCard[]>([]);
  const [loadingUrls, setLoadingUrls] = useState(false);

  /**
   * Carga las URLs cuando se expande el contenido y hay un ID válido
   */
  useEffect(() => {
    if (isExpanded && data.id_learning_card) {
      cargarUrls();
    }
    // eslint-disable-next-line
  }, [isExpanded, data.id_learning_card]);

  /**
   * Carga las URLs desde la base de datos
   */
  const cargarUrls = async () => {
    if (!data.id_learning_card) return;
    
    try {
      setLoadingUrls(true);
      const urlsData = await obtenerPorLearningCard(data.id_learning_card);
      setUrls(urlsData || []);
    } catch (error) {
      console.error('[LearningCardNode] Error al cargar URLs:', error);
      setUrls([]);
    } finally {
      setLoadingUrls(false);
    }
  };

  /**
   * Alterna el estado de expansión del contenido
   */
  const toggleExpanded = () => {
    setIsExpanded(prev => !prev);
  };

  /**
   * Trunca texto para la vista previa
   */
  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  /**
   * Trunca URLs de forma inteligente para mejor legibilidad
   */
  const truncateUrl = (url: string, maxLength: number = 50) => {
    if (url.length <= maxLength) return url;
    
    // Intentar mantener el dominio visible
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname;
      const path = urlObj.pathname + urlObj.search;
      
      if (domain.length < maxLength - 10) {
        const remainingLength = maxLength - domain.length - 3; // 3 para "..."
        return domain + (path.length > remainingLength ? `...${path.slice(-remainingLength)}` : path);
      }
    } catch (e) {
      // Si no es una URL válida, truncar normalmente
    }
    
    return url.substring(0, maxLength) + '...';
  };

  return (
    <div className={`learning-card ${selected ? 'selected' : ''}`}>
      {/* Handle superior para conexiones desde Testing Cards */}
      <Handle 
        type="target" 
        position={Position.Top} 
        className="node-handle" 
      />
      
      {/* Handle inferior opcional para futuras conexiones */}
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="node-handle" 
      />
      
      {/* Header de la card con tipo, estado e ID */}
      <div className="card-header">
        <div className="card-header-left">
          <div className="card-type">
            <BookOpen size={14} />
            <span>Learning Card</span>
          </div>
          {/* Estado visual */}
          {statusInfo && (
            <span className={`learning-status-badge ${statusInfo.className}`}>{statusInfo.label}</span>
          )}
        </div>
        {/*<div className="card-id">#{data.id_learning_card.toString().slice(-4)}</div>*/}
      </div>

      {/* @section: Co-autores - Posición: Sección derecha superior 
      {assignedCollaborators.length > 0 && (
        <div className="card-collaborators">
          <div className="collaborators-label">
            <Users size={12} />
            <span>Co-autores</span>
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
      )} */}

      {/* Cuerpo principal con información */}
      <div className="card-body">
        {/* Sección de resultados */}
        <div className="result-section">
          <h4>
            <FileText size={12} style={{ marginRight: '4px' }} />
            Resultados
          </h4>
          <p className={isExpanded ? 'section-text-expanded' : 'section-text-collapsed'}>
            {isExpanded ? data.resultado : truncateText(data.resultado || 'Sin resultados registrados')}
          </p>
        </div>
        
        {/* Sección de hallazgos accionables */}
        <div className="insight-section">
          <h4>
            <Lightbulb size={12} style={{ marginRight: '4px' }} />
            Hallazgo Accionable
          </h4>
          <p className={isExpanded ? 'section-text-expanded' : 'section-text-collapsed'}>
            {isExpanded ? data.hallazgo : truncateText(data.hallazgo || 'Sin hallazgos registrados')}
          </p>
        </div>

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

        {/* Contenido expandible con información adicional */}
        <div className={`expandable-content ${isExpanded ? 'expanded' : 'collapsed'}`}>
          {/* Sección de URLs de documentación */}
          {isExpanded && (
            <div className="links-section">
              <div className="links-label">
                <ExternalLink size={12} style={{ marginRight: '4px' }} />
                URLs de referencia
              </div>
              
              {loadingUrls && (
                <div className="loading-urls" style={{ 
                  fontSize: '12px', 
                  color: 'var(--theme-text-secondary)',
                  fontStyle: 'italic',
                  padding: '4px 0'
                }}>
                  Cargando URLs...
                </div>
              )}

              {!loadingUrls && urls.length === 0 && (
                <div className="no-urls" style={{ 
                  fontSize: '12px', 
                  color: 'var(--theme-text-secondary)',
                  fontStyle: 'italic',
                  padding: '4px 0'
                }}>
                  No hay URLs registradas
                </div>
              )}

              {!loadingUrls && urls.length > 0 && (
                <div className="links-list">
                  {urls.map((urlObj) => (
                    <div key={urlObj.id_url_lc} className="link-item">
                      <ExternalLink size={12} />
                      <a 
                        href={urlObj.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="link-text"
                        onClick={(e) => e.stopPropagation()}
                        title={urlObj.url}
                      >
                        {truncateUrl(urlObj.url)}
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Sección de archivos adjuntos 
          {data.attachments && data.attachments.length > 0 && (
            <div className="attachments-section">
              <div className="attachments-label">
                <Paperclip size={12} style={{ marginRight: '4px' }} />
                Archivos adjuntos
              </div>
              <div className="attachments-list">
                {data.attachments.map((attachment, index) => (
                  <div key={index} className="attachment-item">
                    <Paperclip size={12} />
                    <span>{attachment.fileName}</span>
                  </div>
                ))}
              </div>
            </div>
          )}*/}

          {/* Información adicional */}
          <div style={{ 
            fontSize: 'var(--font-size-xs)', 
            color: 'var(--theme-text-secondary)',
            marginTop: 'var(--spacing-sm)',
            padding: 'var(--spacing-sm)',
            background: 'var(--theme-bg-secondary)',
            borderRadius: 'var(--border-radius-md)',
            border: '1px solid var(--theme-border)'
          }}>
            {/*<strong>Testing Card asociada:</strong> #{data.id_testing_card.toString().slice(-4)}*/}
          </div>
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
          <Edit3 size={12} />
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
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
};

export default LearningCardNode;