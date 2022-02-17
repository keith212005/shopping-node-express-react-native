import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthenticationRoute = ({ children }) => {
  const auth = localStorage.getItem('ACCESS_TOKEN');
  return auth ? children : <Navigate to="/login" />;
};

export default AuthenticationRoute;
