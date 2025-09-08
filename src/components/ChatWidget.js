import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const BOT = "bot";
const USER = "you";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState([
    { from: BOT, text: "Hi! Need help with a refund or ticket? Ask me anything." }
  ]);
  const [typing, setTyping] = useState(false);
  const [transcript, setTranscript] = useState([
    { role: "model", content: "Hi! I can help with refunds or tickets." }
  ]);
  const navigate = useNavigate();
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, typing]);

  // Call Gemini backend
  async function askGemini(history) {
    const res = await fetch("/api/gemini-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history })
    });
    if (!res.ok) throw new Error("Gemini error");
    const data = await res.json();
    return data.reply;
  }

  const onSend = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;
    const userText = input.trim();

    setMsgs(m => [...m, { from: USER, text: userText }]);
    setTranscript(t => [...t, { role: "user", content: userText }]);
    setInput("");

    try {
      setTyping(true);
      const reply = await askGemini(
        transcript.concat({ role: "user", content: userText })
      );
      setMsgs(m => [...m, { from: BOT, text: reply }]);
      setTranscript(t => [...t, { role: "model", content: reply }]);
    } catch {
      setMsgs(m => [...m, { from: BOT, text: "Sorry, I couldn’t reach Gemini. Try again later." }]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <>
      {!open && (
        <div style={noteStyle} aria-hidden="true">
          Need help?
        </div>
      )}
      <button
        aria-label={open ? "Close chat" : "Open chat"}
        onClick={() => setOpen(v => !v)}
        style={fabStyle}
      >
        💬
      </button>
      {open && (
        <div style={panelStyle}>
          <div style={headerStyle}>
            <span>Live Help (Gemini 2.5)</span>
            <button onClick={() => setOpen(false)} style={closeBtnStyle}>×</button>
          </div>
          <div style={bodyStyle}>
            {msgs.map((m, i) => (
              <Bubble key={i} from={m.from} text={m.text} />
            ))}
            {typing && <div className="helper">Gemini is typing…</div>}
            <div ref={endRef} />
          </div>
          <form onSubmit={onSend} style={inputRowStyle}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your question…"
              style={inputStyle}
            />
            <button className="btn" style={{ minWidth: 84 }}>Send</button>
          </form>
        </div>
      )}
    </>
  );
}

function Bubble({ from, text }) {
  const mine = from === USER;
  return (
    <div style={{ display: "flex", justifyContent: mine ? "flex-end" : "flex-start", marginBottom: 8 }}>
      <div style={{
        maxWidth: "75%",
        whiteSpace: "pre-wrap",
        padding: "10px 12px",
        borderRadius: 12,
        background: mine ? "#0a2472" : "#f1f5f9",
        color: mine ? "#fff" : "#0f172a",
        border: mine ? "0" : "1px solid #e2e8f0"
      }}>
        <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>{mine ? "You" : "Gemini"}</div>
        {text}
      </div>
    </div>
  );
}

// Styles
const fabStyle = {
  position: "fixed", right: 20, bottom: 20, width: 64, height: 64, borderRadius: "50%",
  background: "#a7c7e7", color: "#0a2472", border: "2px solid #0a2472",
  cursor: "pointer", fontSize: 30, boxShadow: "0 8px 24px rgba(0,0,0,.25)", zIndex: 9999
};
const noteStyle = {
  position: "fixed", right: 20, bottom: 90, background: "#0a2472", color: "#fff",
  padding: "6px 12px", borderRadius: 16, fontSize: 14, boxShadow: "0 4px 12px rgba(0,0,0,.2)", zIndex: 9999
};
const panelStyle = {
  position: "fixed", right: 20, bottom: 88, width: 340, maxHeight: 520,
  display: "flex", flexDirection: "column", background: "#fff",
  border: "1px solid #e5e7eb", borderRadius: 12, boxShadow: "0 12px 32px rgba(0,0,0,.2)",
  overflow: "hidden", zIndex: 9999
};
const headerStyle = {
  padding: "10px 12px", background: "#a7c7e7", color: "#0a2472",
  fontWeight: 700, display: "flex", justifyContent: "space-between", alignItems: "center"
};
const closeBtnStyle = { background: "transparent", border: "none", fontSize: 22, cursor: "pointer", color: "#0a2472" };
const bodyStyle = { padding: "12px", overflowY: "auto", flex: 1, background: "#fafafa" };
const inputRowStyle = { display: "flex", gap: 8, padding: 12, borderTop: "1px solid #e5e7eb", background: "#fff" };
const inputStyle = { flex: 1, padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: 10 };
