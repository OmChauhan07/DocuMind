import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import UploadFiles from './pages/UploadFiles';
import ReportProgress from './pages/ReportProgress';

describe('Frontend Pages Rendering', () => {
  it('renders SignIn page without crashing', () => {
    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );
    expect(screen.getByText('DocuMind')).toBeTruthy();
    expect(screen.getByText('Email Address')).toBeTruthy();
  });

  it('renders Dashboard page without crashing', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    expect(screen.getByText('Recent Reports')).toBeTruthy();
    expect(screen.getByText('Total Reports')).toBeTruthy();
  });

  it('renders UploadFiles page without crashing', () => {
    render(
      <MemoryRouter>
        <UploadFiles />
      </MemoryRouter>
    );
    expect(screen.getByText('Upload Sources')).toBeTruthy();
    expect(screen.getByText('Drag files here or click to browse')).toBeTruthy();
  });

  it('renders ReportProgress page without crashing', () => {
    render(
      <MemoryRouter>
        <ReportProgress />
      </MemoryRouter>
    );
    expect(screen.getByText('Generating Report')).toBeTruthy();
    expect(screen.getByText('Cancel Generation')).toBeTruthy();
  });
});
