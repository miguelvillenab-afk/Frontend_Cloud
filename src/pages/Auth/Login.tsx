import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ClipboardList, KeyRound, ShieldCheck } from "lucide-react";
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
            <li style={{ display: "flex", gap: 10, alignItems: "flex-start" }}><KeyRound size={18} style={{ flexShrink: 0, marginTop: 2 }} /><span><strong>Acceso rápido:</strong> entra con tu código personal.</span></li>
            <li style={{ display: "flex", gap: 10, alignItems: "flex-start" }}><ClipboardList size={18} style={{ flexShrink: 0, marginTop: 2 }} /><span><strong>¿Dónde lo encuentro?</strong> lo recibiste al crear tu cuenta.</span></li>
            <li style={{ display: "flex", gap: 10, alignItems: "flex-start" }}><ShieldCheck size={18} style={{ flexShrink: 0, marginTop: 2 }} /><span><strong>Privado:</strong> solo tú puedes usar tu código.</span></li>
          </ul>
        </div>
        <p style={{ fontSize: 12, opacity: 0.8 }}>¿Aún no tienes cuenta? Regístrate gratis y recibe tu código al instante.</p>
      </div>
      <div className="auth-form">
        <h1>Entrar</h1>
        <p className="sub">Accede con tu código personal. ¿No tienes cuenta? <Link to="/registro">Créala gratis</Link></p>
        <form onSubmit={onSubmit} className="form-stack">
          <div className="field"><label>Tu código personal</label><input className="input" placeholder="Pega aquí tu código" value={usuarioId} onChange={(e) => setUsuarioId(e.target.value)} /></div>
          <button className="btn btn-primary" type="submit" disabled={loading || !usuarioId}>{loading ? "Verificando…" : "Entrar →"}</button>
          {error && <span className="err">{error}</span>}
        </form>
      </div>
    </div>
  );
}
