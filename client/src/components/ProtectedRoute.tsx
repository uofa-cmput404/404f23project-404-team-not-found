import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  user: string | null; // You should specify the actual type of the user object
  children: any;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
