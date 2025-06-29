import { Secuencia } from '../types/secuencia';

export const secuenciasMock: Secuencia[] = [
  {
    id: '1',
    nombre: 'Secuencia 1',
    descripcion: 'Flujo principal de desarrollo del sistema de inventario',
    proyectoId: '1',
    fechaCreacion: '2024-01-15',
    estado: 'activa'
  },
  {
    id: '2',
    nombre: 'Secuencia 2',
    descripcion: 'Flujo de validación y testing del sistema',
    proyectoId: '1',
    fechaCreacion: '2024-01-20',
    estado: 'activa'
  },
  {
    id: '3',
    nombre: 'Secuencia 3',
    descripcion: 'Flujo de integración con APIs externas',
    proyectoId: '1',
    fechaCreacion: '2024-01-25',
    estado: 'pausada'
  },
  {
    id: '4',
    nombre: 'Secuencia 1',
    descripcion: 'Flujo de diseño de cursos interactivos',
    proyectoId: '2',
    fechaCreacion: '2024-02-01',
    estado: 'activa'
  },
  {
    id: '5',
    nombre: 'Secuencia 2',
    descripcion: 'Flujo de evaluaciones y seguimiento',
    proyectoId: '2',
    fechaCreacion: '2024-02-05',
    estado: 'activa'
  },
  {
    id: '6',
    nombre: 'Secuencia 1',
    descripcion: 'Flujo de pedidos y pagos',
    proyectoId: '3',
    fechaCreacion: '2023-11-20',
    estado: 'completada'
  },
  {
    id: '7',
    nombre: 'Secuencia 1',
    descripcion: 'Flujo de visualización de métricas',
    proyectoId: '4',
    fechaCreacion: '2024-03-01',
    estado: 'activa'
  }
];