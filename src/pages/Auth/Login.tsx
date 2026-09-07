import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getUser } from "../../api/users";
import { useAuthStore } from "../../stores/authStore";

export function Login() {
  const [usuarioId, setUsuarioId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const user = await getUser(usuarioId.trim());
      login(user);
      navigate("/perfil");
    } catch (err) { setError((err as Error).message); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-side">
        <div>
          <span className="chip">Bienvenido de vuelta</span>
          <h2 style={{ marginTop: 14 }}>Tu próxima estadía te espera.</h2>
          <ul>
            <li>🔑 Login por <code>GET /usuarios/:id</code> (sin JWT aún).</li>
            <li>📋 Copia el <code>id_usuario</code> del Network tras registrarte.</li>
            <li>🚀 Migrable a <code>POST /auth/login</code> con token.</li>
          </ul>
        </div>
        <p style={{ fontSize: 12, opacity: 0.8 }}>Tip demo: regístrate primero en /registro y luego pega aquí el UUID.</p>
      </div>
      <div className="auth-form">
        <h1>Entrar</h1>
        <p className="sub">Accede con tu ID de usuario. ¿No tienes cuenta? <Link to="/registro">Créala gratis</Link></p>
        <form onSubmit={onSubmit} className="form-stack">
          <div className="field"><label>ID de usuario (UUID)</label><input className="input" placeholder="a1b2c3d4-…" value={usuarioId} onChange={(e) => setUsuarioId(e.target.value)} /></div>
          <button className="btn btn-primary" type="submit" disabled={loading || !usuarioId}>{loading ? "Verificando…" : "Entrar →"}</button>
          {error && <span className="err">{error} — verifica que el MS esté en :8000</span>}
        </form>
        <div className="api-note"><code>GET /usuarios/{`{id}`}</code> · 404 si no existe · Swagger: <a href="http://localhost:8000/docs" target="_blank" rel="noreferrer">localhost:8000/docs</a></div>
      </div>
    </div>
  );
}
