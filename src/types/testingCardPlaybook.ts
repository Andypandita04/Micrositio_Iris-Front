export interface TestingCardPlaybook {
  pagina: number;
  titulo: string;
  campo: string;
  tipo: string;
  descripcion?: string;
  costo?: number;
  tiempo_preparacion?: number;
  tiempo_ejecucion?: number;
  fuerza_evidencia?: number;
  tipo_riesgo?: string;
  deseabilidad?: boolean;
  factibilidad?: boolean;
  viabilidad?: boolean;
  adaptabilidad?: boolean;
  equipo?: string;
  habilidades?: string;
  herramientas?: any; // JSONB, puede ser objeto o array
  metricas?: any; // JSONB, puede ser objeto o array
  created_at?: string;
  updated_at?: string;
}

export interface CreateTestingCardPlaybookData {
  titulo: string;
  campo: string;
  tipo: string;
  descripcion?: string;
  costo?: number;
  tiempo_preparacion?: number;
  tiempo_ejecucion?: number;
  fuerza_evidencia?: number;
  tipo_riesgo?: string;
  deseabilidad?: boolean;
  factibilidad?: boolean;
  viabilidad?: boolean;
  adaptabilidad?: boolean;
  equipo?: string;
  habilidades?: string;
  herramientas?: any;
  metricas?: any;
}
