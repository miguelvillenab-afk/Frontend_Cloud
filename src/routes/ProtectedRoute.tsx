import { Navigate } from "react-router-dom";
import { isTokenExpired, useAuthStore } from "../stores/authStore";
import type { Rol } from "../api/types";

export function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: Rol[] }) {
  const { isAuthenticated, user, token, logout } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  // Auto-logout si el JWT expiró (default 60 min en el MS, sin refresh).
  if (isTokenExpired(token)) {
    logout();
    return <Navigate to="/login?expired=1" replace />;
  }
  if (roles && user && !roles.includes(user.rol)) return <Navigate to="/" replace />;
  return <>{children}</>;
}
