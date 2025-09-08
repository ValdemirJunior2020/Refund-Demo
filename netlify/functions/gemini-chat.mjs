import { GoogleGenerativeAI } from "@google/generative-ai";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { messages } = JSON.parse(event.body || "{}"); // [{role, content}]
    if (!Array.isArray(messages) || messages.length === 0) {
      return { statusCode: 400, body: "Missing messages" };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return { statusCode: 500, body: "Missing GEMINI_API_KEY" };
    }

    // 👇 default to Gemini 2.5 Flash
    const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName });

    // System preamble to keep answers safe & focused
    const systemPrompt = `
You are HotelPlanner's support assistant.
- Be friendly, concise, and clear.
- For refunds: explain steps and timelines (typically 1–10 business days after 'Processed').
- Never request or expose full card numbers or PII.
- If unsure, suggest the guest open a support ticket.
    `;

    const contents = [
      { role: "user", parts: [{ text: systemPrompt }] },
      ...messages.map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      })),
    ];

    const result = await model.generateContent({ contents });
    const replyText = result.response.text();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply: replyText, model: modelName }),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: "Gemini error" };
  }
}
