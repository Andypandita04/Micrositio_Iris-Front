export interface Secuencia {
  id: string;
  nombre: string;
  descripcion: string;
  proyectoId: string;
  fechaCreacion: string;
  estado: 'activa' | 'pausada' | 'completada';
}

export interface CreateSecuenciaData {
  nombre: string;
  descripcion: string;
  proyectoId: string;
}