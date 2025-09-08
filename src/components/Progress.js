export default function Progress({ current }) {
  const steps = ["Requested", "Approved", "Processed", "Paid"];
  const idx = steps.indexOf(current);
  return (
    <div className="progress">
      {steps.map((s, i) => (
        <span key={s} className={`step ${i <= idx ? "active" : ""}`}>{s}</span>
      ))}
    </div>
  );
}
