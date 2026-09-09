import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const initial = user?.nombre?.charAt(0).toUpperCase() ?? "U";

  return (
    <div className="nav-wrap">
      <nav className="nav">
        <Link to="/" className="logo">
          <span className="logo-mark">⌂</span>
          <span>CloudStay<small>Alojamientos</small></span>
        </Link>
        <div className="nav-links">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>Explorar</NavLink>
          {isAuthenticated && <NavLink to="/mis-reservas" className={({ isActive }) => (isActive ? "active" : "")}>Viajes</NavLink>}
          {user?.rol === "ANFITRION" && <NavLink to="/publicar" className={({ isActive }) => (isActive ? "active" : "")}>Publicar</NavLink>}
          {isAuthenticated && <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>Mi resumen</NavLink>}
          <NavLink to="/analytics" className={({ isActive }) => (isActive ? "active" : "")}>Tendencias</NavLink>
        </div>
        <div className="nav-right">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="btn btn-ghost">Entrar</Link>
              <Link to="/registro" className="btn btn-primary">Regístrate</Link>
            </>
          ) : (
            <Link to="/perfil" className="pill-user">
              <span className={`role-badge role-${user?.rol}`}>{user?.rol === "HUESPED" ? "Huésped" : "Anfitrión"}</span>
              <span style={{ fontSize: 13, fontWeight: 700, maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.nombre}</span>
              <span className="avatar">{initial}</span>
            </Link>
          )}
          {isAuthenticated && (
            <button className="btn btn-ghost" onClick={() => { logout(); navigate("/"); }}>Salir</button>
          )}
        </div>
      </nav>
    </div>
  );
}
