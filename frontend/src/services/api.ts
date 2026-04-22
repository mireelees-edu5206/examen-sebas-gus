import axios, { AxiosInstance, AxiosError } from 'axios';

// URL base de la API - usa el proxy de Vite en desarrollo
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Instancia de Axios configurada para la API
 */
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error('Error en la API:', error.message);
    return Promise.reject(error);
  }
);

export default api;
