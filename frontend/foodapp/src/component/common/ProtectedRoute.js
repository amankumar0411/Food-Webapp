import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Route protection wrapper.
 * Checks if user is authenticated and possesses the required role.
 */
function ProtectedRoute({ children, allowedRoles }) {
  const user = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = role ? role.toLowerCase() : '';
    const hasRole = allowedRoles.some(r => r.toLowerCase() === userRole);
    if (!hasRole) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;
