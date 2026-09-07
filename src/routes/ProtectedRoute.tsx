import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import type { Rol } from "../api/types";

export function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: Rol[] }) {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && user && !roles.includes(user.rol)) return <Navigate to="/" replace />;
  return <>{children}</>;
}
