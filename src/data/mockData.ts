import { Proyecto, Colaborador } from '../types/proyecto';

export const colaboradoresDisponibles: Colaborador[] = [
  {
    id: '1',
    nombre: 'Ana García',
    email: 'ana.garcia@empresa.com',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '2',
    nombre: 'Carlos Rodríguez',
    email: 'carlos.rodriguez@empresa.com',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '3',
    nombre: 'María López',
    email: 'maria.lopez@empresa.com',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '4',
    nombre: 'David Martínez',
    email: 'david.martinez@empresa.com',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '5',
    nombre: 'Laura Sánchez',
    email: 'laura.sanchez@empresa.com',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  }
];

export const proyectosMock: Proyecto[] = [
  {
    id: '1',
    nombre: 'Sistema de Gestión de Inventario',
    descripcion: 'Desarrollo de una aplicación web para gestionar el inventario de productos con funcionalidades de seguimiento en tiempo real.',
    colaboradores: [colaboradoresDisponibles[0], colaboradoresDisponibles[1]],
    fechaInicio: '2024-01-15',
    fechaCreacion: '2024-01-10',
    estado: 'activo'
  },
  {
    id: '2',
    nombre: 'Plataforma de E-learning',
    descripcion: 'Creación de una plataforma educativa online con cursos interactivos, evaluaciones y seguimiento del progreso estudiantil.',
    colaboradores: [colaboradoresDisponibles[2], colaboradoresDisponibles[3], colaboradoresDisponibles[4]],
    fechaInicio: '2024-02-01',
    fechaCreacion: '2024-01-25',
    estado: 'activo'
  },
  {
    id: '3',
    nombre: 'App Móvil de Delivery',
    descripcion: 'Aplicación móvil para pedidos de comida con geolocalización, pagos integrados y seguimiento de entregas.',
    colaboradores: [colaboradoresDisponibles[1], colaboradoresDisponibles[4]],
    fechaInicio: '2023-11-20',
    fechaCreacion: '2023-11-15',
    estado: 'completado'
  },
  {
    id: '4',
    nombre: 'Dashboard Analítico',
    descripcion: 'Panel de control con visualizaciones de datos y métricas empresariales en tiempo real.',
    colaboradores: [colaboradoresDisponibles[0], colaboradoresDisponibles[2]],
    fechaInicio: '2024-03-01',
    fechaCreacion: '2024-02-20',
    estado: 'pausado'
  }
];