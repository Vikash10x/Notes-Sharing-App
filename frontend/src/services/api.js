import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('notesUser'));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Auth
export const signup = (data) => api.post('/auth/signup', data);
export const login = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');

// Notes
export const getNotes = (params) => api.get('/notes', { params });
export const getMyNotes = () => api.get('/notes/my');
export const createNote = (formData) =>
  api.post('/notes', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteNote = (id) => api.delete(`/notes/${id}`);
export const likeNote = (id) => api.post(`/notes/${id}/like`);
export const commentNote = (id, text) => api.post(`/notes/${id}/comment`, { text });

// Categories
export const getCategories = () => api.get('/categories');

export default api;
