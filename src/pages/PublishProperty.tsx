export function PublishProperty() {
  return (
    <div>
      <div className="section-title"><div><h2>Publica tu espacio</h2><p>Completa los datos y empieza a recibir reservas hoy mismo.</p></div></div>
      <div className="detail-grid">
        <div className="panel">
          <div className="form-stack">
            <div className="field"><label>Título</label><input className="input" placeholder="Ej. Loft con terraza en Barranco" /></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="field"><label>Ciudad</label><input className="input" placeholder="Lima" /></div>
              <div className="field"><label>Capacidad</label><input className="input" type="number" placeholder="4" /></div>
            </div>
            <div className="field"><label>Precio por noche (USD)</label><input className="input" type="number" placeholder="85" /></div>
            <div className="field"><label>Descripción</label><textarea className="input" rows={4} placeholder="Describe tu espacio, reglas, amenities…" /></div>
            <button className="btn btn-brand">Publicar alojamiento →</button>
          </div>
        </div>
        <div className="panel">
          <h3>💡 Tips para anfitriones top</h3>
          <div className="divider" />
          <p style={{ fontSize: 14 }}>📸 Sube 5+ fotos con luz natural — +40% reservas.</p>
          <p style={{ fontSize: 14, marginTop: 8 }}>💰 Precio sugerido en tu zona: <strong>$68 / noche</strong>.</p>
          <p style={{ fontSize: 14, marginTop: 8 }}>⚡ Responde en &lt;1h para el badge Superhost.</p>
          <div className="api-note">Podrás editar o pausar tu publicación cuando quieras desde tu panel.</div>
        </div>
      </div>
    </div>
  );
}
