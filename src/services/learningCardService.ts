import apiClient from '../apiClient';

/**
 * Interfaz que representa una Learning Card.
 */
export interface LearningCard {
  id_learning_card: number;
  id_testing_card: number;
  resultado?: string | null;
  hallazgo?: string | null;
  estado: 'ACEPTADA' | 'RECHAZADA' | 'REITERADA' | 'MAL PLANTEADA';
  //created_at: string;
  //updated_at: string;
}

/**
 * Obtiene todas las Learning Cards.
 * @returns {Promise<LearningCard[]>} Lista de Learning Cards.
 */
export const obtenerTodos = async (): Promise<LearningCard[]> => {
  const response = await apiClient.get('/learning_card/');
  return response.data;
};

/**
 * Obtiene una Learning Card por su ID.
 * @param {string | number} id_learning_card - ID de la Learning Card.
 * @returns {Promise<LearningCard>} Learning Card encontrada.
 */
export const obtenerPorId = async (id_learning_card: string | number): Promise<LearningCard> => {
  const response = await apiClient.get(`/learning_card/l`, { params: { id_learning_card } });
  return response.data;
};

/**
 * Obtiene las Learning Cards asociadas a un Testing Card.
 * @param {number} id_testing_card - ID del Testing Card.
 * @returns {Promise<LearningCard[]>} Lista de Learning Cards asociadas.
 */
export const obtenerPorTestingCard = async (id_testing_card: string | number): Promise<LearningCard[]> => {
  const response = await apiClient.get(`/learning_card/t`, { params: { id_testing_card } });
  return response.data;
};

/**
 * Crea una nueva Learning Card.
 * @param {Partial<LearningCard>} data - Datos de la Learning Card.
 * @returns {Promise<LearningCard>} Learning Card creada.
 */
export const crear = async (data: Partial<LearningCard>): Promise<LearningCard> => {
  const response = await apiClient.post('/learning_card/', data);
  return response.data;
};

/**
 * Actualiza una Learning Card existente.
 * @param {string | number} id_learning_card - ID de la Learning Card a actualizar.
 * @param {Partial<LearningCard>} data - Datos a actualizar.
 * @returns {Promise<LearningCard>} Learning Card actualizada.
 */
export const actualizar = async (id_learning_card: string | number, data: Partial<LearningCard>): Promise<LearningCard> => {
  const response = await apiClient.patch('/learning_card/', { id_learning_card, ...data });
  return response.data;
};

/**
 * Elimina una Learning Card por su ID.
 * @param {string | number} id_learning_card - ID de la Learning Card a eliminar.
 * @returns {Promise<void>}
 */
export const eliminar = async (id_learning_card: string | number): Promise<void> => {
  const response = await apiClient.delete('/learning_card/', { data: { id_learning_card } });
  return response.data;
};