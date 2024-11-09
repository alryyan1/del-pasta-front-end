// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
 
const type = localStorage.getItem('user_type')
  if (type  == 'admin') {
    // Redirect to "403 Forbidden" page if not authorized
    return <Navigate to="/forbidden" />;
  }

  return children;
}

export default ProtectedRoute;
