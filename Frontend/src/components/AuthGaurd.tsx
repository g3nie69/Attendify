import React from "react";
import { Navigate } from "react-router-dom";

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem("access");

  if (!token) {
    console.log("No token found, redirecting to login...");
    return <Navigate to="/" />;
  }

  console.log("Token found, rendering protected route...");
  return <>{children}</>; // Ensure it properly renders the children
};

export default AuthGuard;
