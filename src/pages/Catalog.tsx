import { useMemo, useState } from "react";
import { PropertyCard } from "../components/common/PropertyCard";
import { ServiceStatus } from "../components/common/ServiceStatus";
import { CATEGORIES, MOCK_PROPERTIES } from "../mocks/properties";

export function Catalog() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Todos");
  const [maxPrice, setMaxPrice] = useState("");

  const filtered = useMemo(() => {
    return MOCK_PROPERTIES.filter((p) => {
      if (q && !(p.titulo + p.ciudad).toLowerCase().includes(q.toLowerCase())) return false;
      if (maxPrice && p.precio_noche > Number(maxPrice)) return false;
      if (cat === "Lujo") return p.precio_noche > 120;
      if (cat === "Eco") return p.ciudad === "Iquitos" || p.tag === "Eco";
      if (cat === "Playa") return ["Paracas", "Lima"].includes(p.ciudad);
      return true;
    });
  }, [q, cat, maxPrice]);

  return (
    <div>
      <section className="hero">
        <div>
          <div className="hero-badges">
            <span className="chip">✦ Amplify + API Gateway</span>
            <span className="chip">5 microservicios</span>
            <span className="chip">20k registros</span>
          </div>
          <h1>Encuentra tu próximo alojamiento</h1>
          <p>Explora propiedades de anfitriones verificados. Reserva como huésped, publica y mide tu negocio como anfitrión, todo en una sola plataforma cloud.</p>
          <div className="hero-badges">
            <a href="/registro" className="btn btn-brand">Empezar gratis →</a>
            <a href="/analytics" className="btn" style={{ background: "rgba(255,255,255,0.14)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)" }}>Ver analytics</a>
          </div>
        </div>
        <div className="hero-card">
          <strong style={{ fontSize: 14 }}>Tu escapada en 3 pasos</strong>
          <div className="hero-stats">
            <div className="hero-stat"><strong>1.</strong><span>Regístrate como HUESPED o ANFITRION</span></div>
            <div className="hero-stat"><strong>2.</strong><span>Explora y reserva en segundos</span></div>
            <div className="hero-stat"><strong>3.</strong><span>Mide ocupación e ingresos</span></div>
          </div>
          <div className="divider" />
          <div style={{ display: "flex", gap: 8, fontSize: 13, color: "var(--muted)" }}>
            <span>★ 4.89 promedio</span><span>·</span><span>12k reservas</span><span>·</span><span>98% anfitriones top</span>
          </div>
        </div>
      </section>

      <div className="searchbar">
        <div><label>Destino</label><input placeholder="Lima, Cusco, Paracas…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <div><label>Precio máx.</label><input placeholder="$ 150" inputMode="numeric" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} /></div>
        <div><label>Categoría</label><input value={cat} readOnly placeholder="Elige abajo" /></div>
        <div><button className="search-btn" aria-label="buscar">⌕</button></div>
      </div>

      <ServiceStatus />

      <div className="cats">
        {CATEGORIES.map((c) => (
          <button key={c} className={`cat ${cat === c ? "active" : ""}`} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>

      <div className="section-title">
        <div><h2>{filtered.length} alojamientos disponibles</h2><p>Datos mock UI — <code>GET /propiedades</code> se conectará al Swagger real cuando el MS esté listo.</p></div>
        <span className="chip" style={{ background: "var(--ink)", border: 0 }}>Paginado · 20k stress</span>
      </div>

      <div className="grid">
        {filtered.map((p) => (
          <PropertyCard key={p.id} id={p.id} titulo={p.titulo} ciudad={p.ciudad} precio_noche={p.precio_noche} imagen_url={p.imagen_url} rating={p.rating} reviews={p.reviews} capacidad={p.capacidad} tag={p.tag} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="panel" style={{ marginTop: 20, textAlign: "center" }}>
          <h3>Sin resultados</h3>
          <p style={{ color: "var(--muted)" }}>Prueba con otro destino o sube el precio máximo.</p>
        </div>
      )}
    </div>
  );
}
