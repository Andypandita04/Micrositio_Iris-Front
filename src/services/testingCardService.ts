import apiClient from '../apiClient';

// Obtener todas las Testing Cards
export const obtenerTestingCards = async () => {
  const response = await apiClient.get('/testing-card/');
  return response.data;
};
