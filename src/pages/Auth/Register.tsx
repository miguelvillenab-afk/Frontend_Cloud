import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { House, Lock, Luggage } from "lucide-react";
import { getUser, loginUser } from "../../api/users";
import { useCreateUser } from "../../hooks/useUsers";
import { useAuthStore } from "../../stores/authStore";
import { useNavigate, Link } from "react-router-dom";

const schema = z.object({
  nombre: z.string().min(2, "Mínimo 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  rol: z.enum(["HUESPED", "ANFITRION"]),
});
type FormData = z.infer<typeof schema>;

export function Register() {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema), defaultValues: { rol: "HUESPED" },
  });
  const rol = watch("rol");
  const { mutateAsync, isPending, error } = useCreateUser();
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    await mutateAsync(data);
    // Auto-login directo: POST /login/ con las mismas credenciales y luego
    // GET /usuarios/{id} para hidratar el perfil completo (con metodos_pago).
    try {
      const session = await loginUser({ email: data.email, password: data.password });
      const user = await getUser(session.usuario_id);
      login(user, session.access_token);
      navigate("/perfil");
    } catch {
      navigate("/login");
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-side">
        <div>
          <span className="chip">CloudStay</span>
          <h2 style={{ marginTop: 14 }}>Crea tu cuenta y empieza a viajar o a ganar.</h2>
          <ul>
            <li style={{ display: "flex", gap: 10, alignItems: "flex-start" }}><House size={18} style={{ flexShrink: 0, marginTop: 2 }} /><span><strong>Anfitrión:</strong> publica tu espacio y recibe reservas.</span></li>
            <li style={{ display: "flex", gap: 10, alignItems: "flex-start" }}><Luggage size={18} style={{ flexShrink: 0, marginTop: 2 }} /><span><strong>Huésped:</strong> reserva en 2 clics y deja reseñas.</span></li>
            <li style={{ display: "flex", gap: 10, alignItems: "flex-start" }}><Lock size={18} style={{ flexShrink: 0, marginTop: 2 }} /><span><strong>Seguro:</strong> tus datos y pagos siempre protegidos.</span></li>
          </ul>
        </div>
        <p style={{ fontSize: 12, opacity: 0.8 }}>Al registrarte aceptas nuestros términos y política de privacidad.</p>
      </div>
      <div className="auth-form">
        <h1>Crear cuenta</h1>
        <p className="sub">¿Quieres viajar o publicar tu espacio? Elige tu perfil. ¿Ya tienes cuenta? <Link to="/login">Entra aquí</Link></p>
        <div className="role-toggle">
          <button type="button" className={rol === "HUESPED" ? "on-HUESPED" : ""} onClick={() => setValue("rol", "HUESPED")}><Luggage size={15} style={{ verticalAlign: -2 }} /> Huésped</button>
          <button type="button" className={rol === "ANFITRION" ? "on-ANFITRION" : ""} onClick={() => setValue("rol", "ANFITRION")}><House size={15} style={{ verticalAlign: -2 }} /> Anfitrión</button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="form-stack" style={{ marginTop: 16 }}>
          <div className="field"><label>Nombre completo</label><input className={`input ${errors.nombre ? "input-err" : ""}`} placeholder="Ej. Ana Quispe" {...register("nombre")} />{errors.nombre && <span className="err">{errors.nombre.message}</span>}</div>
          <div className="field"><label>Email</label><input className={`input ${errors.email ? "input-err" : ""}`} placeholder="ana@email.com" {...register("email")} />{errors.email && <span className="err">{errors.email.message}</span>}</div>
          <div className="field"><label>Contraseña</label><input className={`input ${errors.password ? "input-err" : ""}`} type="password" placeholder="••••••••" {...register("password")} />{errors.password && <span className="err">{errors.password.message}</span>}</div>
          <button className="btn btn-brand" type="submit" disabled={isPending}>{isPending ? "Creando cuenta…" : "Crear cuenta →"}</button>
          {error && <span className="err">{(error as Error).message}</span>}
        </form>
      </div>
    </div>
  );
}
