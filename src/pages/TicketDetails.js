import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getTicketById } from "../mockApi";
import Timeline from "../components/Timeline";
import jsPDF from "jspdf";

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

  function exportPDF() {
    if (!t) return;
    const doc = new jsPDF();
    doc.text(`Ticket ${t.id}`, 10, 10);
    doc.text(`Guest: ${t.guest}`, 10, 20);
    doc.text(`Itinerary: ${t.itinerary}`, 10, 30);
    doc.text(`Status: ${t.status}`, 10, 40);
    doc.text("Timeline:", 10, 50);
    (t.steps || []).forEach((s, i) => {
      doc.text(
        `${new Date(s.ts).toLocaleString()} - ${s.event} (${s.actor})`,
        10,
        60 + i*10
      );
    });
    doc.save(`ticket_${t.id}.pdf`);
  }

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
        </div>
      </div>

      <div className="card">
        <h3>Timeline</h3>
        <Timeline steps={t.steps} />
      </div>

      <div className="card">
        <h3>Quick Actions</h3>
        <button className="btn" onClick={()=>alert("Escalated!")}>Escalate</button>
        <button className="btn" style={{marginLeft:8}} onClick={()=>alert("Guest emailed!")}>Email Guest</button>
        <button className="btn" style={{marginLeft:8}} onClick={exportPDF}>Download PDF</button>
      </div>
    </>
  );
}
