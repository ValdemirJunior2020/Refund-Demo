import { MOCK_BOOKINGS, MOCK_TICKETS } from "./mockData";

const delay = (ms=500) => new Promise(r=>setTimeout(r, ms));

export async function getRefundByItineraryAndEmail(itinerary, email) {
  await delay();
  const rec = MOCK_BOOKINGS.find(
    b => b.itinerary.toLowerCase() === String(itinerary).toLowerCase()
      && b.email.toLowerCase() === String(email).toLowerCase()
  );
  if (!rec) throw new Error("Not found");
  return rec;
}

export async function getRefundByItinerary(itinerary) {
  await delay();
  const rec = MOCK_BOOKINGS.find(
    b => b.itinerary.toLowerCase() === String(itinerary).toLowerCase()
  );
  if (!rec) throw new Error("Not found");
  return rec;
}

export async function getTicketById(id) {
  await delay();
  const t = MOCK_TICKETS.find(x => x.id === String(id));
  if (!t) throw new Error("Not found");
  return t;
}
