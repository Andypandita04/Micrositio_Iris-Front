/**
 * Tipos de datos para el componente FlowEditor
 * @fileoverview Definiciones de tipos TypeScript para Testing Cards y Learning Cards
 */

/**
 * Tipos de experimento disponibles
 * @typedef {string} ExperimentType
 */
export type ExperimentType = 'Entrevista' | 'Prototipo' | 'Encuesta' | 'A/B Test';

/**
 * Categorías de experimento disponibles
 * @typedef {string} ExperimentCategory
 */
export type ExperimentCategory = 'Descubrimiento' | 'Validación';

/**
 * Estados posibles de un experimento
 * @typedef {string} ExperimentStatus
 */
export type ExperimentStatus = 'En desarrollo' | 'En validación' | 'En proceso' | 'En ejecución' | 'Cancelado' | 'Terminado';

/**
 * Estructura de datos para una métrica de Testing Card
 * @interface Metric
 */
export interface Metric {
  /** Nombre de la métrica */
  metric: string;
  /** Unidad de medida */
  unit: string;
  /** Valor objetivo o actual */
  value: number;
}

/**
 * Estructura de datos para criterios de éxito
 * @interface Criteria
 */
export interface Criteria {
  /** Nombre de la métrica a evaluar */
  metric: string;
  /** Operador de comparación */
  operator: '=' | '>' | '<';
  /** Valor de referencia */
  value: number;
}

/**
 * Estructura de datos para archivos adjuntos
 * @interface Attachment
 */
export interface Attachment {
  /** URL del archivo */
  fileUrl: string;
  /** Nombre del archivo */
  fileName: string;
  /** Tamaño del archivo en bytes (opcional) */
  fileSize?: number;
}

/**
 * Estructura de datos para una Testing Card
 * @interface TestingCardData
 * @description Contiene toda la información necesaria para una Testing Card,
 * incluyendo hipótesis, métricas, documentación y callbacks de acción.
 */
export interface TestingCardData {
  onStatusChange(): unknown;
  /** Identificador único del nodo */
  id: string;
  /** Tipo de nodo (siempre 'testing' para Testing Cards) */
  type: 'testing';
  /** Título descriptivo del experimento */
  title: string;
  /** Hipótesis a validar */
  hypothesis: string;
  /** Tipo de experimento a realizar */
  experimentType: ExperimentType;
  /** Descripción detallada del experimento */
  description: string;
  /** Lista de métricas a medir */
  metrics: Metric[];
  /** Criterios de éxito del experimento */
  criteria: Criteria[];
  /** Fecha de inicio del experimento */
  startDate: string;
  /** Fecha de finalización del experimento */
  endDate: string;
  /** Archivos adjuntos relacionados */
  attachments: Attachment[];
  /** URLs de documentación de referencia */
  documentationUrls?: string[];
  /** Responsable del experimento */
  responsible: number;
  /** Categoría del experimento */
  experimentCategory: ExperimentCategory;
  /** Estado actual del experimento */
  status: ExperimentStatus;
  /** IDs de colaboradores asignados */
  collaborators?: string[];
  
  // @callbacks: Funciones de acción para el nodo
  /** Callback para añadir una Testing Card conectada */
  onAddTesting: () => void;
  /** Callback para añadir una Learning Card conectada */
  onAddLearning: () => void;
  /** Callback para editar el nodo */
  onEdit: () => void;
  /** Callback para eliminar el nodo */
  onDelete: () => void;
}

/**
 * Tipo unificado para los datos de nodo
 * @typedef {TestingCardData | LearningCardData} NodeData
 * @description Union type que permite manejar ambos tipos de nodos de forma unificada
 */
export type NodeData = TestingCardData | LearningCardData;

/**
 * Datos para la creación de un nuevo nodo (legacy)
 * @interface CreateNodeData
 * @deprecated Usar TestingCardData o LearningCardData directamente
 */
export interface CreateNodeData {
  /** Nombre del nodo */
  nombre: string;
  /** Descripción del nodo */
  descripcion: string;
  /** Fecha asociada */
  fecha: string;
  /** Posición en el canvas */
  position: {
    x: number;
    y: number;
  };
}

/**
 * Datos para la actualización de un nodo existente (legacy)
 * @interface UpdateNodeData
 * @deprecated Usar TestingCardData o LearningCardData directamente
 */
export interface UpdateNodeData {
  /** ID del nodo a actualizar */
  id: string;
  /** Nuevo nombre (opcional) */
  nombre?: string;
  /** Nueva descripción (opcional) */
  descripcion?: string;
  /** Nueva fecha (opcional) */
  fecha?: string;
}

/**
 * Estados posibles del editor de flujo
 * @typedef {string} FlowEditorState
 */
export type FlowEditorState = 'idle' | 'editing' | 'creating' | 'deleting';

/**
 * Configuración del editor de flujo
 * @interface FlowEditorConfig
 * @description Configuración personalizable para el comportamiento del FlowEditor
 */
export interface FlowEditorConfig {
  /** Habilitar/deshabilitar el grid de fondo */
  showGrid: boolean;
  /** Habilitar/deshabilitar los controles */
  showControls: boolean;
  /** Habilitar/deshabilitar el mini mapa */
  showMiniMap: boolean;
  /** Zoom inicial */
  defaultZoom: number;
  /** Posición inicial del viewport */
  defaultViewport: {
    x: number;
    y: number;
    zoom: number;
  };
}

/**
 * Configuración de posicionamiento automático
 * @interface PositioningConfig
 * @description Configuración para el algoritmo de posicionamiento automático de nodos
 */
export interface PositioningConfig {
  /** Distancia horizontal entre Testing Cards */
  horizontalOffset: number;
  /** Distancia vertical para Learning Cards */
  verticalOffset: number;
  /** Padding para evitar colisiones */
  collisionPadding: number;
  /** Número máximo de intentos para resolver colisiones */
  maxCollisionAttempts: number;
}

/**
 * Información de nivel de nodo para z-index dinámico
 * @interface NodeLevelInfo
 */
export interface NodeLevelInfo {
  /** ID del nodo */
  nodeId: string;
  /** Nivel de profundidad en el árbol */
  level: number;
  /** Z-index calculado */
  zIndex: number;
  /** IDs de nodos padre */
  parentIds: string[];
  /** IDs de nodos hijo */
  childIds: string[];
}

/**
 * Estructura de datos para una Learning Card
 * @interface LearningCardData
 * @description Contiene los resultados y hallazgos obtenidos de un experimento,
 * conectada a una Testing Card específica.
 */
export interface LearningCardData {
  /** Identificador único del nodo */
  id: string | null;
  /** ID de la secuencia */
  id_secuencia?: string | null;
  /** ID de la Testing Card asociada */
  id_testing_card?: string | null;
  /** Resultados obtenidos del experimento */
  resultado: string | null;
  /** Hallazgo accionable derivado de los resultados */
  hallazgo: string | null;
  /** Estado de la Learning Card */
  estado: 'CUMPLIDO' | 'RECHAZADO' | 'REPETIR';
  /** Fecha de creación */
  created_at: Date;
  /** Fecha de actualización */
  updated_at: Date;
  /** Enlaces relacionados con los resultados */
  //links?: string[];
  /** Archivos adjuntos con evidencia */
  attachments?: Attachment[];
  /** URLs de documentación de referencia */
  //documentationUrls?: string[];
  /** IDs de colaboradores asignados */
  //collaborators?: string[];
  // Callbacks (si los necesitas en frontend)
  onEdit?: () => void;
  onDelete?: () => void;
}