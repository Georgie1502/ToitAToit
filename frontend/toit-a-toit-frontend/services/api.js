import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // API Gateway URL  
});

// Intercepteur pour ajouter le token d'authentification à chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } 
    return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;