import apiClient from '../apiClient';

export interface Empleado {
  id_empleado: number;
  nombre_pila: string;
  apellido_paterno: string;
  apellido_materno?: string;
  celular?: string;
  correo: string;
  numero_empleado: string;
  activo: boolean;
}

export const obtenerEmpleados = async () => {
  const response = await apiClient.get('/empleados/todos');
  return response.data;
};