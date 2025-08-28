import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input, Button } from '../components/ui';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError('Please enter your email.');
      return;
    }
    const success = login(email);
    if (success) {
      navigate('/');
    } else {
      setError('Invalid email. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-8 space-y-8 bg-surface border border-border rounded-xl shadow-lg">
        <div>
          <h1 className="text-3xl font-extrabold text-center text-primary">
            RICH MEN DREAM CRM
          </h1>
          <p className="mt-2 text-center text-sm text-gray-400">
            Sign in to access your dashboard
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <Input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address (e.g., admin@dream.ae)"
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </div>
        </form>
         <div className="text-center text-xs text-gray-500">
            <p>Use 'admin@dream.ae' for Admin role.</p>
            <p>Use 'ahmed@dream.ae' for Agent role.</p>
         </div>
      </div>
    </div>
  );
};

export default LoginPage;
