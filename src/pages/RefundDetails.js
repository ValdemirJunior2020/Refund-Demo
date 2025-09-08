import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { getRefundByItineraryAndEmail, getRefundByItinerary } from "../mockApi";
import ProgressBar from "../components/ProgressBar";
import Timeline from "../components/Timeline";
import Confetti from "react-confetti";
import jsPDF from "jspdf";

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

  function exportPDF() {
    if (!data) return;
    const doc = new jsPDF();
    doc.text(`Refund Details for ${data.guest || "Guest"}`, 10, 10);
    doc.text(`Itinerary: ${data.itinerary}`, 10, 20);
    doc.text(`Hotel: ${data.hotelName}`, 10, 30);
    doc.text(`Status: ${data.refund.status}`, 10, 40);
    doc.text("Timeline:", 10, 50);
    (data.refund.steps || []).forEach((s, i) => {
      doc.text(
        `${new Date(s.ts).toLocaleString()} - ${s.event} (${s.actor})`,
        10,
        60 + i*10
      );
    });
    doc.save(`refund_${data.itinerary}.pdf`);
  }

  if (err) return <p className="error">{err}</p>;
  if (!data) return <p>Loading…</p>;

  return (
    <>
      {data.refund.status === "Paid" && <Confetti />}

      <div className="card">
        <Link to="/refund" className="helper">← Back to search</Link>
        <h2 style={{marginTop:8}}>Hi {data.email}, here’s your refund</h2>
        <div className="kv">
          <b>Itinerary</b><span className="badge">{data.itinerary}</span>
          <b>Hotel</b><span>{data.hotelName}</span>
          <b>Dates</b><span>{data.checkIn} → {data.checkOut}</span>
          <b>Status</b><span>{data.bookingStatus}</span>
        </div>
      </div>

      <div className="card">
        <h3>Refund Progress</h3>
        <ProgressBar current={data.refund.status} />

        <div className="kv" style={{marginBottom:12}}>
          <b>Amount</b><span>${Number(data.refund.amount).toFixed(2)}</span>
          <b>Method</b><span>{data.refund.method}</span>
          <b>ETA</b><span>{data.refund.eta || "—"}</span>
          <b>Status</b><span>{data.refund.status}</span>
        </div>

        <button className="btn" onClick={exportPDF}>Download PDF</button>
      </div>

      <div className="card">
        <h3>Timeline</h3>
        <Timeline steps={data.refund.steps} />
      </div>
    </>
  );
}
