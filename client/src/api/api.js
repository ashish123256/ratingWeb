// src/api/api.js
import axios from 'axios';
import { BASE_URL } from '../baseUrl';



const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to inject token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-access-token'] = token;
  }
  return config;
});

// Auth API
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  signin: (data) => api.post('/auth/signin', data),
  changePassword: (data) => api.post('/auth/change-password', data)
};

// Store API
export const storeAPI = {
  getAll: () => api.get('/stores'),
  getById: (id) => api.get(`/stores/${id}`),
  create: (data) => api.post('/stores', data),
  update: (id, data) => api.put(`/stores/${id}`, data),
  delete: (id) => api.delete(`/stores/${id}`)
};

// Rating API
export const ratingAPI = {
  submit: (data) => api.post('/ratings', data),
  update: (id, data) => api.put(`/ratings/${id}`, data),
  getByStore: (storeId) => api.get(`/ratings/store/${storeId}`),
  getUserRating: (storeId) => api.get(`/ratings/user/${storeId}`)
};

// User API
export const userAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  search: (query) => api.get(`/users/search?q=${query}`)
};

export default api;