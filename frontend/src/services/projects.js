import api from './api';

export const projectsService = {
  async getProjects() {
    const response = await api.get('/projects');
    return response.data;
  },

  async createProject(data) {
    const response = await api.post('/projects', data);
    return response.data;
  },

  async getProject(id) {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },
};
