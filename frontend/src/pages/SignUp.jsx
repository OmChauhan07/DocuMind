import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignUp() {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const detail = err.response?.data?.detail || 'Registration failed. Please try again.';
      setError(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface-container-lowest text-on-surface antialiased min-h-screen flex flex-col items-center justify-center p-4 md:p-lg selection:bg-primary-container selection:text-on-primary relative overflow-hidden">
      
      {/* Background SVG Animation */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <svg fill="none" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-cover">
          <circle cx="200" cy="150" fill="#4f46e5" fillOpacity="0.05" r="100">
            <animate attributeName="r" dur="4s" repeatCount="indefinite" values="100;110;100"></animate>
          </circle>
          <rect fill="#4f46e5" height="50" rx="12" width="50" x="175" y="125">
            <animate attributeName="fill-opacity" dur="2s" repeatCount="indefinite" values="0.8;1;0.8"></animate>
          </rect>
          <path d="M190 142H210M190 150H210M190 158H202" stroke="white" strokeLinecap="round" strokeWidth="2"></path>
          <g>
            <circle fill="#818cf8" r="6">
              <animateMotion dur="6s" path="M 200,150 m -80,0 a 80,80 0 1,0 160,0 a 80,80 0 1,0 -160,0" repeatCount="indefinite"></animateMotion>
            </circle>
            <circle fill="#4f46e5" fillOpacity="0.6" r="4">
              <animateMotion dur="4s" path="M 200,150 m 60,0 a 60,60 0 1,0 -120,0 a 60,60 0 1,0 120,0" repeatCount="indefinite"></animateMotion>
            </circle>
          </g>
        </svg>
      </div>

      <main className="w-full max-w-md flex flex-col items-center animate-fade-in-up z-10">
        <header className="flex flex-col items-center text-center mb-10 w-full">
          <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center mb-6 overflow-hidden shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <rect width="100" height="100" rx="20" fill="#4f46e5"/>
              <path d="M30 35H70V45H30V35Z" fill="white"/>
              <path d="M30 50H70V60H30V50Z" fill="white"/>
              <path d="M30 65H55V75H30V65Z" fill="white"/>
              <circle cx="75" cy="70" r="10" fill="#818cf8"/>
              <path d="M72 70L78 70M75 67L75 73" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="text-headline-lg font-headline-lg text-on-surface mb-3 tracking-tight">
            Create Account
          </h1>
          <p className="text-body-md font-body-md text-on-surface-variant max-w-xs mx-auto">
            Get started with DocuMind — your AI-powered report generator.
          </p>
        </header>

        <div className="w-full bg-surface-container-lowest rounded-lg p-8 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-2px_rgba(0,0,0,0.05)] border-none">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-error-container text-on-error-container text-body-sm font-body-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {error}
            </div>
          )}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2 text-left">
              <label className="block text-label-sm font-label-sm text-on-surface-variant" htmlFor="name">
                Full Name
              </label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-outline-variant group-focus-within:text-primary-container transition-colors duration-200">
                  <span className="material-symbols-outlined text-[20px]">person</span>
                </span>
                <input 
                  autoComplete="name"
                  className="block w-full h-[48px] pl-11 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md font-body-md text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all duration-200" 
                  id="name" 
                  name="name" 
                  placeholder="John Doe" 
                  required 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2 text-left">
              <label className="block text-label-sm font-label-sm text-on-surface-variant" htmlFor="email">
                Email Address
              </label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-outline-variant group-focus-within:text-primary-container transition-colors duration-200">
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                </span>
                <input 
                  autoComplete="email" 
                  className="block w-full h-[48px] pl-11 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md font-body-md text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all duration-200" 
                  id="email" 
                  name="email" 
                  placeholder="name@company.com" 
                  required 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2 text-left">
              <label className="block text-label-sm font-label-sm text-on-surface-variant" htmlFor="password">
                Password
              </label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-outline-variant group-focus-within:text-primary-container transition-colors duration-200">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                </span>
                <input 
                  autoComplete="new-password" 
                  className="block w-full h-[48px] pl-11 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md font-body-md text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all duration-200" 
                  id="password" 
                  name="password" 
                  placeholder="••••••••" 
                  required 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2 text-left">
              <label className="block text-label-sm font-label-sm text-on-surface-variant" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-outline-variant group-focus-within:text-primary-container transition-colors duration-200">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                </span>
                <input 
                  autoComplete="new-password" 
                  className="block w-full h-[48px] pl-11 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md font-body-md text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all duration-200" 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  placeholder="••••••••" 
                  required 
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full h-[48px] flex items-center justify-center px-lg py-3 mt-2 bg-primary-container text-surface-container-lowest rounded-lg text-label-md font-label-md hover:bg-primary hover:shadow-md active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-container disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <span className="material-symbols-outlined ml-2 text-[18px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <p className="text-body-sm font-body-sm text-on-surface-variant">
            Already have an account? 
            <Link to="/login" className="text-primary-container hover:text-primary font-medium transition-colors duration-200 ml-1">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
