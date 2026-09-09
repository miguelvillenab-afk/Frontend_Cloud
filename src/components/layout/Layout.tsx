import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export function Layout() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <main className="container page" style={{ flex: 1 }}>
        <Outlet />
      </main>
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <div className="logo" style={{ marginBottom: 10 }}>
              <span className="logo-mark">⌂</span>
              <span>CloudStay<small>Alojamientos</small></span>
            </div>
            <p style={{ fontSize: 13, color: "var(--muted)", maxWidth: 300 }}>
              Encuentra alojamientos únicos o publica tu espacio. Viaja fácil, hospeda mejor.
            </p>
          </div>
          <div>
            <h4>Explorar</h4>
            <a href="/">Alojamientos</a>
            <a href="/analytics">Tendencias</a>
            <a href="/dashboard">Mi resumen</a>
          </div>
          <div>
            <h4>Anfitriones</h4>
            <a href="/publicar">Publicar tu espacio</a>
            <a href="/dashboard">Tus ingresos</a>
            <a href="/analytics">Destinos populares</a>
          </div>
          <div>
            <h4>Ayuda</h4>
            <a href="/perfil">Mi cuenta</a>
            <a href="/mis-reservas">Mis viajes</a>
            <a href="/publicar">Ser anfitrión</a>
          </div>
        </div>
        <div className="footer-bottom">© 2026 CloudStay · Viaja y hospeda con confianza</div>
      </footer>
    </div>
  );
}
