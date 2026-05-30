import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center text-slate-100">
        <div className="relative flex items-center justify-center">
          {/* Animated rings for a premium feel */}
          <div className="absolute w-16 h-16 border-4 border-indigo-500/20 rounded-full animate-ping"></div>
          <div className="w-12 h-12 border-4 border-t-indigo-500 border-r-indigo-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-6 text-sm font-medium tracking-wide text-slate-400 animate-pulse">
          Loading credentials...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login but save the current location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    // Redirect non-admin users trying to access admin panel
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
