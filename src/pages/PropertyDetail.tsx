import { useParams, Link } from "react-router-dom";
import { MOCK_PROPERTIES } from "../mocks/properties";

export function PropertyDetail() {
  const { id } = useParams();
  const p = MOCK_PROPERTIES.find((x) => x.id === id) ?? MOCK_PROPERTIES[0];
  const imgs = [p.imagen_url!, "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80", "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"];

  return (
    <div>
      <Link to="/" className="btn btn-ghost">← Volver</Link>
      <h1 style={{ fontSize: 30, fontWeight: 900, marginTop: 14 }}>{p.titulo}</h1>
      <p style={{ color: "var(--muted)", fontSize: 14 }}>★ {p.rating} · {p.reviews} reseñas · {p.ciudad} · {p.direccion}</p>
      <div className="gallery">
        {imgs.map((src, i) => (<img key={i} src={src} alt={p.titulo} />))}
      </div>
      <div className="detail-grid">
        <div>
          <div className="panel">
            <h3>Descripción</h3>
            <p style={{ marginTop: 8, color: "var(--ink-2)" }}>{p.descripcion} Capacidad para {p.capacidad} huéspedes. Check-in flexible, wifi rápido y cocina equipada.</p>
            <div className="amenities">
              {["Wifi rápido", "Cocina", "Piscina", "Parking", "Pet friendly", "Vista top"].map((a) => (<span key={a} className="amen">✓ {a}</span>))}
            </div>
          </div>
          <div className="panel" style={{ marginTop: 14 }}>
            <h3>Reseñas recientes</h3>
            <div className="divider" />
            {[["Camila R.", "Lugar impecable, anfitrión muy atento. Volveré.", "5.0"], ["Diego T.", "Ubicación perfecta y fotos reales.", "4.9"]].map(([n, t, s]) => (
              <div key={n} style={{ padding: "10px 0", borderBottom: "1px solid var(--line)" }}>
                <strong style={{ fontSize: 14 }}>{n} · ★ {s}</strong>
                <p style={{ fontSize: 14, color: "var(--ink-2)" }}>{t}</p>
              </div>
            ))}
            <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 10 }}><code>POST /reservas/:id/valoracion</code> — Fase 3</p>
          </div>
        </div>
        <div className="panel booking">
          <div className="booking-price">${p.precio_noche} <span>/ noche</span></div>
          <div className="divider" />
          <div className="field"><label>Check-in</label><input className="input" type="date" /></div>
          <div className="field" style={{ marginTop: 10 }}><label>Check-out</label><input className="input" type="date" /></div>
          <div className="kv" style={{ marginTop: 12 }}><span>${p.precio_noche} × 3 noches</span><span>${p.precio_noche * 3}</span></div>
          <div className="kv"><span>Limpieza</span><span>$12</span></div>
          <div className="kv"><strong>Total</strong><strong>${p.precio_noche * 3 + 12}</strong></div>
          <Link to="/mis-reservas" className="btn btn-brand" style={{ width: "100%", marginTop: 14 }}>Reservar ahora</Link>
          <p style={{ fontSize: 12, color: "var(--muted)", textAlign: "center", marginTop: 8 }}><code>POST /reservas</code> → Fase 3</p>
        </div>
      </div>
    </div>
  );
}
