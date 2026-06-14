import React, { useState, useEffect, useRef } from 'react';
import MainLayout from '../components/MainLayout';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { reportsService } from '../services/reports';

export default function ReportProgress() {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const pollingRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    fetchReport();
    // Start polling every 3 seconds
    pollingRef.current = setInterval(fetchReport, 3000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [reportId]);

  const fetchReport = async () => {
    try {
      const data = await reportsService.getReport(reportId);
      setReport(data);
      setLoading(false);

      // Stop polling when complete or failed
      if (data.status === 'completed' || data.status === 'failed') {
        if (pollingRef.current) clearInterval(pollingRef.current);
      }
    } catch (err) {
      setError('Failed to fetch report status.');
      setLoading(false);
      if (pollingRef.current) clearInterval(pollingRef.current);
    }
  };

  const handleDownload = async (format) => {
    if (!report) return;
    try {
      await reportsService.downloadReport(report.id, format, report.report_name);
    } catch (err) {
      setError(`Failed to download ${format.toUpperCase()}`);
    }
  };

  const getProgress = () => {
    if (!report) return 0;
    switch (report.status) {
      case 'pending': return 15;
      case 'processing': {
        // Simulate progress based on time elapsed (cap at 90%)
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        return Math.min(15 + Math.floor(elapsed / 2), 90);
      }
      case 'completed': return 100;
      case 'failed': return 100;
      default: return 0;
    }
  };

  const getStatusText = () => {
    if (!report) return 'Loading...';
    switch (report.status) {
      case 'pending': return 'Queuing report generation...';
      case 'processing': return 'AI agents are analyzing your files...';
      case 'completed': return 'Report generated successfully!';
      case 'failed': return 'Report generation failed.';
      default: return 'Processing...';
    }
  };

  const getStatusColor = () => {
    if (!report) return 'text-primary-container';
    switch (report.status) {
      case 'completed': return 'text-[#059669]';
      case 'failed': return 'text-error';
      default: return 'text-primary-container';
    }
  };

  const progress = getProgress();

  if (loading) {
    return (
      <MainLayout>
        <main className="flex-1 flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div>
            <p className="text-on-surface-variant font-body-md text-body-md">Loading report status...</p>
          </div>
        </main>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <main className="flex-1 flex flex-col relative min-h-screen">
        <div className="flex-1 flex items-center justify-center p-md bg-[#f8fafc]">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-2px_rgba(0,0,0,0.05)] border border-slate-200 p-xl flex flex-col items-center text-center relative overflow-hidden">
            {/* AI Gradient Border Effect */}
            <div className="absolute inset-0 border border-transparent rounded-xl pointer-events-none" style={{background: "linear-gradient(to right, #e2e8f0, #e2e8f0) padding-box, linear-gradient(45deg, rgba(79,70,229,0.1), rgba(126,48,0,0.05)) border-box"}}></div>
            
            {/* Animation Container */}
            <div className="w-48 h-48 mb-lg relative flex items-center justify-center rounded-full bg-surface-container-low">
              {report?.status === 'completed' ? (
                <span className="material-symbols-outlined text-[64px] text-[#059669]">check_circle</span>
              ) : report?.status === 'failed' ? (
                <span className="material-symbols-outlined text-[64px] text-error">error</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[64px] text-primary-container opacity-20 absolute animate-pulse-soft">document_scanner</span>
                  <div className="absolute inset-0 rounded-full border-4 border-primary-container/20 border-t-primary-container animate-spin" style={{ animationDuration: '2s' }}></div>
                </>
              )}
            </div>
            
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-xs">
              {report?.status === 'completed' ? 'Report Ready!' : report?.status === 'failed' ? 'Generation Failed' : 'Generating Report'}
            </h2>
            <div className="h-6 mb-xl">
              <p className={`font-body-md text-body-md ${getStatusColor()} font-medium ${report?.status === 'processing' || report?.status === 'pending' ? 'animate-pulse-soft' : ''}`}>
                {getStatusText()}
              </p>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full mb-md">
              <div className="flex justify-between items-end mb-xs">
                <span className="font-label-md text-label-md text-on-surface-variant">Progress</span>
                <span className="font-label-sm text-label-sm text-primary font-bold">{progress}%</span>
              </div>
              <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden border border-outline-variant">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ease-out ${
                    report?.status === 'failed' ? 'bg-error' : 
                    report?.status === 'completed' ? 'bg-[#059669]' : 
                    'bg-primary-container progress-bar-shimmer relative'
                  }`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Report Name */}
            {report && (
              <div className="flex items-center justify-center gap-xs text-on-surface-variant bg-surface px-md py-sm rounded-lg border border-outline-variant mb-md">
                <span className="material-symbols-outlined text-[18px]">description</span>
                <span className="font-body-sm text-body-sm">{report.report_name}</span>
              </div>
            )}

            {/* Error Details */}
            {report?.status === 'failed' && report.content && (
              <div className="w-full p-3 rounded-lg bg-error-container text-on-error-container text-body-sm font-body-sm text-left mb-md">
                {report.content}
              </div>
            )}

            {/* Completed Actions */}
            {report?.status === 'completed' && (
              <div className="flex flex-col gap-sm w-full mt-md">
                <div className="flex flex-col sm:flex-row gap-sm w-full">
                  <button 
                    onClick={() => handleDownload('pdf')}
                    className="flex-1 bg-error-container text-on-error-container font-label-md text-label-md rounded-lg py-3 px-4 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                  >
                    <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
                    Download PDF
                  </button>
                  <button 
                    onClick={() => handleDownload('docx')}
                    className="flex-1 bg-[#e0f2fe] text-[#0369a1] font-label-md text-label-md rounded-lg py-3 px-4 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                  >
                    <span className="material-symbols-outlined text-[18px]">description</span>
                    Download DOCX
                  </button>
                </div>
                <div className="flex flex-col sm:flex-row gap-sm w-full mt-sm border-t border-outline-variant pt-sm">
                  <Link 
                    to="/dashboard" 
                    className="flex-1 bg-surface-container-high text-on-surface font-label-md text-label-md rounded-lg py-3 px-4 flex items-center justify-center gap-2 hover:bg-surface-container-highest transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">dashboard</span>
                    Dashboard
                  </Link>
                  <Link 
                    to="/upload" 
                    className="flex-1 bg-surface-container-high text-on-surface font-label-md text-label-md rounded-lg py-3 px-4 flex items-center justify-center gap-2 hover:bg-surface-container-highest transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    New Report
                  </Link>
                </div>
              </div>
            )}

            {/* Cancel / Go Back */}
            {(report?.status === 'pending' || report?.status === 'processing') && (
              <Link to="/dashboard" className="mt-lg font-label-md text-label-md text-on-surface-variant hover:text-error transition-colors px-md py-xs rounded-full hover:bg-error-container">
                Cancel Generation
              </Link>
            )}

            {report?.status === 'failed' && (
              <Link to="/upload" className="mt-lg font-label-md text-label-md text-primary-container hover:text-primary transition-colors px-md py-xs rounded-full hover:bg-primary-fixed">
                Try Again
              </Link>
            )}
          </div>
        </div>
      </main>
    </MainLayout>
  );
}
