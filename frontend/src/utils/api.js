// src/utils/api.js
import axios from 'axios';
// const dotenv = require('dotenv');
// dotenv.config();

// 1) Create an Axios instance with the backend baseURL.
//    Adjust baseURL if your backend is hosted elsewhere.
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

// 2) Attach a request interceptor that automatically
//    includes the JWT (if it exists) on every request.
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
