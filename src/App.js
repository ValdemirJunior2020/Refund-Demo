import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import RefundSearch from "./pages/RefundSearch";
import RefundDetails from "./pages/RefundDetails";
import TicketSearch from "./pages/TicketSearch";
import TicketDetails from "./pages/TicketDetails";
import ChatWidget from "./components/ChatWidget";
import "./index.css";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <BrowserRouter>
      <nav className="navbar">
        <div className="nav-left">
          <img src="/logo.svg" alt="Logo" className="logo" />
          <h1>Support Dashboard</h1>
        </div>

        {/* Hamburger (mobile) */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? "✖" : "☰"}
        </button>

        {/* Links (desktop + mobile) */}
        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link to="/refund" onClick={() => setMenuOpen(false)}>Refund Tracker</Link>
          <Link to="/tickets" onClick={() => setMenuOpen(false)}>Ticket Tracker</Link>
          <a href="tel:+18004972175" onClick={() => setMenuOpen(false)}>
            Call Support: +1-800-497-2175
          </a>
        </div>
      </nav>

      <div className="container">
        <Routes>
          <Route path="/" element={<RefundSearch />} />
          <Route path="/refund" element={<RefundSearch />} />
          <Route path="/refund/:itinerary" element={<RefundDetails />} />
          <Route path="/tickets" element={<TicketSearch />} />
          <Route path="/tickets/:id" element={<TicketDetails />} />
        </Routes>
      </div>

      <ChatWidget />
    </BrowserRouter>
  );
}
