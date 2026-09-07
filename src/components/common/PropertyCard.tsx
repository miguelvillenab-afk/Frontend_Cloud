import { Link } from "react-router-dom";

interface Props {
  id: string;
  titulo: string;
  ciudad: string;
  precio_noche: number;
  imagen_url?: string;
  rating?: number;
  reviews?: number;
  capacidad?: number;
  tag?: string;
}

export function PropertyCard(p: Props) {
  return (
    <Link to={`/propiedad/${p.id}`} className="card">
      <div className="card-img">
        <img src={p.imagen_url || "https://picsum.photos/seed/" + p.id + "/600/450"} alt={p.titulo} loading="lazy" />
        <button className="heart" onClick={(e) => { e.preventDefault(); }} aria-label="favorito">♡</button>
        <span className="price-tag">${p.precio_noche} / noche</span>
        {p.tag && <span style={{ position: "absolute", top: 10, left: 10, background: "#fff", fontSize: 11, fontWeight: 800, padding: "5px 9px", borderRadius: 999 }}>{p.tag}</span>}
      </div>
      <div className="card-body">
        <div className="card-loc"><span>{p.ciudad}</span><span className="rating">★ {p.rating?.toFixed(2) ?? "4.80"}</span></div>
        <div className="card-sub">{p.titulo} · {p.capacidad ?? 2} huéspedes</div>
        <div className="card-sub">{p.reviews ?? 40} reseñas</div>
        <div className="card-price"><strong>${p.precio_noche}</strong> noche</div>
      </div>
    </Link>
  );
}
