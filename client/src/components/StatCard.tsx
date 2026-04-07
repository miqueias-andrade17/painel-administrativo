export function StatCard({ title, value, helper }: { title: string; value: string; helper: string }) {
  return (
    <div className="card stat-card">
      <div>
        <span className="eyebrow">{title}</span>
        <h3>{value}</h3>
      </div>
      <p>{helper}</p>
    </div>
  );
}
