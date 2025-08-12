export interface Secuencia {
  id: string;
  nombre: string;
  descripcion: string;
  proyectoId: string;
  fechaCreacion: string;
  estado: 'EN PLANEACION'| 'EN VALIDACION'| 'EN ANALISIS' |'CANCELADO' | 'TERMINADO',
  dia_inicio?: string;
  dia_fin?: string;
  testing_cards_count?: number;
}

export interface CreateSecuenciaData {
  nombre: string;
  descripcion: string;
  id_proyecto: number;
  dia_inicio?: string;
  dia_fin?: string;
  estado?: 'EN PLANEACION'| 'EN VALIDACION'| 'EN ANALISIS' |'CANCELADO' | 'TERMINADO';
}