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
  fecha_inicio?: string;
  fecha_fin_estimada?: string;
  estado?: 'ACTIVO' | 'INACTIVO' | 'COMPLETADO'; //'pausado' | 'completado' | 'cancelado';
  lider_id?: number; // Agregado para manejar el líder del proyecto
}

export interface CreateProyectoData {
  nombre: string;
  descripcion: string;
  colaboradores: string[]; // IDs de colaboradores
}