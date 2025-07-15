import apiClient from '../apiClient';

// Obtener secuencias por proyecto (usando GET con query param)
export const obtenerSecuenciasPorProyecto = async (id_proyecto: number) => {
  const response = await apiClient.get('/secuencias/p', { 
    params: { id_proyecto } 
  });
  return response.data;
};

// Crear secuencia
export const crearSecuencia = async (data: any) => {
  const response = await apiClient.post('/secuencias', data);
  return response.data;
};

// Actualizar secuencia
export const actualizarSecuencia = async (id: number, data: any) => {
  const response = await apiClient.patch('/secuencias', { id_secuencia: id, ...data });
  return response.data;
};

// Eliminar secuencia
export const eliminarSecuencia = async (id: number) => {
  await apiClient.delete('/secuencias', { data: { id_secuencia: id } });
};