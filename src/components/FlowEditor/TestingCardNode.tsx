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
  ExternalLink,
  FileText,
  Eye,
  Download,
  Image,
  File,
  FileVideo,
  FileAudio,
  FileSpreadsheet,
  Presentation
} from 'lucide-react';
import { TestingCardData } from './types';
import { MetricaTestingCard, obtenerPorTestingCard } from '../../services/metricaTestingCardService';
import { UrlTestingCard, obtenerPorTestingCard as obtenerUrlsPorTestingCard } from '../../services/urlTestingCardService';
import { TestingCardDocument, getDocumentsByTestingCard, isImage } from '../../services/testingCardDocumentService';
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

  // Estado para los documentos de la Testing Card
  const [documentos, setDocumentos] = useState<TestingCardDocument[]>([]);
  const [loadingDocumentos, setLoadingDocumentos] = useState(false);

  const toggleExpanded = () => setIsExpanded(prev => !prev);

  // Cargar métricas, URLs y documentos cuando se expande el componente
  useEffect(() => {
    console.log('[TestingCardNode] useEffect activado:', {
      isExpanded,
      id_testing_card: data.id_testing_card
    });
    
    if (isExpanded && data.id_testing_card) {
      console.log('[TestingCardNode] Condiciones cumplidas, iniciando cargas...');
      cargarMetricas();
      cargarUrls();
      cargarDocumentos();
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

  /**
   * Carga los documentos desde la base de datos
   */
  const cargarDocumentos = async () => {
    console.log('[TestingCardNode] Iniciando carga de documentos...');
    console.log('[TestingCardNode] ID Testing Card:', data.id_testing_card);
    
    if (!data.id_testing_card) {
      console.warn('[TestingCardNode] No hay ID de Testing Card, cancelando carga de documentos');
      return;
    }
    
    try {
      console.log('[TestingCardNode] Estableciendo estado de carga: true');
      setLoadingDocumentos(true);
      
      console.log('[TestingCardNode] Llamando al servicio getDocumentsByTestingCard...');
      const documentosData = await getDocumentsByTestingCard(data.id_testing_card);
      
      console.log('[TestingCardNode] Respuesta del servicio:', documentosData);
      console.log('[TestingCardNode] Cantidad de documentos recibidos:', documentosData?.length || 0);
      
      if (documentosData && documentosData.length > 0) {
        console.log('[TestingCardNode] Documentos encontrados:', documentosData.map(doc => ({
          id: doc.id,
          nombre: doc.document_name,
          tipo: doc.document_type,
          url: doc.document_url
        })));
      } else {
        console.log('[TestingCardNode] No se encontraron documentos para esta Testing Card');
      }
      
      setDocumentos(documentosData || []);
      console.log('[TestingCardNode] Estado de documentos actualizado');
    } catch (error) {
      console.error('[TestingCardNode] Error al cargar documentos:', error);
      console.error('[TestingCardNode] Detalles del error:', {
        message: error instanceof Error ? error.message : 'Error desconocido',
        stack: error instanceof Error ? error.stack : undefined
      });
      setDocumentos([]);
    } finally {
      console.log('[TestingCardNode] Estableciendo estado de carga: false');
      setLoadingDocumentos(false);
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

  /**
   * Obtiene el icono de Lucide para un tipo de documento
   */
  const getDocumentIconComponent = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return Image;
    if (mimeType === 'application/pdf') return FileText;
    if (mimeType.includes('word')) return File;
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return FileSpreadsheet;
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return Presentation;
    if (mimeType.startsWith('video/')) return FileVideo;
    if (mimeType.startsWith('audio/')) return FileAudio;
    return File;
  };

  /**
   * Trunca nombres de documento para mejor legibilidad
   */
  const truncateDocumentName = (name: string, maxLength: number = 30) => {
    if (name.length <= maxLength) return name;
    
    const extension = name.split('.').pop();
    const nameWithoutExt = name.substring(0, name.lastIndexOf('.'));
    const maxNameLength = maxLength - extension!.length - 4; // 4 para "..." y "."
    
    return `${nameWithoutExt.substring(0, maxNameLength)}...${extension}`;
  };

  /**
   * Maneja la visualización de un documento (abre en nueva pestaña o descarga según tipo)
   */
  const handleViewDocument = (documento: TestingCardDocument) => {
    console.log('[TestingCardNode] handleViewDocument llamado:', {
      documento: documento.document_name,
      tipo: documento.document_type,
      url: documento.document_url
    });
    
    if (isImage(documento.document_type) || documento.document_type === 'pdf') {
      console.log('[TestingCardNode] Abriendo en nueva pestaña (imagen o PDF)');
      // Abrir en nueva pestaña para PDFs e imágenes
      window.open(documento.document_url, '_blank');
    } else {
      console.log('[TestingCardNode] Iniciando descarga directa (otro tipo de archivo)');
      // Descargar directamente para otros tipos
      handleDownloadDocument(documento);
    }
  };

  /**
   * Maneja la descarga forzada de un documento
   */
  const handleDownloadDocument = (documento: TestingCardDocument) => {
    console.log('[TestingCardNode] handleDownloadDocument llamado:', {
      documento: documento.document_name,
      url: documento.document_url
    });
    
    const link = document.createElement('a');
    link.href = documento.document_url;
    link.download = documento.document_name;
    link.click();
    
    console.log('[TestingCardNode] Descarga iniciada');
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

    const renderDocumentos = () => {
    console.log('[TestingCardNode] renderDocumentos llamado:', {
      loadingDocumentos,
      cantidadDocumentos: documentos.length,
      documentos: documentos.map(d => d.document_name)
    });
    
    if (loadingDocumentos) {
      console.log('[TestingCardNode] Mostrando estado de carga');
      return (
        <div className="documentos-loading" style={{ 
          fontSize: '12px', 
          color: 'var(--theme-text-secondary)',
          fontStyle: 'italic',
          padding: '4px 0'
        }}>
          Cargando documentos...
        </div>
      );
    }

    if (documentos.length === 0) {
      console.log('[TestingCardNode] Mostrando estado vacío');
      return (
        <div className="documentos-empty" style={{ 
          fontSize: '12px', 
          color: 'var(--theme-text-secondary)',
          fontStyle: 'italic',
          padding: '4px 0'
        }}>
          No hay documentos registrados
        </div>
      );
    }

    console.log('[TestingCardNode] Renderizando lista de documentos');
    console.log('[TestingCardNode] Primeros documentos:', documentos.slice(0, 2));

    return (
      <div className="documentos-list">
        {documentos.map((documento, index) => {
          console.log(`[TestingCardNode] Renderizando documento ${index + 1}:`, {
            id: documento.id,
            nombre: documento.document_name,
            tipo: documento.document_type,
            url: documento.document_url
          });
          
          const IconComponent = getDocumentIconComponent(documento.document_type);
          console.log(`[TestingCardNode] Icono calculado para ${documento.document_name}:`, IconComponent.name);
          
          return (
            <div key={documento.id} className="documento-item" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '4px 0',
              fontSize: '12px',
              border: '1px solid red' // ← TEMPORAL para debugging visual
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, minWidth: 0 }}>
                <IconComponent size={12} style={{ color: 'var(--theme-text-secondary)' }} />
                <span 
                  className="documento-name"
                  style={{ 
                    color: 'var(--theme-text-primary)',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDocument(documento);
                  }}
                  title={documento.document_name}
                >
                  {truncateDocumentName(documento.document_name)}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDocument(documento);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '2px',
                    color: 'var(--theme-text-secondary)',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="Ver documento"
                >
                  <Eye size={12} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadDocument(documento);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '2px',
                    color: 'var(--theme-text-secondary)',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="Descargar documento"
                >
                  <Download size={12} />
                </button>
              </div>
            </div>
          );
        })}
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

          {/* Nueva sección de documentos */}
          <div className="documentos-section" style={{
            backgroundColor: 'yellow',
            border: '2px solid red',
            minHeight: '50px',
            display: 'block',
            visibility: 'visible'
          }}>
            <div className="documentos-label" style={{
              backgroundColor: 'lightblue',
              border: '1px solid blue'
            }}>
              <FileText size={12} style={{ marginRight: '4px' }} />
              Documentos ({documentos.length})
            </div>
            {(() => {
              console.log('[TestingCardNode] A punto de renderizar documentos en el DOM');
              return renderDocumentos();
            })()}
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
