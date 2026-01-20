import "dotenv/config";

export const env = {
  PORT: Number(process.env.PORT || 8787),
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  GROQ_MODEL: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
  NODE_ENV: process.env.NODE_ENV || "development",
};

if (!env.GROQ_API_KEY) {
  throw new Error("Missing GROQ_API_KEY in environment");
}
