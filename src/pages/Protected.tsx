// ProtectedRoute.js
import { useAuthContext } from '@/contexts/stateContext';
import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const {user,token} =  useAuthContext();
  // debugger;

  console.log(token,'token')
  if (!token) {
    return <Navigate to={'/login'}/>
  }
const type = localStorage.getItem('user_type')
  if (type  == 'staff') {
    // Redirect to "403 Forbidden" page if not authorized
    return <Navigate to="/forbidden" />;
  }

  return children;
}

export default ProtectedRoute;
