import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTicketById } from "../mockApi";

export default function TicketSearch() {
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  async function onSubmit(e){
    e.preventDefault();
    setLoading(true); setErr("");
    try {
      await getTicketById(id); // validate exists
      navigate(`/tickets/${encodeURIComponent(id)}`);
    } catch {
      setErr("Ticket not found.");
    } finally { setLoading(false); }
  }

  return (
    <>
      <h2>Ticket Tracker</h2>
      <form className="card" onSubmit={onSubmit} style={{display:"grid", gap:12}}>
        <input className="input" placeholder="Ticket ID (e.g., 5509001)" value={id} onChange={e=>setId(e.target.value)} />
        <button className="btn" disabled={!id || loading}>
          {loading ? "Loading..." : "Open Ticket"}
        </button>
        {err && <p className="error">{err}</p>}
        <p className="helper">Try examples: <b>5508809</b>, <b>5508810</b>, <b>5509001</b></p>
      </form>
    </>
  );
}
