export function StatCard({ label, value, sub, color }: { label: string; value: string; sub: string; color?: string }) {
  return (
    <div className="stat" style={color ? { ["--accent" as string]: color } : undefined}>
      <small>{label}</small>
      <strong>{value}</strong>
      <span>{sub}</span>
    </div>
  );
}
