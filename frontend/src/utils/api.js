// src/utils/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: (process.env.NODE_ENV === 'production' ? import.meta.env.VITE_API_BASE_URL : 'http://localhost:5000/api'),
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
