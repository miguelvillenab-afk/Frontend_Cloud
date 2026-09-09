import { StatCard } from "../components/common/StatCard";

const rows = [
  { id: "RSV-1024", prop: "Loft moderno en Miraflores", city: "Lima", dates: "12 → 15 Sep", total: "$204", estado: "CONFIRMADA" as const },
  { id: "RSV-1023", prop: "Cabaña Valle Sagrado", city: "Urubamba", dates: "02 → 05 Oct", total: "$255", estado: "PENDIENTE" as const },
  { id: "RSV-1019", prop: "Villa Paracas", city: "Paracas", dates: "20 → 22 Ago", total: "$420", estado: "CONFIRMADA" as const },
];

export function Reservations() {
  return (
    <div>
      <div className="section-title"><div><h2>Mis viajes</h2><p>Todas tus reservas, fechas y comprobantes en un solo lugar.</p></div><button className="btn btn-primary">+ Nueva reserva</button></div>
      <div className="stats">
        <StatCard label="Viajes" value="3" sub="2 confirmados" color="#ff385c" />
        <StatCard label="Noches" value="8" sub="próximas 5" color="#008489" />
        <StatCard label="Gastado" value="$879" sub="este año" color="#ff8a00" />
        <StatCard label="Rating dado" value="4.9" sub="2 valoraciones" color="#12805c" />
      </div>
      <div className="panel" style={{ marginTop: 16 }}>
        <table className="table">
          <thead><tr><th>Reserva</th><th>Propiedad</th><th>Fechas</th><th>Total</th><th>Estado</th><th></th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td><strong>{r.id}</strong></td>
                <td>{r.prop}<br /><span style={{ color: "var(--muted)", fontSize: 12 }}>{r.city}</span></td>
                <td>{r.dates}</td><td><strong>{r.total}</strong></td>
                <td><span className={`status status-${r.estado}`}>{r.estado === "CONFIRMADA" ? "Confirmada" : r.estado === "PENDIENTE" ? "Pendiente" : "Cancelada"}</span></td>
                <td><button className="btn btn-ghost" style={{ padding: "7px 12px", fontSize: 12 }}>★ Valorar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 10 }}>¿Terminaste tu estadía? Deja una valoración para ayudar a otros viajeros.</p>
      </div>
    </div>
  );
}
