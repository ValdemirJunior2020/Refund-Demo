import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRefundByItineraryAndEmail } from "../mockApi";

export default function RefundSearch() {
  const [itinerary, setItinerary] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  async function onSubmit(e){
    e.preventDefault();
    setLoading(true); setErr("");
    try {
      await getRefundByItineraryAndEmail(itinerary, email); // just validate
      navigate(`/refund/${encodeURIComponent(itinerary)}?email=${encodeURIComponent(email)}`);
    } catch {
      setErr("We couldn’t find that record. Check the itinerary and email.");
    } finally { setLoading(false); }
  }

  return (
    <>
      <h2>Refund Tracker</h2>
      <form className="card" onSubmit={onSubmit} style={{display:"grid", gap:12}}>
        <input className="input" placeholder="Itinerary (e.g., H1258895)" value={itinerary} onChange={e=>setItinerary(e.target.value)} />
        <input className="input" placeholder="Email (e.g., guest@example.com)" value={email} onChange={e=>setEmail(e.target.value)} />
        <button className="btn" disabled={!itinerary || !email || loading}>
          {loading ? "Loading..." : "Track Refund"}
        </button>
        {err && <p className="error">{err}</p>}
        <p className="helper">Try: <b>H1258895 / guest@example.com</b> or <b>G7788123 / val@example.com</b></p>
      </form>
    </>
  );
}
