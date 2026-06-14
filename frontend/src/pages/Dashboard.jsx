import React, { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import { Link } from 'react-router-dom';
import { reportsService } from '../services/reports';

export default function Dashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const data = await reportsService.getReports();
      setReports(data);
    } catch (err) {
      setError('Failed to load reports.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;
    try {
      await reportsService.deleteReport(reportId);
      setReports((prev) => prev.filter((r) => r.id !== reportId));
    } catch (err) {
      setError('Failed to delete report.');
    }
  };

  const handleDownload = async (reportId, reportName, format) => {
    try {
      await reportsService.downloadReport(reportId, format, reportName);
    } catch (err) {
      setError(`Failed to download ${format.toUpperCase()}`);
    }
  };

  const totalReports = reports.length;
  const completedReports = reports.filter((r) => r.status === 'completed').length;
  const draftsOrPending = reports.filter((r) => r.status === 'pending' || r.status === 'processing').length;

  // Reports created this week
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const thisWeekReports = reports.filter((r) => new Date(r.created_at) >= oneWeekAgo).length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 bg-[#e0f2fe] text-[#0369a1] font-label-sm text-label-sm rounded-full">Completed</span>;
      case 'processing':
        return <span className="px-2 py-1 bg-[#fef3c7] text-[#92400e] font-label-sm text-label-sm rounded-full">Processing</span>;
      case 'failed':
        return <span className="px-2 py-1 bg-error-container text-on-error-container font-label-sm text-label-sm rounded-full">Failed</span>;
      default:
        return <span className="px-2 py-1 bg-surface-variant text-on-surface-variant font-label-sm text-label-sm rounded-full">Pending</span>;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'task_alt';
      case 'processing': return 'hourglass_top';
      case 'failed': return 'error_outline';
      default: return 'schedule';
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', day: 'numeric', year: 'numeric' 
    });
  };

  return (
    <MainLayout>
      <main className="flex-1 overflow-y-auto p-margin-mobile md:p-xl lg:p-huge">
        <div className="max-w-container-max mx-auto">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-xl">
            <div>
              <h2 className="text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface">Recent Reports</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Overview of your AI-generated documents.</p>
            </div>
            <Link to="/upload" className="bg-primary-container text-on-primary font-label-md text-label-md h-12 px-lg rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 whitespace-nowrap md:hidden shadow-sm">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
              New Report
            </Link>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-lg p-3 rounded-lg bg-error-container text-on-error-container text-body-sm font-body-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {error}
              <button onClick={() => setError('')} className="ml-auto">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          )}

          {/* Metrics/Quick Stats Bento */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-xxl">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg flex items-center justify-between">
              <div>
                <p className="font-label-sm text-label-sm text-on-surface-variant mb-xs uppercase tracking-wider">Total Reports</p>
                <p className="font-display-lg text-display-lg text-primary">{totalReports}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">description</span>
              </div>
            </div>
            
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg flex items-center justify-between">
              <div>
                <p className="font-label-sm text-label-sm text-on-surface-variant mb-xs uppercase tracking-wider">Generated This Week</p>
                <p className="font-display-lg text-display-lg text-primary">{thisWeekReports}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">trending_up</span>
              </div>
            </div>
            
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg flex items-center justify-between">
              <div>
                <p className="font-label-sm text-label-sm text-on-surface-variant mb-xs uppercase tracking-wider">In Progress</p>
                <p className="font-display-lg text-display-lg text-on-surface">{draftsOrPending}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                <span className="material-symbols-outlined">edit_document</span>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-huge">
              <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div>
                <p className="text-on-surface-variant font-body-md text-body-md">Loading reports...</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && reports.length === 0 && (
            <div className="flex flex-col items-center justify-center py-huge text-center">
              <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center mb-lg">
                <span className="material-symbols-outlined text-[40px] text-on-surface-variant">article</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-xs">No reports yet</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-lg max-w-sm">Upload your files and generate your first AI-powered report.</p>
              <Link to="/upload" className="bg-primary-container text-on-primary font-label-md text-label-md h-12 px-lg rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                Generate Your First Report
              </Link>
            </div>
          )}

          {/* Report Cards Grid */}
          {!loading && reports.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
              {reports.map((report) => (
                <div key={report.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg hover:shadow-md transition-shadow group relative overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-[#818cf8] opacity-50"></div>
                  <div className="flex justify-between items-start mb-md">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>{getStatusIcon(report.status)}</span>
                    </div>
                    {getStatusBadge(report.status)}
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-xs group-hover:text-primary transition-colors line-clamp-1">{report.report_name}</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-lg line-clamp-2">
                    {report.template_type ? `${report.template_type.charAt(0).toUpperCase() + report.template_type.slice(1)} Report` : 'Report'} • Project #{report.project_id}
                  </p>
                  <div className="flex items-center justify-between pt-md border-t border-outline-variant">
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>calendar_today</span>
                      <span className="font-label-sm text-label-sm">{formatDate(report.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {report.status === 'processing' || report.status === 'pending' ? (
                        <Link to={`/progress/${report.id}`} className="text-primary hover:bg-surface-container-high p-2 rounded-full transition-colors" title="View Progress">
                          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>visibility</span>
                        </Link>
                      ) : null}
                      
                      {report.status === 'completed' && (
                        <>
                          <button 
                            onClick={() => handleDownload(report.id, report.report_name, 'pdf')}
                            className="text-on-surface-variant hover:text-primary hover:bg-primary-container p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                            title="Download PDF"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>picture_as_pdf</span>
                          </button>
                          <button 
                            onClick={() => handleDownload(report.id, report.report_name, 'docx')}
                            className="text-on-surface-variant hover:text-primary hover:bg-primary-container p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                            title="Download DOCX"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>description</span>
                          </button>
                        </>
                      )}

                      <button 
                        onClick={() => handleDelete(report.id)}
                        className="text-on-surface-variant hover:text-error hover:bg-error-container p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </MainLayout>
  );
}
