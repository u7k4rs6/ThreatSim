import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserProgress, getAllChallengeProgress } from '../utils/dataStorage';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    if (user) {
      // Debug: Log user data and progress
      console.log('🔐 User authenticated:', user);
      const userProgress = getUserProgress(user.uid);
      const challengeProgress = getAllChallengeProgress(user.uid);
      console.log('📊 User progress:', userProgress);
      console.log('🎯 Challenge progress:', challengeProgress);
      console.log('💾 Data storage is working! Your progress will be saved.');
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
