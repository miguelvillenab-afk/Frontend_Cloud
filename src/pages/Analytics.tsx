import { StatCard } from "../components/common/StatCard";

export function Analytics() {
  return (
    <div>
      <div className="section-title"><div><h2>Analytics · Data + Athena</h2><p><code>GET /analytics/ocupacion</code> · <code>GET /analytics/ingresos</code> · Glue + S3 + SQL</p></div><span className="chip" style={{ background: "var(--ink)", border: 0 }}>● Live demo mock</span></div>
      <div className="stats">
        <StatCard label="Revenue YTD" value="$28.4k" sub="+24% YoY" color="#12805c" />
        <StatCard label="Noches vendidas" value="1,204" sub="20k rows test" color="#ff385c" />
        <StatCard label="ADR promedio" value="$74" sub="average daily rate" color="#008489" />
        <StatCard label="Top ciudad" value="Lima" sub="42% demanda" color="#ff8a00" />
      </div>
      <div className="detail-grid">
        <div className="panel">
          <h3>Ingresos mensuales (USD)</h3>
          <div className="bars">
            {[30, 45, 38, 55, 62, 78, 70, 92].map((v, i) => (
              <div key={i} className="bar" style={{ height: `${v}%` }}><span>{v * 40}</span></div>
            ))}
          </div>
          <div className="bar-labels">{["E", "F", "M", "A", "M", "J", "J", "A"].map((d, i) => (<span key={i}>{d}</span>))}</div>
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 10 }}><code>GET /analytics/ingresos?agrupacion=mensual</code> — Athena JOIN reservas × propiedades.</p>
        </div>
        <div className="panel">
          <h3>Top propiedades por reservas</h3>
          <table className="table">
            <thead><tr><th>#</th><th>Propiedad</th><th>Reservas</th></tr></thead>
            <tbody>
              {[["Cabaña Valle Sagrado", 84], ["Loft Miraflores", 71], ["Villa Paracas", 63], ["Casa Cusco", 52]].map(([n, r], i) => (
                <tr key={n as string}><td><strong>{i + 1}</strong></td><td>{n}</td><td><strong>{r}</strong></td></tr>
              ))}
            </tbody>
          </table>
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 10 }}><code>GET /analytics/top-propiedades?limit=10</code></p>
        </div>
      </div>
    </div>
  );
}
