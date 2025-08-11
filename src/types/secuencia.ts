export interface Secuencia {
  id: string;
  nombre: string;
  descripcion: string;
  proyectoId: string;
  fechaCreacion: string;
  estado: 'EN PLANEACION'| 'EN VALIDACION'| 'EN ANALISIS' |'CANCELADO' | 'TERMINADO',
  dia_inicio?: string;
  dia_fin?: string;
}

export interface CreateSecuenciaData {
  nombre: string;
  descripcion: string;
  id_proyecto: number;
}