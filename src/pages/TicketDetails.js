import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getTicketById } from "../mockApi";
import Timeline from "../components/Timeline";

const STATUS_COLORS = {
  Pending: "#d97706",
  "In Progress": "#2563eb",
  Open: "#16a34a",
  Solved: "#0f766e",
  Closed: "#6b7280"
};

export default function TicketDetails() {
  const { id } = useParams();
  const [t, setT] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const rec = await getTicketById(id);
        if (mounted) setT(rec);
      } catch {
        setErr("Ticket not found.");
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  const lastUpdated = useMemo(() => {
    if (!t?.steps?.length) return null;
    const last = t.steps[t.steps.length - 1];
    return new Date(last.ts).toLocaleString();
  }, [t]);

  const delays = useMemo(() => {
    return (t?.steps || []).filter(s => s.delayReason);
  }, [t]);

  if (err) return <p className="error">{err}</p>;
  if (!t) return <p>Loading…</p>;

  return (
    <>
      <div className="card">
        <Link to="/tickets" className="helper">← Back to search</Link>
        <h2 style={{marginTop:8}}>Ticket #{t.id}</h2>
        <div className="kv">
          <b>Guest</b><span>{t.guest}</span>
          <b>Itinerary</b><span>{t.itinerary}</span>
          <b>Subject</b><span>{t.subject}</span>
          <b>Status</b>
          <span style={{color: STATUS_COLORS[t.status] || "#333", fontWeight:700}}>
            {t.status}
          </span>
          <b>Notes</b><span>{t.notes}</span>
          <b>Last Updated</b><span>{lastUpdated || "—"}</span>
        </div>
      </div>

      {delays.length > 0 && (
        <div className="card">
          <h3>Delay Summary</h3>
          {delays.map((d, i) => (
            <div key={i} className="delay" style={{marginBottom:8}}>
              <b>{new Date(d.ts).toLocaleString()}</b> — {d.delayReason}
              {d.slaImpact ? ` • SLA: ${d.slaImpact}` : ""}
              {d.notes ? ` • ${d.notes}` : ""}
            </div>
          ))}
        </div>
      )}

      <div className="card">
        <h3>Timeline</h3>
        <Timeline steps={t.steps} />
      </div>
    </>
  );
}
