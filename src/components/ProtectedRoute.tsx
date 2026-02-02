import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, userRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // The user role check is simplified. In a real app, you might fetch user details.
  // For this PoC, we assume role is available or we can derive it.
  // The backend JWT does not contain the role. A call to a /users/me endpoint would be better.
  // For now, let's assume all authenticated users can see everything for simplicity of PoC.
  // A more robust implementation would check `userRole` against `allowedRoles`.

  return <Outlet />;
};

export default ProtectedRoute;
