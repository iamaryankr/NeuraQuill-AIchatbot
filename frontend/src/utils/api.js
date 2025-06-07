// src/utils/api.js
import axios from 'axios';

//make this URL have /api as well
const baseURL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api');

const API = axios.create({
  baseURL,
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
