import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const BOT = "bot";
const USER = "you";

const SUGGESTIONS = [
  { label: "Track my refund", text: "track refund" },
  { label: "Why is it delayed?", text: "why delayed" },
  { label: "Talk to an agent", text: "agent" },
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState([
    {
      from: BOT,
      text:
        "Hi! Need help with a refund or ticket? Try: 'track refund H1258895 guest@example.com' " +
        "or 'open ticket 5509001'.",
    },
  ]);
  const [typing, setTyping] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const endRef = useRef(null);

  // Auto-scroll to newest message
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, typing]);

  // Tiny intent engine
  const respond = async (raw) => {
    const text = raw.toLowerCase();
    setTyping(true);
    await new Promise((r) => setTimeout(r, 450)); // fake latency

    // route: track refund <itinerary> <email?>
    const trackRefund = text.match(/track refund\s+([a-z0-9]+)\s*([^\s]+@[^\s]+)?/i);
    if (trackRefund) {
      const itinerary = trackRefund[1];
      const email = (trackRefund[2] || "").trim();
      setMsgs((m) => [
        ...m,
        {
          from: BOT,
          text: `Got it. Opening refund details for ${itinerary}${
            email ? " (" + email + ")" : ""
          }…`,
        },
      ]);
      setTyping(false);
      if (email)
        navigate(`/refund/${encodeURIComponent(itinerary)}?email=${encodeURIComponent(email)}`);
      else navigate(`/refund/${encodeURIComponent(itinerary)}`);
      return;
    }

    // route: open ticket <id>
    const openTicket = text.match(/open ticket\s+([0-9]+)/i);
    if (openTicket) {
      const id = openTicket[1];
      setMsgs((m) => [...m, { from: BOT, text: `Opening ticket #${id}…` }]);
      setTyping(false);
      navigate(`/tickets/${encodeURIComponent(id)}`);
      return;
    }

    // explainers
    if (text.includes("why delayed") || text.includes("why is it delayed")) {
      setMsgs((m) => [
        ...m,
        {
          from: BOT,
          text:
            "Delays usually come from supplier approvals or bank processing queues. " +
            "If your refund is 'Processed', banks may take 1–10 business days to post funds.",
        },
      ]);
      setTyping(false);
      return;
    }

    if (text.includes("agent")) {
      setMsgs((m) => [
        ...m,
        {
          from: BOT,
          text:
            "No problem — I can escalate. Provide your itinerary and a short note, " +
            "or click 'Go to Ticket Tracker' to open a ticket.",
        },
      ]);
      setTyping(false);
      return;
    }

    // Contextual nudges
    if (location.pathname.startsWith("/refund")) {
      setMsgs((m) => [
        ...m,
        {
          from: BOT,
          text:
            "On the Refund page you’ll see status, ETA, and a timeline.\n" +
            "Tip: type 'track refund <itinerary> <email>' to jump directly.",
        },
      ]);
      setTyping(false);
      return;
    }
    if (location.pathname.startsWith("/tickets")) {
      setMsgs((m) => [
        ...m,
        {
          from: BOT,
          text:
            "On the Ticket page you can search by Ticket ID.\n" +
            "Tip: type 'open ticket <id>' to jump directly.",
        },
      ]);
      setTyping(false);
      return;
    }

    // Fallback
    setMsgs((m) => [
      ...m,
      {
        from: BOT,
        text:
          "I can help with: tracking refunds, explaining delays, or opening tickets.\n" +
          "Try: 'track refund H1258895 guest@example.com' or 'open ticket 5509001'.",
      },
    ]);
    setTyping(false);
  };

  const onSend = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;
    const text = input.trim();
    setMsgs((m) => [...m, { from: USER, text }]);
    setInput("");
    await respond(text);
  };

  const onSuggestion = async (s) => {
    setMsgs((m) => [...m, { from: USER, text: s.text }]);
    await respond(s.text);
  };

  return (
    <>
      {/* Helper label when closed */}
      {!open && (
        <div style={noteStyle} aria-hidden="true">
          Need help?
        </div>
      )}

      {/* Floating button */}
      <button
        aria-label={open ? "Close chat" : "Open chat"}
        title={open ? "Close chat" : "Need help?"}
        onClick={() => setOpen((v) => !v)}
        style={fabStyle}
      >
        💬
      </button>

      {/* Panel */}
      {open && (
        <div style={panelStyle} role="dialog" aria-label="Live help chat">
          <div style={headerStyle}>
            <span>Live Help</span>
            <button onClick={() => setOpen(false)} style={closeBtnStyle} aria-label="Close chat">
              ×
            </button>
          </div>

          <div style={bodyStyle}>
            {msgs.map((m, i) => (
              <Bubble key={i} from={m.from} text={m.text} />
            ))}
            {typing && <div className="helper">Support is typing…</div>}
            <div ref={endRef} />
          </div>

          <div style={suggestionsRow}>
            {SUGGESTIONS.map((s) => (
              <button key={s.text} onClick={() => onSuggestion(s)} style={chipStyle}>
                {s.label}
              </button>
            ))}
          </div>

          <form onSubmit={onSend} style={inputRowStyle}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type here… (e.g., track refund H1258895 guest@example.com)"
              style={inputStyle}
            />
            <button className="btn" style={{ minWidth: 84 }}>
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}

function Bubble({ from, text }) {
  const mine = from === USER;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: mine ? "flex-end" : "flex-start",
        marginBottom: 8,
      }}
    >
      <div
        style={{
          maxWidth: "75%",
          whiteSpace: "pre-wrap",
          padding: "10px 12px",
          borderRadius: 12,
          background: mine ? "#0a2472" : "#f1f5f9",
          color: mine ? "#fff" : "#0f172a",
          border: mine ? "0" : "1px solid #e2e8f0",
        }}
      >
        <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>
          {mine ? "You" : "Support"}
        </div>
        {text}
      </div>
    </div>
  );
}

/* === Styles === */
const fabStyle = {
  position: "fixed",
  right: 20,
  bottom: 20,
  width: 64,
  height: 64,
  borderRadius: "50%",
  background: "#a7c7e7", // pastel blue
  color: "#0a2472",
  border: "2px solid #0a2472",
  cursor: "pointer",
  fontSize: 30,
  boxShadow: "0 8px 24px rgba(0,0,0,.25)",
  zIndex: 9999,
};

const noteStyle = {
  position: "fixed",
  right: 20,
  bottom: 90,
  background: "#0a2472",
  color: "#fff",
  padding: "6px 12px",
  borderRadius: 16,
  fontSize: 14,
  boxShadow: "0 4px 12px rgba(0,0,0,.2)",
  zIndex: 9999,
};

const panelStyle = {
  position: "fixed",
  right: 20,
  bottom: 88,
  width: 340,
  maxHeight: 520,
  display: "flex",
  flexDirection: "column",
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  boxShadow: "0 12px 32px rgba(0,0,0,.2)",
  overflow: "hidden",
  zIndex: 9999,
};

const headerStyle = {
  padding: "10px 12px",
  background: "#a7c7e7",
  color: "#0a2472",
  fontWeight: 700,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const closeBtnStyle = {
  background: "transparent",
  border: "none",
  fontSize: 22,
  cursor: "pointer",
  color: "#0a2472",
};

const bodyStyle = { padding: "12px", overflowY: "auto", flex: 1, background: "#fafafa" };
const inputRowStyle = { display: "flex", gap: 8, padding: 12, borderTop: "1px solid #e5e7eb", background: "#fff" };
const inputStyle = { flex: 1, padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: 10 };
const suggestionsRow = { display: "flex", gap: 8, padding: "0 12px 8px 12px", flexWrap: "wrap" };
const chipStyle = { fontSize: 12, padding: "6px 10px", borderRadius: 999, border: "1px solid #cbd5e1", background: "#fff", cursor: "pointer" };
