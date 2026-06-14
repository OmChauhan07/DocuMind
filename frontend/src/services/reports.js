import api from './api';

export const reportsService = {
  async generateReport(projectId, reportName, templateType = 'project') {
    const response = await api.post('/reports', {
      project_id: projectId,
      report_name: reportName,
      template_type: templateType,
    });
    return response.data;
  },

  async getReports(projectId = null) {
    const params = projectId ? { project_id: projectId } : {};
    const response = await api.get('/reports', { params });
    return response.data;
  },

  async getReport(id) {
    const response = await api.get(`/reports/${id}`);
    return response.data;
  },

  async deleteReport(id) {
    await api.delete(`/reports/${id}`);
  },

  async downloadReport(id, format, reportName) {
    const token = localStorage.getItem('documind_token');
    const response = await fetch(`/api/v1/reports/${id}/download/${format}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Download failed');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportName || 'report'}.${format}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },
};
