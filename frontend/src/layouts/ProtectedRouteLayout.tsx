// src/layouts/AppLayout.tsx
import { Outlet } from "react-router-dom";

function ProtectedRouteLayout() {
  return <Outlet />;
}

export default ProtectedRouteLayout;
