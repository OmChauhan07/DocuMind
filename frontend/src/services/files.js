import api from './api';

export const filesService = {
  async uploadFile(projectId, file, isTemplate = false) {
    const formData = new FormData();
    formData.append('project_id', projectId);
    formData.append('is_template', isTemplate);
    formData.append('file', file);

    const response = await api.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async getFiles(projectId) {
    const response = await api.get('/files', { params: { project_id: projectId } });
    return response.data;
  },

  async deleteFile(fileId) {
    await api.delete(`/files/${fileId}`);
  },
};
