import express from "express";
import chatRoutes from "./routes/chat.routes.js";
import { corsMiddleware, preflight } from "./config/cors.js";

export function createApp() {
  const app = express();

  // ✅ CORS primero
  app.use(corsMiddleware);
  app.options(/.*/, preflight);

  // Body parser
  app.use(express.json({ limit: "1mb" }));

  // Routes
  app.use("/api", chatRoutes);

  // Health
  app.get("/health", (req, res) => res.json({ ok: true }));

  return app;
}

// ✅ Esto es lo que Vercel necesita para “Express on Vercel”
const app = createApp();
export default app;
