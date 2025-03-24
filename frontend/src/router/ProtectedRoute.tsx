// src/router/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
