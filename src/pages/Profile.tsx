import { useState } from "react";
import { useUser, useCreateMetodoPago } from "../hooks/useUsers";
import { useAuthStore } from "../stores/authStore";

export function Profile() {
  const { user, setUser } = useAuthStore();
  const { data, isLoading, error, refetch } = useUser(user?.id_usuario ?? null);
  const { mutateAsync, isPending } = useCreateMetodoPago();
  const [tipo, setTipo] = useState("Visa");
  const [last4, setLast4] = useState("");
  const [msg, setMsg] = useState("");

  if (!user) return <div className="panel">No autenticado. Ve a /registro o /login</div>;
  if (isLoading) return <div className="panel">Cargando perfil…</div>;
  if (error) return <div className="panel">Error: {(error as Error).message} — ¿MS en :8000?</div>;

  const addCard = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg("");
    try {
      const card = await mutateAsync({ usuario_id: user.id_usuario, payload: { tipo_tarjeta: tipo, ultimos_cuatro: last4 } });
      setUser({ ...user, metodos_pago: [...(data?.metodos_pago ?? []), card] });
      setLast4(""); setMsg("Método agregado ✓"); refetch();
    } catch (err) { setMsg((err as Error).message); }
  };

  return (
    <div>
      <div className="section-title"><div><h2>Mi perfil</h2><p>Sincronizado con <code>GET /usuarios/:id</code> · PostgreSQL</p></div><span className={`role-badge role-${user.rol}`}>{user.rol}</span></div>
      <div className="profile-grid">
        <div className="panel profile-card">
          <div className="avatar-lg">{user.nombre.charAt(0).toUpperCase()}</div>
          <h3 style={{ marginTop: 12 }}>{data?.nombre}</h3>
          <p style={{ color: "var(--muted)", fontSize: 13 }}>{data?.email}</p>
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>Miembro desde {data?.fecha_registro?.slice(0, 10)}</p>
          <div className="divider" />
          <p style={{ fontSize: 12, color: "var(--muted)", wordBreak: "break-all" }}>ID<br /><code style={{ fontSize: 11 }}>{user.id_usuario}</code></p>
        </div>
        <div>
          <div className="panel">
            <h3>💳 Métodos de pago ({data?.metodos_pago?.length ?? 0})</h3>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
              {(data?.metodos_pago ?? []).map((m) => (
                <span key={m.id_metodo} className="amen">💳 {m.tipo_tarjeta} •• {m.ultimos_cuatro}</span>
              ))}
              {(data?.metodos_pago ?? []).length === 0 && <span style={{ color: "var(--muted)", fontSize: 14 }}>Sin tarjetas aún — agrega una abajo.</span>}
            </div>
            <form onSubmit={addCard} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 10, marginTop: 14 }}>
              <select className="input" value={tipo} onChange={(e) => setTipo(e.target.value)}>
                <option>Visa</option><option>Mastercard</option><option>Amex</option>
              </select>
              <input className="input" placeholder="Últimos 4" maxLength={4} value={last4} onChange={(e) => setLast4(e.target.value.replace(/\D/g, ""))} />
              <button className="btn btn-primary" disabled={isPending || last4.length !== 4}>{isPending ? "…" : "+ Agregar"}</button>
            </form>
            {msg && <p style={{ fontSize: 13, marginTop: 8 }}>{msg}</p>}
            <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}><code>POST /usuarios/:id/metodos-pago/</code></p>
          </div>
          <div className="panel" style={{ marginTop: 14 }}>
            <h3>Respuesta live del MS</h3>
            <pre className="json" style={{ marginTop: 10 }}>{JSON.stringify(data, null, 2)}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
