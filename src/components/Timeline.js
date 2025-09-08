export default function Timeline({ steps = [] }) {
  if (!steps.length) return <p className="helper">No history yet.</p>;

  return (
    <ul style={{marginTop:8}}>
      {steps.map((s, i) => (
        <li key={`${s.ts}-${i}`} style={{marginBottom:8}}>
          <div><b>{new Date(s.ts).toLocaleString()}</b> — {s.event}</div>
          <div className="helper">
            <span className="badge">Actor: {s.actor}</span>
            &nbsp;•&nbsp;
            <span className="badge">Channel: {s.channel}</span>
          </div>
          {s.notes && <div className="helper">Notes: {s.notes}</div>}
          {s.delayReason && (
            <div className="delay">
              ⏱ Delay reason: <b>{s.delayReason}</b>
              {s.slaImpact ? ` • SLA: ${s.slaImpact}` : ""}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
