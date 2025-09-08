import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { getRefundByItineraryAndEmail, getRefundByItinerary } from "../mockApi";
import Progress from "../components/Progress";
import Timeline from "../components/Timeline";

export default function RefundDetails() {
  const { itinerary } = useParams();
  const [sp] = useSearchParams();
  const email = sp.get("email");
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const rec = email
          ? await getRefundByItineraryAndEmail(itinerary, email)
          : await getRefundByItinerary(itinerary);
        if (mounted) setData(rec);
      } catch {
        setErr("Record not found.");
      }
    })();
    return () => { mounted = false; };
  }, [itinerary, email]);

  const lastUpdated = useMemo(() => {
    if (!data?.refund?.steps?.length) return null;
    const last = data.refund.steps[data.refund.steps.length - 1];
    return new Date(last.ts).toLocaleString();
  }, [data]);

  const delays = useMemo(() => {
    return (data?.refund?.steps || []).filter(s => s.delayReason);
  }, [data]);

  if (err) return <p className="error">{err}</p>;
  if (!data) return <p>Loading…</p>;

  return (
    <>
      <div className="card">
        <Link to="/refund" className="helper">← Back to search</Link>
        <h2 style={{marginTop:8}}>Refund Details</h2>
        <div className="kv">
          <b>Itinerary</b><span className="badge">{data.itinerary}</span>
          <b>Email</b><span>{data.email}</span>
          <b>Hotel</b><span>{data.hotelName}</span>
          <b>Dates</b><span>{data.checkIn} → {data.checkOut}</span>
          <b>Booking Status</b><span>{data.bookingStatus}</span>
          <b>Last Updated</b><span>{lastUpdated || "—"}</span>
        </div>
      </div>

      <div className="card">
        <h3>Refund</h3>
        {!data.refund ? (
          <p>No refund on file.</p>
        ) : (
          <>
            <div className="kv" style={{marginBottom:12}}>
              <b>Amount</b><span>${Number(data.refund.amount).toFixed(2)}</span>
              <b>Method</b><span>{data.refund.method}</span>
              <b>ETA</b><span>{data.refund.eta || "—"}</span>
              <b>Status</b><span>{data.refund.status}</span>
            </div>
            <Progress current={data.refund.status} />

            {delays.length > 0 && (
              <>
                <h4 style={{marginTop:16}}>Delay Summary</h4>
                {delays.map((d, i) => (
                  <div key={i} className="delay" style={{marginBottom:8}}>
                    <b>{new Date(d.ts).toLocaleString()}</b> — {d.delayReason}
                    {d.slaImpact ? ` • SLA: ${d.slaImpact}` : ""}
                    {d.notes ? ` • ${d.notes}` : ""}
                  </div>
                ))}
              </>
            )}

            <h4 style={{marginTop:16}}>Timeline</h4>
            <Timeline steps={data.refund.steps} />
          </>
        )}
      </div>
    </>
  );
}
