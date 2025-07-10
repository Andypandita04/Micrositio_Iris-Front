export interface Colaborador {
  id: string;
  nombre: string;
  email: string;
  avatar?: string;
}

export interface Proyecto {
  id: string;
  nombre: string;
  descripcion: string;
  colaboradores: Colaborador[];
  fechaInicio: string;
  fechaCreacion: string;
  estado: 'activo' | 'pausado' | 'completado' | 'cancelado';
  lider_id?: number; // Agregado para manejar el líder del proyecto
}

export interface CreateProyectoData {
  nombre: string;
  descripcion: string;
  colaboradores: string[]; // IDs de colaboradores
}