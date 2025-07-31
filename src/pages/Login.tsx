import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    
    try {
      await loginWithGoogle();
      // Redirect to the page they came from or main page
      const redirectTo = from === '/login' ? '/' : from;
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError('Google authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Journey
        </Link>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
          <div className="flex items-center justify-center mb-8">
            <Shield className="w-12 h-12 text-indigo-400" />
          </div>

          <h2 className="text-2xl font-bold text-center mb-2 text-white">Welcome Back</h2>
          <p className="text-gray-400 text-center mb-6">
            Sign in to continue your cybersecurity journey
          </p>
          
          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-600/50 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}
          
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-orange-500 text-white font-medium rounded-lg hover:from-red-700 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
