/**
 * Tipos de datos para el componente FlowEditor
 */

/**
 * Tipos de experimento
 */
export type ExperimentType = 'Entrevista' | 'Prototipo' | 'Encuesta' | 'A/B Test';
export type ExperimentCategory = 'Descubrimiento' | 'Validación';
export type ExperimentStatus = 'En desarrollo' | 'En validación' | 'En ejecución' | 'Cancelado' | 'Terminado';

/**
 * Estructura de datos para una Testing Card
 */
export interface TestingCardData {
    id: string;
      type: 'testing';
        title: string;
          hypothesis: string;
            experimentType: ExperimentType;
              description: string;
                metrics: {
                    metric: string;
                        unit: string;
                            value: number;
                              }[];
}
  criteria: {
    metric: string;
    operator: '=' | '>' | '<';
    value: number;
  }[];
  startDate: string;
  endDate: string;
  attachments: {
    fileUrl: string;
    fileName: string;
  }[];
  responsible: string;
  experimentCategory: ExperimentCategory;
  status: ExperimentStatus;
  onAddTesting: () => void;
  onAddLearning: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

/**
 * Estructura de datos para una Learning Card
 */
export interface LearningCardData {
  id: string;
  type: 'learning';
  testingCardId: string;
  result: string;
  actionableInsight: string;
  links: string[];
  attachments: {
    fileUrl: string;
    fileName: string;
  }[];
  onEdit: () => void;
  onDelete: () => void;
}

/**
 * Tipo unificado para los datos de nodo
 */
export type NodeData = TestingCardData | LearningCardData;


/**
 * Datos para la creación de un nuevo nodo
 */
export interface CreateNodeData {
  nombre: string;
  descripcion: string;
  fecha: string;
  position: {
    x: number;
    y: number;
  };
}

/**
 * Datos para la actualización de un nodo existente
 */
export interface UpdateNodeData {
  id: string;
  nombre?: string;
  descripcion?: string;
  fecha?: string;
}

/**
 * Estados posibles del editor de flujo
 */
export type FlowEditorState = 'idle' | 'editing' | 'creating' | 'deleting';

/**
 * Configuración del editor de flujo
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