import { API_ENDPOINTS } from '../config/apiConfig';

export const checkLLM = async () => {
  try {
    const response = await fetch(API_ENDPOINTS.CHECKLLM);
    if (response.ok) {
      const data = await response.json();
      return { status: true, data: data };
    } else {
      return { status: false, error: 'Error al verificar el estado del LLM' };
    }
  } catch (error) {
    console.error('Error checkLLM:', error);
    return { status: false, error: 'Error al conectar con la API' };
  }
};