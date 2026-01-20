import { KNOWLEDGE } from "../data/knowledge.js";

const STOPWORDS = new Set([
  // ES
  "el",
  "la",
  "los",
  "las",
  "un",
  "una",
  "unos",
  "unas",
  "y",
  "o",
  "de",
  "del",
  "al",
  "a",
  "en",
  "por",
  "para",
  "con",
  "sin",
  "que",
  "qué",
  "como",
  "cómo",
  "cual",
  "cuál",
  "es",
  "son",
  "ser",
  "tiene",
  "tenes",
  "tenés",
  "sabe",
  "sobre",
  "me",
  "mi",
  "tu",
  "sus",
  // EN
  "the",
  "a",
  "an",
  "and",
  "or",
  "of",
  "to",
  "in",
  "on",
  "for",
  "with",
  "without",
  "is",
  "are",
  "be",
  "about",
  "has",
  "have",
  "do",
  "does",
  "what",
  "which",
  "how",
]);

function normalize(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFD") // separa acento
    .replace(/[\u0300-\u036f]/g, ""); // elimina acentos
}

export function tokenize(s) {
  return normalize(s)
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean)
    .filter((t) => !STOPWORDS.has(t));
}

export function retrieve(query, k = 6) {
  const docs = Array.isArray(KNOWLEDGE)
    ? KNOWLEDGE.filter(
        (d) => d && typeof d.title === "string" && typeof d.text === "string",
      )
    : [];

  const qTokens = tokenize(query);
  const qSet = new Set(qTokens);

  // Si query quedó vacía por stopwords, devolvé “core docs”
  if (qSet.size === 0) {
    return pickCoreDocs(docs).slice(0, k);
  }

  const scored = docs
    .map((d) => {
      const titleTokens = tokenize(d.title);
      const bodyTokens = tokenize(d.text);

      let titleHits = 0;
      for (const w of titleTokens) if (qSet.has(w)) titleHits += 1;

      let bodyHits = 0;
      for (const w of bodyTokens) if (qSet.has(w)) bodyHits += 1;

      // Peso al título para que “GitHub/LinkedIn/Inglés” suba rápido
      const score = titleHits * 3 + bodyHits;

      return { doc: d, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map((x) => x.doc);

  // ✅ fallback correcto: devolver docs (no x.doc)
  return scored.length ? scored : pickCoreDocs(docs).slice(0, k);
}

function pickCoreDocs(docs) {
  // Elegí un fallback útil (no “los primeros 2”)
  const coreIds = ["about_es", "experience_es", "links", "contact_es"];
  const byId = new Map(docs.map((d) => [d.id, d]));
  const core = coreIds.map((id) => byId.get(id)).filter(Boolean);

  // Si falta alguno, completa con los primeros
  if (core.length < 2) return docs.slice(0, 4);
  return core;
}
