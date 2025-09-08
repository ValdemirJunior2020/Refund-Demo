import { useState } from "react";

const STATUS_COLORS = {
  Pending: "#d97706",      // amber
  "In Progress": "#2563eb",// blue
  Open: "#16a34a",         // green
  Solved: "#0f766e",       // teal
  Closed: "#6b7280"        // gray
};

const MOCK_TICKETS = [
  {
    id: "5508809",
    itinerary: "H11903226",
    guest: "Russell Steele",
    subject: "Receipt Needed",
    status: "Pending",
    notes: "Guest requested an itemized receipt.",
    timeline: [
      { date: "2025-08-28 17:46", action: "Guest requested a receipt via email." },
      { date: "2025-08-28 17:48", action: "Ticket created and assigned to BUWEL Support." },
      { date: "2025-08-29 09:15", action: "Agent Farida T. replied: 'We are reviewing your request, update coming soon.'" }
    ]
  },
  {
    id: "5508810",
    itinerary: "H1258895",
    guest: "Emily Hawkins",
    subject: "Hotel Quality Concern",
    status: "Open",
    notes: "Guest reported cleanliness issues at check-in.",
    timeline: [
      { date: "2025-09-01 14:22", action: "Guest called to report hotel quality issue." },
      { date: "2025-09-01 14:30", action: "Ticket logged and assigned to QA Review team." }
    ]
  },
  {
    id: "5509001",
    itinerary: "H22233444",
    guest: "Daniel Roberts",
    subject: "Refund Missing",
    status: "In Progress",
    notes: "Guest says refund hasn’t arrived after cancellation.",
    timeline: [
      { date: "2025-09-05 10:05", action: "Guest reported missing refund for canceled booking." },
      { date: "2025-09-05 10:12", action: "Ticket created and escalated to Refunds Team." },
      { date: "2025-09-06 09:00", action: "Refund approved by supplier." },
      { date: "2025-09-06 16:30", action: "Refund processing initiated (3–5 business days)." }
    ]
  }
];

export default function TicketTracker() {
  const [selected, setSelected] = useState(MOCK_TICKETS[0]);

  return (
    <div>
      <h2>Ticket Tracker</h2>

      <div className="card" style={{overflowX:"auto"}}>
        <table style={{width:"100%", borderCollapse:"collapse"}}>
          <thead>
            <tr style={{textAlign:"left"}}>
              <th>ID</th>
              <th>Itinerary</th>
              <th>Guest</th>
              <th>Subject</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_TICKETS.map((t) => (
              <tr
                key={t.id}
                onClick={() => setSelected(t)}
                style={{ cursor: "pointer", borderTop: "1px solid #eee" }}
              >
                <td>{t.id}</td>
                <td>{t.itinerary}</td>
                <td>{t.guest}</td>
                <td>{t.subject}</td>
                <td>
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: 999,
                      background: "#fff",
                      border: `1px solid ${STATUS_COLORS[t.status] || "#999"}`,
                      color: STATUS_COLORS[t.status] || "#333",
                      fontSize: 12,
                      fontWeight: 700
                    }}
                  >
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="card">
          <h3 style={{marginBottom:8}}>Ticket #{selected.id}</h3>
          <div style={{display:"grid", gridTemplateColumns:"160px 1fr", gap: "8px 12px"}}>
            <b>Guest</b><span>{selected.guest}</span>
            <b>Itinerary</b><span>{selected.itinerary}</span>
            <b>Subject</b><span>{selected.subject}</span>
            <b>Status</b>
            <span style={{color: STATUS_COLORS[selected.status] || "#333", fontWeight:700}}>
              {selected.status}
            </span>
            <b>Notes</b><span>{selected.notes}</span>
          </div>

          <h4 style={{marginTop:16}}>Timeline</h4>
          <ul style={{marginTop:8}}>
            {selected.timeline.map((step, i) => (
              <li key={`${selected.id}-${i}`}>
                <b>{step.date}</b> — {step.action}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
