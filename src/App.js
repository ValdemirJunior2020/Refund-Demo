import { useEffect, useMemo, useState } from "react";
import "./index.css";
import { fetchRefundStatus } from "./mockApi";
import Progress from "./components/Progress";

export default function App() {
  // Pre-fill from query string for easy demo links
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const [itinerary, setItinerary] = useState(params.get("itinerary") || "");
  const [email, setEmail] = useState(params.get("email") || "");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  // Auto-run if both provided in URL (demo share link)
  useEffect(() => {
    if (itinerary && email) handleCheck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCheck() {
    setLoading(true); setErr(""); setData(null);
    try {
      const res = await fetchRefundStatus({ itinerary, email });
      setData(res);
    } catch {
      setErr("We couldn’t find that record. Check the itinerary and email.");
    } finally {
      setLoading(false);
    }
  }

  function copyDemoLink() {
    const url = `${window.location.origin}?itinerary=${encodeURIComponent(itinerary)}&email=${encodeURIComponent(email)}`;
    navigator.clipboard.writeText(url);
    alert("Demo link copied!");
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Track My Refund</h1>
        <span className="badge">Demo • Frontend only</span>
      </div>
      <p className="helper">
        Enter the <b>Itinerary</b> and <b>Email</b> used when booking to see refund progress.
      </p>

      <div className="card">
        <div className="row" style={{gridTemplateColumns: "1fr 1fr"}}>
          <input
            className="input"
            placeholder="Itinerary (e.g., H1258895)"
            value={itinerary}
            onChange={e=>setItinerary(e.target.value)}
          />
          <input
            className="input"
            placeholder="Email (e.g., guest@example.com)"
            value={email}
            onChange={e=>setEmail(e.target.value)}
          />
        </div>

        <div style={{display:"flex", gap:12, marginTop:12}}>
          <button className="btn" disabled={!itinerary || !email || loading} onClick={handleCheck}>
            {loading ? "Loading..." : "Check Refund Status"}
          </button>
          <button className="copy" onClick={copyDemoLink} title="Copy a shareable demo URL">
            Copy demo link
          </button>
        </div>

        <hr className="sep" />

        {/* Quick demo presets */}
        <div className="helper">
          Try presets:&nbsp;
          <button className="copy" onClick={() => {setItinerary("H1258895"); setEmail("guest@example.com");}}>
            H1258895 / guest@example.com
          </button>
          &nbsp;or&nbsp;
          <button className="copy" onClick={() => {setItinerary("G7788123"); setEmail("val@example.com");}}>
            G7788123 / val@example.com
          </button>
        </div>

        {err && <p className="error" style={{marginTop:12}}>{err}</p>}
      </div>

      {data && (
        <>
          <div className="card">
            <h2>Booking</h2>
            <div className="kv">
              <b>Hotel</b> <span>{data.hotelName}</span>
              <b>Dates</b> <span>{data.checkIn} → {data.checkOut}</span>
              <b>Itinerary</b> <span className="pill">{data.itinerary}</span>
              <b>Status</b> <span>{data.bookingStatus}</span>
            </div>
          </div>

          <div className="card">
            <h2>Refund</h2>
            {!data.refund ? (
              <p>No refund on file.</p>
            ) : (
              <>
                <div className="kv" style={{marginBottom:12}}>
                  <b>Amount</b> <span>${Number(data.refund.amount).toFixed(2)}</span>
                  <b>Method</b> <span>{data.refund.method}</span>
                  <b>ETA</b> <span>{data.refund.eta || "—"}</span>
                </div>
                <Progress current={data.refund.status} />
                <hr className="sep" />
                <div>
                  <b>Timeline</b>
                  <ul className="helper" style={{marginTop:8}}>
                    {(data.refund.transactions || []).map(t => (
                      <li key={t.ts}>{new Date(t.ts).toLocaleString()} — {t.event}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>

          <div className="card footer-note">
            <b>What the steps mean</b><br/>
            <b>Requested</b>: We asked the hotel/processor to issue a refund. &nbsp;
            <b>Approved</b>: Approved by policy or manager. &nbsp;
            <b>Processed</b>: Sent to the bank/processor. &nbsp;
            <b>Paid</b>: Landed on card/account (banks may take 1–10 business days).
          </div>
        </>
      )}
    </div>
  );
}
