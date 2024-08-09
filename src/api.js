import axios from 'axios';

// Configuración del cliente Axios
const API = axios.create({
  baseURL: 'http://127.0.0.1:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Funciones para interactuar con la API
export const register = (formData) => API.post('/register', formData);
export const login = (formData) => API.post('/login', formData);
export const createPost = (formData) => API.post('/posts', formData);
export const getPosts = (params) => API.get('/posts', { params });
export const likePost = (postId) => API.post('/like', { post_id: postId });
export const logout = () => API.get('/logout');
export const getProfile = () => API.get('/profile');

// Manejo de errores (opcional)
API.interceptors.response.use(
  response => response,
  error => {
    console.error('API error:', error);
    return Promise.reject(error);
  }
);
