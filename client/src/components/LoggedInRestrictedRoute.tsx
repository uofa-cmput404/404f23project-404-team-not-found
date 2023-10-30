import React from "react";
import { Navigate } from "react-router-dom";

interface LoggedInRestrictedRouteProps {
  user: string | null; // You should specify the actual type of the user object
  children: any;
}

const LoggedInRestrictedRoute: React.FC<LoggedInRestrictedRouteProps> = ({
  user,
  children,
}) => {
  if (user) {
    return <Navigate to="/home-page" replace />;
  }

  return children;
};

export default LoggedInRestrictedRoute;
