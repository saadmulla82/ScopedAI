import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { generateProposal } from "./server/groq.js";

// Local stand-in for the Netlify Function, so `npm run dev` works with just a .env file.
function localApi(env) {
  const handler = (req, res) => {
    const send = (status, data) => {
      res.statusCode = status;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(data));
    };
    if (req.method !== "POST") return send(405, { error: "Use POST." });
    let raw = "";
    req.on("data", (c) => {
      raw += c;
      if (raw.length > 100_000) req.destroy();
    });
    req.on("end", async () => {
      let body;
      try {
        body = JSON.parse(raw || "{}");
      } catch {
        return send(400, { error: "Request body must be valid JSON." });
      }
      const { status, data } = await generateProposal(body, env.GROQ_API_KEY);
      send(status, data);
    });
  };
  return {
    name: "local-api",
    configureServer(server) {
      server.middlewares.use("/api/generate", handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use("/api/generate", handler);
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react(), localApi(env)],
    build: { chunkSizeWarningLimit: 900 },
  };
});
