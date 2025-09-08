import { useState } from "react";
import Progress from "../components/Progress";
// ⬇️ CHANGE THIS LINE
import { getRefundByItineraryAndEmail } from "../mockApi";

export default function RefundTracker() {
  const [itinerary, setItinerary] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  const checkRefund = async () => {
    setLoading(true); setErr(""); setData(null);
    try {
      // ⬇️ CHANGE THIS CALL
      const res = await getRefundByItineraryAndEmail(itinerary, email);
      setData(res);
    } catch {
      setErr("We couldn’t find that record. Check the itinerary and email.");
    } finally { setLoading(false); }
  };

  return (
    <div>
      <h2>Refund Tracker</h2>
      <div className="card">
        <input className="input" placeholder="Itinerary" value={itinerary} onChange={e=>setItinerary(e.target.value)} />
        <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <button className="btn" disabled={!itinerary || !email || loading} onClick={checkRefund}>
          {loading ? "Loading..." : "Check Refund"}
        </button>
        {err && <p className="error">{err}</p>}
        <p className="helper">Try: <b>H1258895 / guest@example.com</b> or <b>G7788123 / val@example.com</b></p>
      </div>

      {data && (
        <div className="card">
          <h3>Booking: {data.hotelName}</h3>
          <p><b>Itinerary:</b> {data.itinerary}</p>
          <p><b>Status:</b> {data.bookingStatus}</p>
          <p><b>Refund:</b> ${Number(data.refund.amount).toFixed(2)} via {data.refund.method}</p>
          <Progress current={data.refund.status} />
        </div>
      )}
    </div>
  );
}
