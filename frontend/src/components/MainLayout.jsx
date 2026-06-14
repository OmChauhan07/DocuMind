import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function MainLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
    { name: 'Upload Files', path: '/upload', icon: 'upload_file' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // Get user initials for avatar
  const getInitials = () => {
    if (!user?.name) return '??';
    const parts = user.name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="bg-surface text-on-surface h-full flex overflow-hidden min-h-screen">
      {/* SideNavBar */}
      <nav className="hidden md:flex flex-col h-screen fixed left-0 top-0 py-lg px-md w-64 border-r border-outline-variant bg-surface z-50">
        <div className="flex items-center gap-3 mb-xl px-sm">
          <div className="w-8 h-8 rounded-DEFAULT bg-primary-container flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined text-[20px]">smart_toy</span>
          </div>
          <div>
            <h1 className="text-headline-md font-headline-md font-bold text-primary">DocuMind</h1>
            <p className="font-label-sm text-label-sm text-on-surface-variant">AI Report Generator</p>
          </div>
        </div>
        <Link to="/upload" className="w-full bg-primary-container text-on-primary font-label-md text-label-md py-3 px-4 rounded-lg mb-8 hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
          Generate New Report
        </Link>
        <ul className="flex-1 flex flex-col gap-sm">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-label-md text-label-md transition-colors duration-200 ${
                    isActive
                      ? 'bg-secondary-container text-on-secondary-container font-bold'
                      : 'text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  <span className={`material-symbols-outlined ${isActive ? 'icon-fill' : ''}`}>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="mt-auto pt-lg border-t border-outline-variant">
          <div className="flex items-center gap-3 px-sm mb-3">
            <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary font-bold">
              {getInitials()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-label-md text-label-md text-on-surface truncate">{user?.name || 'User'}</p>
              <p className="font-label-sm text-label-sm text-on-surface-variant truncate">{user?.email || ''}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-error-container hover:text-error transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            Sign Out
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-64 min-h-screen">
        {/* TopNavBar */}
        <header className="h-16 w-full border-b border-outline-variant bg-surface/80 backdrop-blur-md flex justify-between items-center px-lg sticky top-0 z-40">
          {/* Mobile Menu Button & Brand */}
          <div className="flex md:hidden items-center gap-3">
            <button className="p-2 text-on-surface-variant">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <span className="font-headline-md text-headline-md font-bold text-primary">DocuMind</span>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input 
              className="w-full h-10 pl-10 pr-4 bg-surface-container-low border border-outline-variant rounded-lg font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-all" 
              placeholder="Search reports..." 
              type="text"
            />
          </div>

          {/* Trailing Actions */}
          <div className="flex items-center gap-4">
            <button className="text-on-surface-variant hover:text-primary transition-colors focus:ring-2 focus:ring-primary ring-opacity-50 rounded-full p-2">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button 
              onClick={handleLogout}
              className="md:hidden text-on-surface-variant hover:text-error transition-colors focus:ring-2 focus:ring-primary ring-opacity-50 rounded-full p-2"
              title="Sign Out"
            >
              <span className="material-symbols-outlined">logout</span>
            </button>
            <div className="md:hidden w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-primary font-bold text-sm">
              {getInitials()}
            </div>
          </div>
        </header>

        {/* Page Canvas */}
        {children}
      </div>
    </div>
  );
}
