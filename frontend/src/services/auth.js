import api from './api';

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    const { access_token } = response.data;
    localStorage.setItem('documind_token', access_token);
    return access_token;
  },

  async register(name, email, password) {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout() {
    localStorage.removeItem('documind_token');
    localStorage.removeItem('documind_user');
  },

  getToken() {
    return localStorage.getItem('documind_token');
  },

  isAuthenticated() {
    return !!localStorage.getItem('documind_token');
  },
};
