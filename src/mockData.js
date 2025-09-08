// Detailed mock data with timestamps, actors, channels, delay reasons, and SLA flags.

export const MOCK_BOOKINGS = [
  {
    itinerary: "H1258895",
    email: "guest@example.com",
    hotelName: "Hampton Inn Richmond Research Rd",
    checkIn: "2025-08-15",
    checkOut: "2025-08-16",
    bookingStatus: "Cancelled",
    refund: {
      amount: 145.32,
      method: "Original card",
      status: "Processed", // Requested | Approved | Processed | Paid
      eta: "3–5 business days",
      steps: [
        {
          ts: "2025-08-28T14:05:10Z",
          event: "Guest requested refund",
          actor: "Guest",
          channel: "Phone",
          notes: "Double booking."
        },
        {
          ts: "2025-08-28T14:10:00Z",
          event: "Refund request submitted to supplier",
          actor: "Agent Farida T.",
          channel: "Internal Tool",
          notes: "FOC requested due to duplicate.",
        },
        {
          ts: "2025-08-28T15:01:00Z",
          event: "Supplier approved refund",
          actor: "Hotel/Supplier",
          channel: "Portal",
          notes: "Approved same day.",
        },
        {
          ts: "2025-08-29T10:22:00Z",
          event: "Payment processor initiated",
          actor: "Refunds Bot",
          channel: "Payment API",
          notes: "Batch scheduled for 12:00 PM ET."
        },
        {
          ts: "2025-08-29T12:45:00Z",
          event: "Delay: bank network queue",
          actor: "Processor",
          channel: "Webhook",
          notes: "ACH queue heavy; next window 15:00 ET.",
          delayReason: "Processor backlog",
          slaImpact: "No"
        },
        {
          ts: "2025-08-29T15:08:00Z",
          event: "Processed",
          actor: "Processor",
          channel: "Payment API",
          notes: "Funds released to card.",
        }
      ]
    }
  },
  {
    itinerary: "G7788123",
    email: "val@example.com",
    hotelName: "Quality Inn Cedar Rapids – Collins Rd",
    checkIn: "2025-09-01",
    checkOut: "2025-09-03",
    bookingStatus: "Cancelled",
    refund: {
      amount: 212.85,
      method: "Original card",
      status: "Requested",
      eta: "Pending approval",
      steps: [
        {
          ts: "2025-09-02T09:00:00Z",
          event: "Guest requested refund",
          actor: "Guest",
          channel: "Email",
          notes: "Charged after cancellation cutoff.",
        },
        {
          ts: "2025-09-02T09:18:00Z",
          event: "Escalated to hotel manager",
          actor: "Agent Leo M.",
          channel: "Phone",
          notes: "FOC requested due to travel emergency."
        },
        {
          ts: "2025-09-03T12:05:00Z",
          event: "Delay: manager unavailable",
          actor: "Hotel",
          channel: "Email",
          notes: "Manager out; promised reply next day.",
          delayReason: "Manager unavailable",
          slaImpact: "At risk"
        }
      ]
    }
  }
];

export const MOCK_TICKETS = [
  {
    id: "5508809",
    itinerary: "H11903226",
    guest: "Russell Steele",
    subject: "Receipt Needed",
    status: "Pending",
    notes: "Guest requested an itemized receipt.",
    steps: [
      {
        ts: "2025-08-28T17:46:00Z",
        event: "Ticket created",
        actor: "System",
        channel: "Email Intake",
        notes: "Auto-parsed from guest email."
      },
      {
        ts: "2025-08-28T17:48:00Z",
        event: "Assigned",
        actor: "Queue Router",
        channel: "Helpdesk",
        notes: "Team: BUWEL Support"
      },
      {
        ts: "2025-08-29T09:15:00Z",
        event: "Agent reply sent",
        actor: "Farida T.",
        channel: "Helpdesk",
        notes: "Gathering invoice from supplier."
      }
    ]
  },
  {
    id: "5508810",
    itinerary: "H1258895",
    guest: "Emily Hawkins",
    subject: "Hotel Quality Concern",
    status: "Open",
    notes: "Guest reported cleanliness issues at check-in.",
    steps: [
      {
        ts: "2025-09-01T14:22:00Z",
        event: "Ticket logged",
        actor: "Agent Noel S.",
        channel: "Phone",
        notes: "Photos requested."
      },
      {
        ts: "2025-09-01T14:30:00Z",
        event: "Escalated to QA Review",
        actor: "Noel S.",
        channel: "Helpdesk",
        notes: "24h follow-up."
      }
    ]
  },
  {
    id: "5509001",
    itinerary: "H22233444",
    guest: "Daniel Roberts",
    subject: "Refund Missing",
    status: "In Progress",
    notes: "Guest says refund hasn’t arrived after cancellation.",
    steps: [
      {
        ts: "2025-09-05T10:05:00Z",
        event: "Guest reported missing refund",
        actor: "Guest",
        channel: "Phone",
        notes: "Cancellation on 08/31."
      },
      {
        ts: "2025-09-05T10:12:00Z",
        event: "Escalated to Refunds Team",
        actor: "Agent Kim R.",
        channel: "Helpdesk",
        notes: "Check processor batch."
      },
      {
        ts: "2025-09-06T09:00:00Z",
        event: "Supplier approved refund",
        actor: "Hotel/Supplier",
        channel: "Portal",
        notes: "Ok to refund full amount."
      },
      {
        ts: "2025-09-06T16:30:00Z",
        event: "Delay: bank verification",
        actor: "Processor",
        channel: "Webhook",
        notes: "Card re-verification required.",
        delayReason: "Card verification",
        slaImpact: "At risk"
      }
    ]
  }
];
