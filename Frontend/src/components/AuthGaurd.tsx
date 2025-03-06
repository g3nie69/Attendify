import React from 'react';
import { Navigate } from 'react-router-dom';

const isAuthenticated = () => {
  const lecturer = localStorage.getItem('lecturer');
  return !!lecturer;
};

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/" />;
  }
  return <>{children}</>;
};

export default AuthGuard;