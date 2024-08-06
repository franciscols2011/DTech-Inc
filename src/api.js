import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:5000/api',
  withCredentials: true, // Asegúrate de incluir las credenciales
  headers: {
    'Content-Type': 'application/json',
  },
});

export const register = (formData) => API.post('/register', formData);
export const login = (formData) => API.post('/login', formData);
export const createPost = (formData) => API.post('/posts', formData);
export const getPosts = () => API.get('/posts');
export const likePost = (postId) => API.post('/like', { post_id: postId });
export const logout = () => API.get('/logout');
