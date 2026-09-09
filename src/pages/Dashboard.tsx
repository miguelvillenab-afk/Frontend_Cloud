import { StatCard } from "../components/common/StatCard";

export function Dashboard() {
  return (
    <div>
      <div className="section-title"><div><h2>Resumen de tu actividad</h2><p>Tus ingresos, ocupación y reservas de un vistazo.</p></div><span className="chip" style={{ background: "var(--ink)", border: 0 }}>Setiembre 2026</span></div>
      <div className="stats">
        <StatCard label="Ingresos mes" value="$2,480" sub="+18% vs ago" color="#12805c" />
        <StatCard label="Ocupación" value="78%" sub="23/30 noches" color="#ff385c" />
        <StatCard label="Reservas" value="14" sub="3 pendientes" color="#008489" />
        <StatCard label="Rating" value="4.89" sub="312 reseñas" color="#ff8a00" />
      </div>
      <div className="detail-grid">
        <div className="panel">
          <h3>Ocupación últimos 7 días</h3>
          <div className="bars">
            {[60, 85, 45, 90, 70, 100, 78].map((v, i) => (
              <div key={i} className={`bar ${i % 2 ? "alt" : ""}`} style={{ height: `${v}%` }}><span>{v}%</span></div>
            ))}
          </div>
          <div className="bar-labels">{["L", "M", "X", "J", "V", "S", "D"].map((d) => (<span key={d}>{d}</span>))}</div>
        </div>
        <div className="panel">
          <h3>Top propiedades</h3>
          <div className="divider" />
          {[["Cabaña Valle Sagrado", "$920", "92%"], ["Loft Miraflores", "$810", "85%"], ["Villa Paracas", "$740", "71%"]].map(([n, m, o]) => (
            <div key={n} className="kv"><span>{n}<br /><span style={{ color: "var(--muted)", fontSize: 12 }}>Ocupación {o}</span></span><strong>{m}</strong></div>
          ))}
          <div className="api-note">Consejo: las propiedades con mejores fotos reservan 40% más.</div>
        </div>
      </div>
    </div>
  );
}
