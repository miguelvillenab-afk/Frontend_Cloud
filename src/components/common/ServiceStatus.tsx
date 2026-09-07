const services = [
  { name: "Users :8000", ok: true, label: "Swagger live" },
  { name: "Properties :8001", ok: false, label: "Mock UI" },
  { name: "Reservations :8002", ok: false, label: "Mock UI" },
  { name: "Dashboard :8003", ok: false, label: "Mock UI" },
  { name: "Analytics :8004", ok: false, label: "Mock UI" },
];

export function ServiceStatus() {
  return (
    <div className="svc">
      {services.map((s) => (
        <span key={s.name} className="svc-item">
          <span className={`dot ${s.ok ? "dot-ok" : "dot-pending"}`} />
          {s.name} · {s.label}
        </span>
      ))}
    </div>
  );
}
