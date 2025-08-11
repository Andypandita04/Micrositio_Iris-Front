import { Secuencia } from '../types/secuencia';

export const secuenciasMock: Secuencia[] = [
  {
    id: '1',
    nombre: 'Secuencia 1',
    descripcion: 'Flujo principal de desarrollo del sistema de inventario',
    proyectoId: '1',
    fechaCreacion: '2024-01-15',
    estado: 'EN PLANEACION',
    dia_inicio: '2024-01-20',
    dia_fin: '2024-03-15'
  },
  {
    id: '2',
    nombre: 'Secuencia 2',
    descripcion: 'Flujo de validación y testing del sistema',
    proyectoId: '1',
    fechaCreacion: '2024-01-20',
    estado: 'EN VALIDACION',
    dia_inicio: '2024-02-01',
    dia_fin: '2024-04-01'
  },
  {
    id: '3',
    nombre: 'Secuencia 3',
    descripcion: 'Flujo de integración con APIs externas',
    proyectoId: '1',
    fechaCreacion: '2024-01-25',
    estado: 'EN ANALISIS',
    dia_inicio: '2024-02-10'
  },
  {
    id: '4',
    nombre: 'Secuencia 1',
    descripcion: 'Flujo de diseño de cursos interactivos',
    proyectoId: '2',
    fechaCreacion: '2024-02-01',
    estado: 'TERMINADO',
    dia_inicio: '2024-02-15',
    dia_fin: '2024-05-15'
  },
  {
    id: '5',
    nombre: 'Secuencia 2',
    descripcion: 'Flujo de evaluaciones y seguimiento',
    proyectoId: '2',
    fechaCreacion: '2024-02-05',
    estado: 'EN VALIDACION',
    dia_inicio: '2024-02-20'
  },
  {
    id: '6',
    nombre: 'Secuencia 1',
    descripcion: 'Flujo de pedidos y pagos',
    proyectoId: '3',
    fechaCreacion: '2023-11-20',
    estado: 'TERMINADO',
    dia_inicio: '2023-12-01',
    dia_fin: '2024-01-31'
  },
  {
    id: '7',
    nombre: 'Secuencia 1',
    descripcion: 'Flujo de visualización de métricas',
    proyectoId: '4',
    fechaCreacion: '2024-03-01',
    estado: 'EN PLANEACION',
    dia_inicio: '2024-03-10',
    dia_fin: '2024-06-10'
  }
];