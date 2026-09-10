import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { ClipboardList, Eye, EyeOff, KeyRound, Mail, ShieldCheck } from "lucide-react";
import { getUser } from "../../api/users";
import { useLogin } from "../../hooks/useUsers";
import { useAuthStore } from "../../stores/authStore";

const schema = z.object({
  email: z.string().email("Ingresa un email válido"),
  password: z.string().min(1, "Ingresa tu contraseña"),
});
type FormData = z.infer<typeof schema>;

export function Login() {
  const [showPass, setShowPass] = useState(false);
  const [searchParams] = useSearchParams();
  const expired = searchParams.get("expired") === "1";
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });
  const { mutateAsync, isPending, error } = useLogin();
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    // POST /login/ → {access_token, usuario_id, rol} + GET perfil completo
    const session = await mutateAsync(data);
    const user = await getUser(session.usuario_id);
    login(user, session.access_token);
    navigate("/perfil");
  };

  return (
    <div className="auth-wrap">
      <div className="auth-side">
        <div>
          <span className="chip">Bienvenido de vuelta</span>
          <h2 style={{ marginTop: 14 }}>Tu próxima estadía te espera.</h2>
          <ul>
            <li style={{ display: "flex", gap: 10, alignItems: "flex-start" }}><KeyRound size={18} style={{ flexShrink: 0, marginTop: 2 }} /><span><strong>Acceso rápido:</strong> entra con tu email y contraseña.</span></li>
            <li style={{ display: "flex", gap: 10, alignItems: "flex-start" }}><ClipboardList size={18} style={{ flexShrink: 0, marginTop: 2 }} /><span><strong>¿Olvidaste tu clave?</strong> usa el mismo email con el que te registraste.</span></li>
            <li style={{ display: "flex", gap: 10, alignItems: "flex-start" }}><ShieldCheck size={18} style={{ flexShrink: 0, marginTop: 2 }} /><span><strong>Privado:</strong> tu sesión se cierra sola al expirar.</span></li>
          </ul>
        </div>
        <p style={{ fontSize: 12, opacity: 0.8 }}>¿Aún no tienes cuenta? Regístrate gratis en menos de un minuto.</p>
      </div>
      <div className="auth-form">
        <h1>Entrar</h1>
        <p className="sub">Accede con tu email y contraseña. ¿No tienes cuenta? <Link to="/registro">Créala gratis</Link></p>
        {expired && <p className="err" style={{ background: "#fff7e6", border: "1px solid #ffe1a8", borderRadius: 10, padding: "8px 12px" }}>Tu sesión expiró, entra de nuevo.</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="form-stack">
          <div className="field">
            <label><Mail size={14} style={{ verticalAlign: -2 }} /> Email</label>
            <input className={`input ${errors.email ? "input-err" : ""}`} placeholder="ana@email.com" autoComplete="email" {...register("email")} />
            {errors.email && <span className="err">{errors.email.message}</span>}
          </div>
          <div className="field">
            <label>Contraseña</label>
            <div style={{ position: "relative" }}>
              <input className={`input ${errors.password ? "input-err" : ""}`} type={showPass ? "text" : "password"} placeholder="••••••••" autoComplete="current-password" {...register("password")} style={{ paddingRight: 42 }} />
              <button type="button" onClick={() => setShowPass((v) => !v)} aria-label={showPass ? "Ocultar" : "Mostrar"} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: 0, cursor: "pointer", color: "var(--muted)" }}>
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <span className="err">{errors.password.message}</span>}
          </div>
          <button className="btn btn-primary" type="submit" disabled={isPending}>{isPending ? "Verificando…" : "Entrar →"}</button>
          {error && <span className="err">{(error as Error).message}</span>}
        </form>
      </div>
    </div>
  );
}
