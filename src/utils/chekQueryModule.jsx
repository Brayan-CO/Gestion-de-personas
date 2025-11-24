import { API_ENDPOINTS } from '../config/apiConfig';

export const checkQueryModule = async () => {
  try {
    const response = await fetch(API_ENDPOINTS.CHECK_QUERY);
    if (response.ok) {
      const data = await response.json();
      return { status: true, data: data };
    } else {
      return { status: false, error: 'Módulo de consulta no disponible' };
    }
  } catch (error) {
    console.error('Error checkQueryModule:', error);
    return { status: false, error: 'Error al conectar con la API' };
  }
};