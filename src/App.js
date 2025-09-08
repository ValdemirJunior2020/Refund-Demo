import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import RefundSearch from "./pages/RefundSearch";
import RefundDetails from "./pages/RefundDetails";
import TicketSearch from "./pages/TicketSearch";
import TicketDetails from "./pages/TicketDetails";
import "./index.css";

export default function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <div className="nav-left">
          <img src="/logo.svg" alt="Logo" className="logo" />
          <h1>Support Dashboard</h1>
        </div>
        <div className="nav-links">
          <Link to="/refund">Refund Tracker</Link>
          <Link to="/tickets">Ticket Tracker</Link>
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
    </BrowserRouter>
  );
}
