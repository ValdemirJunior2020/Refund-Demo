import { useState } from "react";

export default function Support() {
  const [form, setForm] = useState({
    bookingId: "",
    name: "",
    email: "",
    issue: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For demo only – you’d normally POST to backend
    console.log("Support ticket submitted:", form);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ padding: 20 }}>
        <h2>✅ Ticket Submitted</h2>
        <p>Thanks, {form.name}. Our support team will reach out to you soon.</p>
        <p>If it’s urgent, you can also call us at <strong>+1-800-497-2175</strong>.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: "0 auto" }}>
      <h2>Open a Support Ticket</h2>
      <p>
        You can also reach our support team by phone:{" "}
        <a href="tel:+18004972175" style={{ fontWeight: "bold", color: "#0a2472" }}>
          +1-800-497-2175
        </a>
      </p>
      <p>Please provide your booking details and describe your issue.</p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          name="bookingId"
          value={form.bookingId}
          onChange={handleChange}
          placeholder="Booking ID"
          required
        />
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Your Name"
          required
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Your Email"
          required
        />
        <textarea
          name="issue"
          value={form.issue}
          onChange={handleChange}
          placeholder="Describe your issue"
          rows={4}
          required
        />
        <button
          type="submit"
          style={{
            padding: "10px 16px",
            background: "#0a2472",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer"
          }}
        >
          Submit Ticket
        </button>
      </form>
    </div>
  );
}
