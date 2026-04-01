import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const getProfile = () => api.get('/auth/profile');
export const upgradeToPremium = () => api.post('/auth/upgrade-premium');

// Chat APIs
export const getUsers = () => api.get('/users');
export const getChats = () => api.get('/chats');
export const createChat = (participantId) => api.post('/chats', { participantId });
export const getMessages = (chatId, limit = 50, skip = 0) => 
  api.get(`/chats/${chatId}/messages`, { params: { limit, skip } });

// Idea APIs
export const getIdeas = () => api.get('/ideas');
export const getIdeaOfTheDay = () => api.get('/ideas/today');
export const getIdeaDetails = (ideaId) => api.get(`/ideas/${ideaId}`);

export default api;
