import { GoogleGenerativeAI } from "@google/generative-ai";

const CORS_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(statusCode, body) {
  return { statusCode, headers: CORS_HEADERS, body: JSON.stringify(body) };
}

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") return json(200, {});
  if (event.httpMethod !== "POST") return json(405, { error: "Method Not Allowed" });

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return json(400, { error: "Invalid JSON body" });
  }

  const messages = Array.isArray(body.messages) ? body.messages : null;
  if (!messages || messages.length === 0) return json(400, { error: "Missing messages" });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return json(500, { error: "Missing GEMINI_API_KEY (set in Netlify env vars)" });

  const preferred = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const fallbacks = ["gemini-1.5-flash"]; // auto fallback if needed

  const systemPrompt =
    "You are HotelPlanner's support assistant. Be friendly, concise, and clear. " +
    'For refunds: explain steps & timelines (typically 1–10 business days after "Processed"). ' +
    "Never request or expose full card numbers or PII. If unsure, suggest opening a support ticket.";

  const contents = [
    { role: "user", parts: [{ text: systemPrompt }] },
    ...messages.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: String(m.content || "") }],
    })),
  ];

  try {
    const reply = await callModel(apiKey, preferred, contents);
    return json(200, { reply, model: preferred });
  } catch (e1) {
    console.error("Gemini preferred model failed:", preferred, e1?.message || e1);
    for (const m of fallbacks) {
      try {
        const reply = await callModel(apiKey, m, contents);
        return json(200, { reply, model: m, note: "fallback" });
      } catch (e2) {
        console.error("Gemini fallback failed:", m, e2?.message || e2);
      }
    }
    return json(500, { error: "Gemini call failed", detail: e1?.message || String(e1) });
  }
}

async function callModel(apiKey, modelName, contents) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: modelName });
  const result = await model.generateContent({ contents });
  return result?.response?.text?.() || "";
}
