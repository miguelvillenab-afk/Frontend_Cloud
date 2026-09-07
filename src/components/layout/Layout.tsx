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
              <span>CloudStay<small>Plataforma UTEC Cloud</small></span>
            </div>
            <p style={{ fontSize: 13, color: "var(--muted)", maxWidth: 300 }}>
              SPA en React + Vite desplegada en AWS Amplify. Consume 5 microservicios vía API Gateway HTTPS.
            </p>
          </div>
          <div>
            <h4>Explorar</h4>
            <a href="/">Catálogo</a>
            <a href="/analytics">Analytics</a>
            <a href="/dashboard">Dashboard</a>
          </div>
          <div>
            <h4>Anfitriones</h4>
            <a href="/publicar">Publicar propiedad</a>
            <a href="/dashboard">Rendimiento</a>
            <a href="/analytics">Ingresos</a>
          </div>
          <div>
            <h4>APIs · Swagger</h4>
            <a href="http://localhost:8000/docs" target="_blank" rel="noreferrer">Users :8000 ↗</a>
            <a href="http://localhost:8001/docs" target="_blank" rel="noreferrer">Properties :8001 ↗</a>
            <a href="http://localhost:8002/docs" target="_blank" rel="noreferrer">Reservations :8002 ↗</a>
          </div>
        </div>
        <div className="footer-bottom">© 2026 CloudStay · Frontend Cloud · Amplify + Gateway · 20k registros stress-test</div>
      </footer>
    </div>
  );
}
