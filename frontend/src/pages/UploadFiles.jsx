import React, { useState, useRef, useCallback, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import { useNavigate } from 'react-router-dom';
import { projectsService } from '../services/projects';
import { filesService } from '../services/files';
import { reportsService } from '../services/reports';

const ALLOWED_EXTENSIONS = ['.py', '.ipynb', '.csv', '.xlsx', '.docx', '.pdf', '.txt', '.md'];

export default function UploadFiles() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [showNewProject, setShowNewProject] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [reportName, setReportName] = useState('');
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [uploadAsTemplate, setUploadAsTemplate] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await projectsService.getProjects();
      setProjects(data);
      if (data.length > 0) {
        setSelectedProjectId(data[0].id);
      } else {
        setShowNewProject(true);
      }
    } catch (err) {
      setError('Failed to load projects.');
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      setError('Please enter a project name.');
      return;
    }
    try {
      const project = await projectsService.createProject({ 
        project_name: newProjectName.trim(),
        description: `Created from upload page`
      });
      setProjects((prev) => [...prev, project]);
      setSelectedProjectId(project.id);
      setShowNewProject(false);
      setNewProjectName('');
      setError('');
    } catch (err) {
      setError('Failed to create project.');
    }
  };

  const loadFiles = useCallback(async () => {
    if (!selectedProjectId) return;
    try {
      const data = await filesService.getFiles(selectedProjectId);
      setUploadedFiles(data);
    } catch (err) {
      // Ignore — might just be empty
    }
  }, [selectedProjectId]);

  useEffect(() => {
    if (selectedProjectId) {
      loadFiles();
    }
  }, [selectedProjectId, loadFiles]);

  const validateFile = (file) => {
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return `File type ${ext} is not supported.`;
    }
    if (file.size > 100 * 1024 * 1024) {
      return `File ${file.name} exceeds 100MB limit.`;
    }
    return null;
  };

  const handleFileUpload = async (files) => {
    if (!selectedProjectId) {
      setError('Please select or create a project first.');
      return;
    }

    setUploading(true);
    setError('');

    for (const file of files) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        continue;
      }

      try {
        const uploaded = await filesService.uploadFile(selectedProjectId, file, uploadAsTemplate);
        setUploadedFiles((prev) => [...prev, uploaded]);
      } catch (err) {
        const detail = err.response?.data?.detail || `Failed to upload ${file.name}`;
        setError(detail);
      }
    }

    setUploading(false);
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) handleFileUpload(files);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) handleFileUpload(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOver(false);
    }
  };

  const handleDeleteFile = async (fileId) => {
    try {
      await filesService.deleteFile(fileId);
      setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
    } catch (err) {
      setError('Failed to delete file.');
    }
  };

  const handleGenerateReport = async () => {
    if (uploadedFiles.length === 0) {
      setError('Please upload at least one file first.');
      return;
    }
    
    const contentFiles = uploadedFiles.filter(f => !f.is_template);
    if (contentFiles.length === 0) {
      setError('Please upload at least one content file (not marked as a template).');
      return;
    }
    
    if (!reportName.trim()) {
      setError('Please enter a report name.');
      return;
    }

    setGenerating(true);
    setError('');
    try {
      const report = await reportsService.generateReport(selectedProjectId, reportName.trim());
      navigate(`/progress/${report.id}`);
    } catch (err) {
      const detail = err.response?.data?.detail || 'Failed to start report generation.';
      setError(detail);
      setGenerating(false);
    }
  };

  const getFileIcon = (fileType) => {
    if (!fileType) return 'insert_drive_file';
    const normalizedType = fileType.replace(/^\./, '').toLowerCase();
    switch (normalizedType) {
      case 'py': return 'code';
      case 'ipynb': return 'data_object';
      case 'csv': case 'xlsx': return 'table_view';
      case 'pdf': return 'picture_as_pdf';
      case 'docx': return 'article';
      case 'txt': case 'md': return 'text_snippet';
      default: return 'insert_drive_file';
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  return (
    <MainLayout>
      <main className="flex-1 p-margin-mobile md:p-lg xl:p-xl max-w-container-max mx-auto w-full pb-32">
        {/* Page Header */}
        <div className="mb-lg">
          <h1 className="font-headline-lg text-headline-lg md:text-display-lg md:font-display-lg text-on-background mb-xs">Upload Sources</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Add the code files or datasets you want DocuMind to analyze.</p>
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

        {/* Project Selector */}
        <div className="bg-white rounded-xl border border-outline-variant p-lg shadow-sm mb-lg">
          <h3 className="font-headline-md text-headline-md text-on-background mb-md">Select Project</h3>
          <div className="flex flex-col sm:flex-row gap-sm">
            {!showNewProject ? (
              <>
                <select 
                  className="flex-1 h-12 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md font-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container"
                  value={selectedProjectId || ''}
                  onChange={(e) => setSelectedProjectId(Number(e.target.value))}
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.project_name}</option>
                  ))}
                </select>
                <button 
                  onClick={() => setShowNewProject(true)}
                  className="h-12 px-4 bg-surface-container-high text-on-surface rounded-lg font-label-md text-label-md hover:bg-surface-container-highest transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  New Project
                </button>
              </>
            ) : (
              <>
                <input 
                  type="text"
                  placeholder="Enter project name..."
                  className="flex-1 h-12 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md font-body-md text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
                  autoFocus
                />
                <button 
                  onClick={handleCreateProject}
                  className="h-12 px-4 bg-primary-container text-on-primary rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity"
                >
                  Create
                </button>
                {projects.length > 0 && (
                  <button 
                    onClick={() => { setShowNewProject(false); setNewProjectName(''); }}
                    className="h-12 px-4 bg-surface-container-high text-on-surface rounded-lg font-label-md text-label-md hover:bg-surface-container-highest transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Upload Zone */}
        <div className="bg-white rounded-xl border border-outline-variant p-lg shadow-sm mb-lg">
          <div 
            className={`border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-huge text-center cursor-pointer group transition-colors ${
              dragOver 
                ? 'border-primary bg-primary-fixed/10' 
                : 'border-outline-variant hover:border-primary bg-surface-container-lowest'
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input 
              ref={fileInputRef}
              type="file" 
              multiple 
              className="hidden" 
              accept={ALLOWED_EXTENSIONS.join(',')}
              onChange={handleFileInputChange}
            />
            <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-md group-hover:bg-primary-fixed transition-colors">
              {uploading ? (
                <div className="w-8 h-8 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="material-symbols-outlined text-[32px] text-primary">cloud_upload</span>
              )}
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-xs">
              {uploading ? 'Uploading...' : 'Drag files here or click to browse'}
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto">Supports a variety of formats for comprehensive analysis.</p>
          </div>

          {/* Supported Formats */}
          <div className="mt-md flex flex-wrap items-center justify-center gap-sm">
            {['.PY', '.IPYNB', '.CSV', '.XLSX', '.PDF', '.DOCX', '.TXT', '.MD'].map((ext) => (
              <span key={ext} className="inline-flex items-center px-3 py-1 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm">{ext}</span>
            ))}
          </div>
          
          {/* Template Checkbox */}
          <div className="mt-lg flex items-center justify-center gap-2">
            <input 
              type="checkbox" 
              id="uploadAsTemplate" 
              className="w-5 h-5 text-primary border-outline-variant rounded focus:ring-primary focus:ring-2"
              checked={uploadAsTemplate}
              onChange={(e) => setUploadAsTemplate(e.target.checked)}
            />
            <label htmlFor="uploadAsTemplate" className="font-body-md text-body-md text-on-surface cursor-pointer select-none">
              Upload as Sample Format Template
            </label>
          </div>
        </div>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="mb-lg">
            <h3 className="font-headline-md text-headline-md text-on-background mb-md">Uploaded Files ({uploadedFiles.length})</h3>
            <div className="flex flex-col gap-sm">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="bg-white border border-outline-variant rounded-lg p-md flex items-center justify-between group hover:border-primary-container transition-colors shadow-sm">
                  <div className="flex items-center gap-md">
                    <div className="w-10 h-10 rounded bg-surface-container-high flex items-center justify-center text-primary shrink-0">
                      <span className="material-symbols-outlined">{getFileIcon(file.file_type)}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-label-md text-label-md text-on-surface">{file.file_name}</p>
                        {file.is_template && (
                          <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold tracking-wider">
                            TEMPLATE
                          </span>
                        )}
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                        {file.file_type.toUpperCase()} &bull; Uploaded {new Date(file.upload_date).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteFile(file.id)}
                    className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container rounded-full transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Report Name + Generate */}
        {uploadedFiles.length > 0 && (
          <div className="bg-white rounded-xl border border-outline-variant p-lg shadow-sm mb-lg">
            <h3 className="font-headline-md text-headline-md text-on-background mb-md">Generate Report</h3>
            <div className="flex flex-col sm:flex-row gap-sm">
              <input 
                type="text"
                placeholder="Enter report name..."
                className="flex-1 h-12 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md font-body-md text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Floating Action Area */}
        {uploadedFiles.length > 0 && (
          <div className="fixed bottom-0 right-0 p-lg w-full md:w-auto bg-white/90 backdrop-blur-sm border-t md:border-none border-outline-variant flex justify-end z-30">
            <button 
              onClick={handleGenerateReport}
              disabled={generating || !reportName.trim()}
              className="w-full md:w-auto bg-primary text-on-primary font-label-md text-label-md rounded-lg py-4 px-6 flex items-center justify-center gap-2 hover:bg-secondary transition-colors shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-2px_rgba(0,0,0,0.05)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {generating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Starting generation...
                </>
              ) : (
                <>
                  Generate Report
                  <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                </>
              )}
            </button>
          </div>
        )}
      </main>
    </MainLayout>
  );
}
