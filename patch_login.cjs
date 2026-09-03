const fs = require('fs');
const newLoginCode = `import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/common/Logo';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
  const { login } = useApp();
  const [username, setUsername] = useState('superadmin');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter your authorized username or Employee ID.');
      return;
    }
    
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const success = login(username, password);
      setIsLoading(false);
      
      if (!success) {
        setError('Invalid credentials. Please check your credentials.');
      }
    }, 450);
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] relative flex items-center justify-center p-4 sm:p-6 overflow-hidden select-none">
      
      {/* Subtle grid overlay texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:28px_28px] opacity-30 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-8">
          <Logo showTagline={false} className="scale-125" />
        </div>

        {error && (
          <div className="mb-4 w-full max-w-sm p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="tccl-form" onSubmit={handleSubmit}>
          <div className="tccl-login-area">
            <p className="title">LOGIN</p>
            <p className="behind">Log in to your account</p>
          </div>
          
          <div className="tccl-email-area">
            <input 
              placeholder="USERNAME" 
              className="input" 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="tccl-password-area">
            <input 
              placeholder="PASSWORD" 
              className="input" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <a>Forgot password?</a>
          </div>
          
          <div className="tccl-footer-area">
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Authenticating...' : 'Log In'}
            </button>
            <div className="tccl-text-inside">
              <p>Don't have an account?</p>
              <a className="tccl-link">Sign Up</a>
            </div>
          </div>
          
          <div className="tccl-background-color"></div>
          <div className="tccl-whitefilter"></div>
        </form>

        {/* Outer Legal Tag */}
        <p className="text-center text-[11px] text-slate-500 mt-8">
          © 2026 Technic Construction Company Ltd. All Rights Reserved.
        </p>
      </div>
    </div>
  );
};
`;

fs.writeFileSync('src/pages/LoginPage.tsx', newLoginCode);
