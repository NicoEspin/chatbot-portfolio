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

/**
 * Heurística simple ES/EN.
 * - No busca ser perfecta, solo evitar que el fallback meta ES cuando preguntan en EN.
 */
function detectLang(query) {
  const q = ` ${normalize(query)} `;

  // Pistas típicas de inglés
  const enHints = [
    " the ",
    " and ",
    " about ",
    " what ",
    " which ",
    " how ",
    " project ",
    " repo ",
    " repository ",
    " demo ",
    " link ",
    " links ",
    " github ",
    " linkedin ",
  ];

  const hasEn = enHints.some((h) => q.includes(h));

  // Caracteres/expresiones muy comunes en español
  const hasEsChars = /[ñ¿¡]/i.test(query);
  const hasEsWords =
    /\b(que|cómo|como|para|vos|tenes|tenés|proyecto|repositorio|enlace|links)\b/i.test(
      query,
    );

  // Si hay señales de ES, priorizamos ES
  if (hasEsChars || hasEsWords) return "es";
  if (hasEn) return "en";

  // Default ES (tu sitio/KB está muy ES-heavy)
  return "es";
}

export function tokenize(s) {
  // ✅ Alias Syntek/Synttek para mejorar recall
  const base = normalize(s)
    .replace(/\bsyntek\b/g, "synttek")
    .replace(/\bsynttek\b/g, "synttek");

  return base
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

  const lang = detectLang(query);

  const qTokens = tokenize(query);
  const qSet = new Set(qTokens);

  // Si query quedó vacía por stopwords, devolvé “core docs” por idioma
  if (qSet.size === 0) {
    return pickCoreDocs(docs, lang).slice(0, k);
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
    // traigo un poco más y después filtro por idioma
    .slice(0, Math.max(k * 3, k))
    .map((x) => x.doc);

  // ✅ Filtrar por idioma para no mezclar ES/EN en el contexto
  const langDocs = scored.filter((d) => {
    if (d.id === "links" || d.id === "assistant_style") return true;
    const id = String(d.id || "");
    return lang === "en" ? id.endsWith("_en") : id.endsWith("_es");
  });

  return langDocs.length
    ? langDocs.slice(0, k)
    : pickCoreDocs(docs, lang).slice(0, k);
}

function pickCoreDocs(docs, lang = "es") {
  const coreIds =
    lang === "en"
      ? ["about_en", "experience_en", "links", "contact_en"]
      : ["about_es", "experience_es", "links", "contact_es"];

  const byId = new Map(docs.map((d) => [d.id, d]));
  const core = coreIds.map((id) => byId.get(id)).filter(Boolean);

  // Si falta alguno, completa con los primeros
  if (core.length < 2) return docs.slice(0, 4);
  return core;
}
