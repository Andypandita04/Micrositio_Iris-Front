import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Calendar, 
  FileText, 
  Tag, 
  ClipboardList, 
  ChevronDown,
  Link as LinkIcon,
  Upload,
  Plus,
  Trash2
} from 'lucide-react';
import { Node } from 'reactflow';
import { TestingCardData } from './types';
import DocumentationModal from './components/DocumentationModal';
import EmpleadoSelector from '../../pages/Proyectos/components/EmpleadoSelector';
import { Empleado, obtenerEmpleados } from '../../services/empleadosService';
import { obtenerTestingCardPorId, actualizarTestingCard } from '../../services/testingCardService';
import './styles/TestingCardEditModal.css';

/**
 * Props para el componente TestingCardEditModal
 * @interface TestingCardEditModalProps
 */
interface TestingCardEditModalProps {
  /** Nodo de Testing Card a editar */
  node: Node<TestingCardData>;
  /** Función callback para guardar los cambios */
  onSave: (data: TestingCardData) => void;
  /** Función callback para cerrar el modal */
  onClose: () => void;
}

/**
 * Modal para editar Testing Cards con sistema de documentación completo
 * 
 * @component TestingCardEditModal
 * @description Componente modal que permite editar todos los aspectos de una Testing Card,
 * incluyendo información básica, métricas, criterios, colaboradores y documentación (URLs y archivos).
 * 
 * Características principales:
 * - Formulario completo con validación
 * - Sistema de colaboradores con búsqueda typeahead
 * - Sistema de documentación con URLs y archivos
 * - Secciones colapsables para mejor organización
 * - Drag & Drop para archivos
 * - Límite de 10MB por archivo
 * - Preview de archivos adjuntos
 * - Responsive design
 * 
 * @param {TestingCardEditModalProps} props - Props del componente
 * @returns {JSX.Element} Modal de edición de Testing Card
 */
const TestingCardEditModal: React.FC<TestingCardEditModalProps> = ({ node, onSave, onClose }) => {
  // @state: Datos del formulario
  const [formData, setFormData] = useState<TestingCardData>({
    ...node.data,
    titulo: node.data.titulo || '',
    hipotesis: node.data.hipotesis || '',
    descripcion: node.data.descripcion || '',
    dia_inicio: node.data.dia_inicio || '',
    dia_fin: node.data.dia_fin || '',
    id_responsable: typeof node.data.id_responsable === 'number' ? node.data.id_responsable : 0,
    id_experimento_tipo: node.data.id_experimento_tipo || 1,
    status: node.data.status || 'En validación',
    metricas: node.data.metricas || [],
    documentationUrls: node.data.documentationUrls || [],
    attachments: node.data.attachments || [],
    collaborators: node.data.collaborators || [],
  });
  // @state: Loading y feedback
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  // @state: Control de secciones expandibles
  const [showMetrics, setShowMetrics] = useState(false);
  const [showDocumentation, setShowDocumentation] = useState(false);
  
  // @state: Control del modal de documentación
  const [isDocumentationModalOpen, setIsDocumentationModalOpen] = useState(false);
  
  // @state: Lista de empleados para el selector de líder
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  // @state: Loading para empleados
  const [loadingEmpleados, setLoadingEmpleados] = useState(false);
  // @state: Error al cargar empleados
  const [empleadosError, setEmpleadosError] = useState<string | null>(null);

  // @state: Errores de validación
  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   * Efecto para manejar el cierre del modal con tecla ESC
   * @function useEffect
   */
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  /**
   * Efecto para cargar empleados al montar el componente
   * @function useEffect
   */
  useEffect(() => {
    cargarEmpleados();
  }, []);

  /**
   * Efecto para cargar datos reales de la BD al abrir el modal
   * @function useEffect
   */
  useEffect(() => {
    if (node.data.id_testing_card) {
      setLoading(true);
      obtenerTestingCardPorId(node.data.id_testing_card)
        .then((data) => {
          setFormData({ ...formData, ...data });
        })
        .catch(() => setErrorMsg('Error al cargar datos de la BD'))
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line
  }, [node.data.id_testing_card]);

  /**
   * Valida todos los campos del formulario
   * @function validateForm
   * @returns {boolean} true si el formulario es válido
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.titulo.trim()) newErrors.titulo = 'El título es requerido';
    if (!formData.hipotesis.trim()) newErrors.hipotesis = 'La hipótesis es requerida';
    if (!formData.descripcion.trim()) newErrors.descripcion = 'La descripción es requerida';
    if (!formData.dia_inicio) newErrors.dia_inicio = 'La fecha de inicio es requerida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Maneja el envío del formulario
   * @function handleSubmit
   * @param {React.FormEvent} e - Evento del formulario
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      setErrorMsg('');
      setSuccessMsg('');
      try {
        await actualizarTestingCard(formData.id_testing_card, formData);
        setSuccessMsg('¡Guardado exitosamente!');
        onSave(formData); // Notifica al padre
      } catch (err) {
        setErrorMsg('Error al guardar en la base de datos');
      } finally {
        setLoading(false);
      }
    }
  };

  // Actualiza una métrica específica
  const handleMetricChange = (index: number, field: string, value: string | number) => {
    const updatedMetricas = [...(formData.metricas || [])];
    updatedMetricas[index] = { ...updatedMetricas[index], [field]: value };
    setFormData({ ...formData, metricas: updatedMetricas });
  };

  // Añade una nueva métrica vacía
  const addMetric = () => {
    setFormData({
      ...formData,
      metricas: [...(formData.metricas || []), { id_metrica: 0, id_testing_card: formData.id_testing_card, nombre: '', operador: '', criterio: '' }]
    });
  };

  // Elimina una métrica por índice
  const removeMetric = (index: number) => {
    const updatedMetricas = (formData.metricas || []).filter((_, i) => i !== index);
    setFormData({ ...formData, metricas: updatedMetricas });
  };

  /**
   * Añade una nueva URL de documentación
   * @function addDocumentationUrl
   * @param {string} url - URL a añadir
   */
  const addDocumentationUrl = (url: string) => {
    if (!formData.documentationUrls) {
      setFormData({ ...formData, documentationUrls: [url] });
    } else {
      setFormData({ 
        ...formData, 
        documentationUrls: [...formData.documentationUrls, url] 
      });
    }
  };

  /**
   * Elimina una URL de documentación
   * @function removeDocumentationUrl
   * @param {number} index - Índice de la URL a eliminar
   */
  const removeDocumentationUrl = (index: number) => {
    if (formData.documentationUrls) {
      const updatedUrls = formData.documentationUrls.filter((_, i) => i !== index);
      setFormData({ ...formData, documentationUrls: updatedUrls });
    }
  };

  /**
   * Añade archivos de documentación
   * @function addDocumentationFiles
   * @param {File[]} files - Archivos a añadir
   */
  const addDocumentationFiles = (files: File[]) => {
    const newAttachments = files.map(file => ({
      fileName: file.name,
      fileUrl: URL.createObjectURL(file),
      fileSize: file.size
    }));
    setFormData({
      ...formData,
      attachments: [...(formData.attachments || []), ...newAttachments]
    });
  };

  /**
   * Carga la lista de empleados
   * @function cargarEmpleados
   */
  const cargarEmpleados = async () => {
    setLoadingEmpleados(true);
    setEmpleadosError(null);
    try {
      const data = await obtenerEmpleados();
      setEmpleados(data);
    } catch (error: any) {
      setEmpleadosError('Error al cargar empleados');
    } finally {
      setLoadingEmpleados(false);
    }
  };

  /**
   * Obtiene el nombre completo de un empleado
   * @function getNombreCompleto
   * @param {Empleado} empleado - Objeto empleado
   * @returns {string} Nombre completo del empleado
   */
  const getNombreCompleto = (empleado: Empleado) => {
    return `${empleado.nombre_pila} ${empleado.apellido_paterno}${empleado.apellido_materno ? ' ' + empleado.apellido_materno : ''}`;
  };

  /**
   * Obtiene las iniciales de un empleado
   * @function getIniciales
   * @param {Empleado} empleado - Objeto empleado
   * @returns {string} Iniciales del empleado
   */
  const getIniciales = (empleado: Empleado) => {
    const nombres = [empleado.nombre_pila, empleado.apellido_paterno, empleado.apellido_materno].filter(Boolean);
    return nombres.map(n => (n ? n[0] : '')).join('').toUpperCase();
  };

  const avatarColors = [
    '#6C63FF', '#FF6584', '#43E6FC', '#FFD166', '#06D6A0', '#FFB5E8', '#B5FFFC', '#B5FFD6', '#B5B5FF', '#FFB5B5'
  ];
  /**
   * Obtiene el color del avatar según el índice
   * @function getAvatarColor
   * @param {number} index - Índice del empleado
   * @returns {string} Color del avatar
   */
  const getAvatarColor = (index: number) => avatarColors[index % avatarColors.length];

  return (
    <div className="testing-modal-backdrop">
      <div className="testing-modal-container">
        {/* @section: Header del modal */}
        <div className="testing-modal-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="testing-modal-icon">
              <ClipboardList size={20} />
            </div>
            <h2 className="testing-modal-title">Editar Testing Card</h2>
          </div>
          <button onClick={onClose} className="testing-modal-close-btn">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="testing-modal-form">
          {loading && <div className="testing-form-loading">Cargando...</div>}
          {successMsg && <div className="testing-form-success">{successMsg}</div>}
          {errorMsg && <div className="testing-form-error">{errorMsg}</div>}
          {/* @section: Estado de la Testing Card */}
          <div className="testing-form-group">
            <label htmlFor="status" className="testing-form-label">
              Estado de la Testing Card
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
              className="testing-status-badge"
              style={{
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                padding: '2px 10px',
                minWidth: 80,
                textAlign: 'center',
                textTransform: 'capitalize',
                letterSpacing: 0.5,
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
              }}
            >
              <option value="En desarrollo">En desarrollo</option>
              <option value="En validación">En validación</option>
              <option value="En ejecución">En ejecución</option>
              <option value="Cancelado">Cancelado</option>
              <option value="Terminado">Terminado</option>
            </select>
          </div>
          {/* @section: Información básica */}
          <div className="testing-form-group">
            <label htmlFor="titulo" className="testing-form-label">
              <Tag className="testing-form-icon" />
              Título del Experimento
            </label>
            <input
              type="text"
              id="titulo"
              value={formData.titulo}
              onChange={(e) => setFormData({...formData, titulo: e.target.value})}
              className={`testing-input ${errors.titulo ? 'input-error' : ''}`}
              placeholder="¿Qué quieres probar?"
            />
            {errors.titulo && <span className="testing-error-text">{errors.titulo}</span>}
          </div>

          <div className="testing-form-group">
            <label htmlFor="hipotesis" className="testing-form-label">
              <FileText className="testing-form-icon" />
              Hipótesis
            </label>
            <textarea
              id="hipotesis"
              value={formData.hipotesis}
              onChange={(e) => setFormData({...formData, hipotesis: e.target.value})}
              className={`testing-input textarea ${errors.hipotesis ? 'input-error' : ''}`}
              placeholder="Creemos que..."
              rows={2}
            />
            {errors.hipotesis && <span className="testing-error-text">{errors.hipotesis}</span>}
          </div>

          {/* @section: Configuración del experimento */}
          <div className="testing-form-row">
            <div className="testing-form-group">
              <label htmlFor="id_experimento_tipo" className="testing-form-label">
                Tipo de Experimento
              </label>
              <select
                id="id_experimento_tipo"
                value={formData.id_experimento_tipo}
                onChange={(e) => setFormData({...formData, id_experimento_tipo: Number(e.target.value)})}
                className="testing-input"
              >
                <option value={1}>Entrevista</option>
                <option value={2}>Prototipo</option>
                <option value={3}>Encuesta</option>
                <option value={4}>A/B Test</option>
              </select>
            </div>
          </div>

          <div className="testing-form-group">
            <label htmlFor="descripcion" className="testing-form-label">
              <FileText className="testing-form-icon" />
              Descripción
            </label>
            <textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
              className={`testing-input textarea ${errors.descripcion ? 'input-error' : ''}`}
              placeholder="Describe cómo realizarás el experimento"
              rows={3}
            />
            {errors.descripcion && <span className="testing-error-text">{errors.descripcion}</span>}
          </div>

          {/* @section: Documentación expandible */}
          <div className="testing-form-section">
            <button 
              type="button" 
              className="testing-form-section-toggle"
              onClick={() => setShowDocumentation(!showDocumentation)}
            >
              <ChevronDown className={`toggle-icon ${showDocumentation ? 'open' : ''}`} />
              <span>Documentación</span>
            </button>
            
            {showDocumentation && (
              <div className="testing-form-section-content">
                {/* @subsection: URLs de documentación */}
                <div className="documentation-subsection">
                  <h4 className="subsection-title">
                    <LinkIcon size={14} />
                    URLs de Referencia
                  </h4>
                  
                  {formData.documentationUrls && formData.documentationUrls.length > 0 && (
                    <div className="urls-list">
                      {formData.documentationUrls.map((url, index) => (
                        <div key={index} className="url-item">
                          <a href={url} target="_blank" rel="noopener noreferrer" className="url-link">
                            {url}
                          </a>
                          <button 
                            type="button" 
                            className="testing-remove-btn"
                            onClick={() => removeDocumentationUrl(index)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <button
                    type="button"
                    className="testing-add-btn"
                    onClick={() => setIsDocumentationModalOpen(true)}
                  >
                    <Plus size={14} />
                    Añadir URL
                  </button>
                </div>

                {/* @subsection: Archivos adjuntos */}
                <div className="documentation-subsection">
                  <h4 className="subsection-title">
                    <Upload size={14} />
                    Archivos Adjuntos
                  </h4>
                  
                  {formData.attachments && formData.attachments.length > 0 && (
                    <div className="attachments-list">
                      {formData.attachments.map((file, index) => (
                        <div key={index} className="attachment-item">
                          <span className="file-name">{file.fileName}</span>
                          <span className="file-size">
                            {file.fileSize ? `(${(file.fileSize / 1024 / 1024).toFixed(2)} MB)` : ''}
                          </span>
                          <button 
                            type="button" 
                            className="testing-remove-btn"
                            onClick={() => {
                              const updatedAttachments = (formData.attachments || []).filter((_, i) => i !== index);
                              setFormData({ ...formData, attachments: updatedAttachments });
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <button
                    type="button"
                    className="testing-add-btn"
                    onClick={() => setIsDocumentationModalOpen(true)}
                  >
                    <Upload size={14} />
                    Cargar Archivos
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* @section: Métricas expandibles */}
          <div className="testing-form-section">
            <button 
              type="button" 
              className="testing-form-section-toggle"
              onClick={() => setShowMetrics(!showMetrics)}
            >
              <ChevronDown className={`toggle-icon ${showMetrics ? 'open' : ''}`} />
              <span>Métricas a Medir</span>
            </button>
            
            {showMetrics && (
              <div className="testing-form-section-content">
                {formData.metricas && formData.metricas.map((metric, index) => (
                  <div key={index} className="testing-metric-row">
                    <input
                      type="text"
                      value={metric.nombre}
                      onChange={(e) => handleMetricChange(index, 'nombre', e.target.value)}
                      className="testing-input small"
                      placeholder="Nombre métrica"
                    />
                    <input
                      type="text"
                      value={metric.operador}
                      onChange={(e) => handleMetricChange(index, 'operador', e.target.value)}
                      className="testing-input small"
                      placeholder="Operador"
                    />
                    <input
                      type="text"
                      value={metric.criterio}
                      onChange={(e) => handleMetricChange(index, 'criterio', e.target.value)}
                      className="testing-input small"
                      placeholder="Criterio"
                    />
                    <button 
                      type="button" 
                      className="testing-remove-btn"
                      onClick={() => removeMetric(index)}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <button 
                  type="button" 
                  className="testing-add-btn"
                  onClick={addMetric}
                >
                  <Plus size={14} />
                  Añadir Métrica
                </button>
              </div>
            )}
          </div>

          {/* @section: Fechas y responsable */}
          <div className="testing-form-row">
            <div className="testing-form-group">
              <label htmlFor="dia_inicio" className="testing-form-label">
                <Calendar className="testing-form-icon" />
                Fecha Inicio
              </label>
              <input
                type="date"
                id="dia_inicio"
                value={formData.dia_inicio}
                onChange={(e) => setFormData({...formData, dia_inicio: e.target.value})}
                className={`testing-input ${errors.dia_inicio ? 'input-error' : ''}`}
              />
              {errors.dia_inicio && <span className="testing-error-text">{errors.dia_inicio}</span>}
            </div>

            <div className="testing-form-group">
              <label htmlFor="dia_fin" className="testing-form-label">
                <Calendar className="testing-form-icon" />
                Fecha Fin
              </label>
              <input
                type="date"
                id="dia_fin"
                value={formData.dia_fin}
                onChange={(e) => setFormData({...formData, dia_fin: e.target.value})}
                className="testing-input"
                min={formData.dia_inicio}
              />
            </div>
          </div>

          <div className="testing-form-group">
            <label htmlFor="id_responsable" className="testing-form-label">
              Responsable
              {empleados.length > 0 && formData.id_responsable ? (
                (() => {
                  const emp = empleados.find(e => e.id_empleado === formData.id_responsable);
                  return emp ? (
                    <span style={{ marginLeft: 8, fontWeight: 500, color: '#6C63FF' }}>
                      (Seleccionado: {getNombreCompleto(emp)})
                    </span>
                  ) : null;
                })()
              ) : null}
            </label>
            {/* Selector de líder (empleado) */}
            <EmpleadoSelector
              empleados={empleados}
              loading={loadingEmpleados}
              loadingEmpleados={loadingEmpleados}
              errors={{...errors, empleados: empleadosError || ''}}
              selectedId={formData.id_responsable}
              onSelect={(id: number) => setFormData({ ...formData, id_responsable: id })}
              cargarEmpleados={cargarEmpleados}
              getNombreCompleto={getNombreCompleto}
              getIniciales={getIniciales}
              getAvatarColor={getAvatarColor}
            />
          </div>

          {/* @section: Botones de acción */}
          <div className="testing-form-actions">
            <button type="button" onClick={onClose} className="testing-btn testing-btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="testing-btn testing-btn-primary">
              <Save className="testing-btn-icon" />
              Guardar Cambios
            </button>
          </div>
        </form>

        {/* @component: Modal de documentación */}
        {isDocumentationModalOpen && (
          <DocumentationModal
            isOpen={isDocumentationModalOpen}
            onClose={() => setIsDocumentationModalOpen(false)}
            onAddUrl={addDocumentationUrl}
            onAddFiles={addDocumentationFiles}
          />
        )}
      </div>
    </div>
  );
};

export default TestingCardEditModal;