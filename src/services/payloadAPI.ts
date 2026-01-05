import axios from 'axios';

// Payload CMS API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || '';
const API_FULL_URL = `${API_BASE_URL}/api`;

const api = axios.create({
  baseURL: API_FULL_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 3000, // 3 segundos de timeout
});

// Add authentication header if token is available
if (process.env.NEXT_PUBLIC_PAYLOAD_TOKEN) {
  api.defaults.headers.common['Authorization'] = `Bearer ${process.env.NEXT_PUBLIC_PAYLOAD_TOKEN}`;
}

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = process.env.NEXT_PUBLIC_PAYLOAD_TOKEN;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si es un error de timeout o conexión, lo manejamos silenciosamente
    if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
      console.log('Payload CMS API no disponible, usando Mock Data');
      return Promise.reject(new Error('API_NOT_AVAILABLE'));
    }
    
    // Para otros errores, también los rechazamos pero con mensaje claro
    console.error('Payload CMS API Error:', error);
    return Promise.reject(error);
  }
);

export default api;
