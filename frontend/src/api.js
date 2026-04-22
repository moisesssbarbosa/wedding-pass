import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001'
});

// Aqui está a mágica: O Interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    // Adiciona o token em TODAS as requisições automaticamente
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export default api;