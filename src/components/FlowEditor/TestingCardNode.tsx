import React, { useState, useEffect } from 'react';
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
  ExternalLink
} from 'lucide-react';
import { TestingCardData } from './types';
import { MetricaTestingCard, obtenerPorTestingCard } from '../../services/metricaTestingCardService';
import { UrlTestingCard, obtenerPorTestingCard as obtenerUrlsPorTestingCard } from '../../services/urlTestingCardService';
import './styles/TestingCardNode.css';

interface TestingCardNodeProps {
  data: TestingCardData & {
    onEdit: () => void;
    onDelete: () => void;
    onAddTesting: () => void;
    onAddLearning: () => void;
    onStatusChange: () => void;
  };
  selected?: boolean;
}

const TestingCardNode: React.FC<TestingCardNodeProps> = ({ data, selected }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [metricas, setMetricas] = useState<MetricaTestingCard[]>([]);
  const [loadingMetricas, setLoadingMetricas] = useState(false);
  
  // Estado para las URLs de la Testing Card
  const [urls, setUrls] = useState<UrlTestingCard[]>([]);
  const [loadingUrls, setLoadingUrls] = useState(false);

  const toggleExpanded = () => setIsExpanded(prev => !prev);

  // Cargar métricas y URLs cuando se expande el componente
  useEffect(() => {
    console.log('[TestingCardNode] useEffect activado:', {
      isExpanded,
      id_testing_card: data.id_testing_card
    });
    
    if (isExpanded && data.id_testing_card) {
      console.log('[TestingCardNode] Condiciones cumplidas, iniciando cargas...');
      cargarMetricas();
      cargarUrls();
    } else {
      console.log('[TestingCardNode] Condiciones no cumplidas:', {
        expandido: isExpanded,
        tieneId: !!data.id_testing_card
      });
    }
  }, [isExpanded, data.id_testing_card]);

  const cargarMetricas = async () => {
    try {
      setLoadingMetricas(true);
      const metricasData = await obtenerPorTestingCard(data.id_testing_card);
      setMetricas(metricasData);
    } catch (error) {
      console.error('Error al cargar métricas:', error);
      setMetricas([]);
    } finally {
      setLoadingMetricas(false);
    }
  };

  /**
   * Carga las URLs desde la base de datos
   */
  const cargarUrls = async () => {
    if (!data.id_testing_card) return;
    
    try {
      setLoadingUrls(true);
      const urlsData = await obtenerUrlsPorTestingCard(data.id_testing_card);
      setUrls(urlsData || []);
    } catch (error) {
      console.error('[TestingCardNode] Error al cargar URLs:', error);
      setUrls([]);
    } finally {
      setLoadingUrls(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric'
    });
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

  const renderMetricas = () => {
    if (loadingMetricas) {
      return (
        <div className="metricas-loading">
          <span>Cargando métricas...</span>
        </div>
      );
    }

    if (metricas.length === 0) {
      return (
        <div className="metricas-empty">
          <span>No hay métricas definidas</span>
        </div>
      );
    }

    return (
      <div className="metricas-list">
        {metricas.map((metrica) => (
          <div key={metrica.id_metrica} className="metrica-item">
            <div className="metrica-header">
              <BarChart3 size={14} />
              <span className="metrica-nombre">{metrica.nombre}</span>
            </div>
            <div className="metrica-criterio">
              <span className="metrica-operador">{metrica.operador}</span>
              <span className="metrica-valor">{metrica.criterio}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`testing-card ${selected ? 'selected' : ''}`}>
      {/* Handles */}
      <Handle type="target" position={Position.Top} className="node-handle" id="top" />
      <Handle type="target" position={Position.Left} className="node-handle" id="left" />
      <Handle type="source" position={Position.Right} className="node-handle" id="right" />
      <Handle type="source" position={Position.Bottom} className="node-handle" id="bottom" />

      <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="experiment-type">
            <ClipboardList size={14} />
            <span>TESTING CARD</span>
            {/*<span>Tipo #{data.id_experimento_tipo}</span> */}
          </div>
        </div>
      </div>

      <div className="card-body">
        <h3 className="card-title">{data.titulo}</h3>
        <p className="card-description">{data.descripcion}</p>

        <button
          onClick={toggleExpanded}
          className="expand-button"
          aria-label={isExpanded ? "Ocultar detalles" : "Ver más detalles"}
        >
          <span>{isExpanded ? 'Ver menos' : 'Ver más'}</span>
          <ChevronDown size={16} className={`expand-icon ${isExpanded ? 'expanded' : ''}`} />
        </button>

        <div className={`expandable-content ${isExpanded ? 'expanded' : 'collapsed'}`}>
          <div className="hypothesis-section">
            <div className="hypothesis-label">
              <Target size={12} style={{ marginRight: '4px' }} />
              Hipótesis
            </div>
            <p className="hypothesis-text">{data.hipotesis}</p>
          </div>

          {/* Nueva sección de métricas */}
          <div className="metricas-section">
            <div className="metricas-label">
              <BarChart3 size={12} style={{ marginRight: '4px' }} />
              Métricas de Éxito
            </div>
            {renderMetricas()}
          </div>

          {/* Sección de URLs de documentación */}
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
                  <div key={urlObj.id_url_tc} className="link-item">
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

          <div className="experiment-details">
            <div style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--theme-text-secondary)',
              marginBottom: 'var(--spacing-xs)'
            }}>
              {/*<strong>ID Secuencia:</strong> {data.id_secuencia}*/}
            </div>
            
          </div>
        </div>

        <div className="card-dates">
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Calendar size={12} />
            <span className="dates-text">
              {formatDate(data.dia_inicio)} - {formatDate(data.dia_fin)}
            </span>
          </div>

          <span
            className={`status-badge ${data.status.toLowerCase().replace(' ', '-')}`}
            style={{
              backgroundColor:
                data.status === 'En validación'
                  ? '#facc15'
                  : data.status === 'En desarrollo'
                  ? '#22c55e'
                  : data.status === 'En ejecución'
                  ? '#2563eb'
                  : data.status === 'Terminado'
                  ? '#ef4444'
                  : '#9ca3af',
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
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
              cursor: 'pointer',
            }}
            onClick={(e) => {
              e.stopPropagation();
              data.onStatusChange();
            }}
          >
            {data.status}
          </span>
        </div>
      </div>

      <div className="card-footer">
        <button onClick={(e) => { e.stopPropagation(); data.onAddTesting(); }} className="card-btn add-testing" title="Añadir Testing Card conectada">
          <Plus size={12} /> TC
        </button>
        <button onClick={(e) => { e.stopPropagation(); data.onAddLearning(); }} className="card-btn add-learning" title="Añadir Learning Card conectada">
          <Plus size={12} /> LC
        </button>
        <button onClick={(e) => { e.stopPropagation(); data.onEdit(); }} className="card-btn edit" title="Editar Testing Card">
          <Edit3 size={12} />
        </button>
        <button onClick={(e) => { e.stopPropagation(); data.onDelete(); }} className="card-btn delete" title="Eliminar Testing Card">
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
};

export default TestingCardNode;
