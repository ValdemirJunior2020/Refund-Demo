import { MOCK_BOOKINGS } from "./mockData";

// Fake API with a small delay to feel real
export function fetchRefundStatus({ itinerary, email }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const rec = MOCK_BOOKINGS.find(
        b =>
          b.itinerary.toLowerCase() === String(itinerary).toLowerCase() &&
          b.email.toLowerCase() === String(email).toLowerCase()
      );
      if (!rec) return reject(new Error("Not found"));
      // Return only what's needed
      resolve({
        itinerary: rec.itinerary,
        email: rec.email,
        hotelName: rec.hotelName,
        checkIn: rec.checkIn,
        checkOut: rec.checkOut,
        bookingStatus: rec.bookingStatus,
        refund: rec.refund
      });
    }, 650); // 0.65s
  });
}
