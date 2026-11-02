import { generateProposal } from "../../server/groq.js";

const headers = { "Content-Type": "application/json", "Cache-Control": "no-store" };
const reply = (status, data) => new Response(JSON.stringify(data), { status, headers });

export default async (req) => {
  if (req.method !== "POST") return reply(405, { error: "Use POST." });
  let body;
  try {
    body = await req.json();
  } catch {
    return reply(400, { error: "Request body must be valid JSON." });
  }
  const { status, data } = await generateProposal(body, process.env.GROQ_API_KEY);
  return reply(status, data);
};

export const config = { path: "/api/generate" };
