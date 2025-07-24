import apiClient from '../apiClient';
import { TestingCardPlaybook, CreateTestingCardPlaybookData } from '../types/testingCardPlaybook';

const BASE_URL = import.meta.env.VITE_API_URL || '';

class TestingCardPlaybookService {
  async listarTodos(): Promise<TestingCardPlaybook[]> {
    const response = await apiClient.get(`${BASE_URL}/testing_card_playbook`);
    return response.data;
  }

  async obtenerPorPagina(pagina: number): Promise<TestingCardPlaybook | null> {
    const response = await apiClient.get(`${BASE_URL}/testing_card_playbook/por-pagina`, {
      params: { pagina }
    });
    return response.data;
  }

  async buscarPorCampo(campo: string): Promise<TestingCardPlaybook[]> {
    const response = await apiClient.get(`${BASE_URL}/testing_card_playbook/buscar`, {
      params: { campo }
    });
    return response.data;
  }

  async buscarPorTipo(tipo: string): Promise<TestingCardPlaybook[]> {
    const response = await apiClient.get(`${BASE_URL}/testing_card_playbook/buscar-tipo`, {
      params: { tipo }
    });
    return response.data;
  }

  async crear(data: CreateTestingCardPlaybookData): Promise<TestingCardPlaybook> {
    const response = await apiClient.post('/api/testing-card-playbook', data);
    return response.data;
  }

  async actualizar(pagina: number, data: Partial<CreateTestingCardPlaybookData>): Promise<TestingCardPlaybook | null> {
    const response = await apiClient.put(`/api/testing-card-playbook/por-pagina`, data, {
      params: { pagina }
    });
    return response.data;
  }

  async eliminar(pagina: number): Promise<boolean> {
    const response = await apiClient.delete(`/api/testing-card-playbook/por-pagina`, {
      params: { pagina }
    });
    return response.data;
  }
}

export default TestingCardPlaybookService;
