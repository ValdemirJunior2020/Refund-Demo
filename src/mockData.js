// Two example records to demo different statuses.
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
      transactions: [
        { ts: "2025-08-28T14:10:00Z", event: "Requested" },
        { ts: "2025-08-28T15:01:00Z", event: "Approved" },
        { ts: "2025-08-29T10:22:00Z", event: "Processed" }
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
      transactions: [
        { ts: "2025-09-02T09:00:00Z", event: "Requested" }
      ]
    }
  }
];
