import apiClient from '../apiClient';

/**
 * Interfaz que representa una relación célula-proyecto.
 */
export interface CelulaProyecto {
  id: number;
  id_empleado: number;
  id_proyecto: number;
  activo: boolean;
}

/**
 * Obtiene todas las relaciones célula-proyecto.
 * @returns {Promise<CelulaProyecto[]>} Lista de relaciones célula-proyecto.
 */
export const obtenerTodos = async (): Promise<CelulaProyecto[]> => {
  const response = await apiClient.get('/celula-proyecto/todos');
  return response.data;
};

/**
 * Obtiene las relaciones célula-proyecto por ID de empleado.
 * @param {number} id_empleado - ID del empleado.
 * @returns {Promise<CelulaProyecto[]>} Lista de relaciones célula-proyecto asociadas al empleado.
 */
export const obtenerPorEmpleado = async (id_empleado: number): Promise<CelulaProyecto[]> => {
  const response = await apiClient.post('/celula-proyecto/por-empleado', { id_empleado });
  return response.data;
};

/**
 * Obtiene las relaciones célula-proyecto por ID de proyecto.
 * @param {number} id_proyecto - ID del proyecto.
 * @returns {Promise<CelulaProyecto[]>} Lista de relaciones célula-proyecto asociadas al proyecto.
 */
export const obtenerPorProyecto = async (id_proyecto: number): Promise<CelulaProyecto[]> => {
  const response = await apiClient.post('/celula-proyecto/por-proyecto', { id_proyecto });
  return response.data;
};

/**
 * Crea una nueva relación célula-proyecto.
 * @param {Omit<CelulaProyecto, 'id'>} data - Datos para crear la relación (sin el ID).
 * @returns {Promise<CelulaProyecto>} La relación creada con su ID asignado.
 */
export const crear = async (data: Omit<CelulaProyecto, 'id'>): Promise<CelulaProyecto> => {
  const response = await apiClient.post('/celula-proyecto/crear', data);
  return response.data;
};

/**
 * Elimina una relación célula-proyecto por su ID.
 * @param {number} id - ID de la relación a eliminar.
 * @returns {Promise<void>}
 */
export const eliminar = async (id: number): Promise<void> => {
  await apiClient.post('/celula-proyecto/eliminar', { id });
};

/**
 * Actualiza el estado activo de una relación célula-proyecto.
 * @param {number} id - ID de la relación a actualizar.
 * @param {boolean} activo - Nuevo estado activo.
 * @returns {Promise<CelulaProyecto>} La relación actualizada.
 */
export const actualizarActivo = async (id: number, activo: boolean): Promise<CelulaProyecto> => {
  const response = await apiClient.post('/celula-proyecto/actualizar-activo', { id, activo });
  return response.data;
};