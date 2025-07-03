export interface Colaborador {
  id: string;
  nombre: string;
  email: string;
  avatar?: string;
}



export interface Proyecto {
  id_proyecto: string;
  titulo: string;
  descripcion: string;
  estado: 'activo' | 'pausado' | 'completado' | 'cancelado';
  fecha_inicio?: string; // ISO date
  fecha_fin_estimada?: string; // ISO date
  created_at?: string; // opcional si no la usas directamente
  updated_at?: string; // opcional si no la usas directamente
}


export interface CreateProyectoData {
  nombre: string;
  descripcion: string;
  colaboradores: string[]; // IDs de colaboradores
}