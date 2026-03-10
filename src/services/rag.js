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
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Heurística simple ES/EN.
 */
function detectLang(query) {
  const q = ` ${normalize(query)} `;

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
    " hire ",
    " skills ",
    " experience ",
    " why ",
  ];

  const hasEn = enHints.some((h) => q.includes(h));
  const hasEsChars = /[ñ¿¡]/i.test(query);
  const hasEsWords =
    /\b(que|cómo|como|para|vos|tenes|tenés|proyecto|repositorio|enlace|links|contratar|trabajo|habilidades|experiencia)\b/i.test(
      query,
    );

  if (hasEsChars || hasEsWords) return "es";
  if (hasEn) return "en";
  return "es";
}

/**
 * Detecta si la query es sobre contratación / búsqueda laboral.
 */
function isHireQuery(query) {
  return /\b(contratar|contratarte|contrata|hire|hiring|work with|trabajo|job|freelance|por que|por qué|why|deberia|debería|should i|worth|vale la pena|diferencia|diferencias|mejor que|better than)\b/i.test(
    query,
  );
}

/**
 * Detecta si la query es sobre WhatsApp / Baileys.
 */
function isWhatsappQuery(query) {
  return /\b(whatsapp|baileys|mensajes|mensaje|message|messages|automatico|automaticos|automático)\b/i.test(
    query,
  );
}

/**
 * Detecta si la query es sobre LinkedIn / microservicio de browser.
 */
function isLinkedinQuery(query) {
  return /\b(linkedin|playwright|chromium|sales.?navigator|mcp|browser.?agent|agente.?browser)\b/i.test(
    query,
  );
}

/**
 * Detecta si la query es sobre el SaaS de gestión.
 */
function isSaasQuery(query) {
  return /\b(saas|gestion|gestión|stock|inventario|inventory|factura|facturacion|facturación|invoice|crm|multi.?tenant|negocio|business|management)\b/i.test(
    query,
  );
}

export function tokenize(s) {
  const base = normalize(s)
    // Proyectos
    .replace(/\bsyntek\b/g, "synttek")
    .replace(/\bsynttek\b/g, "synttek")
    // WhatsApp / Baileys → normalizar a token común
    .replace(/\bbaileys\b/g, "whatsapp")
    // Heimdall → andeshire para que matchee el doc
    .replace(/\bheimdall\b/g, "andeshire")
    // SaaS variantes
    .replace(/\bsaas\b/g, "gestion")
    .replace(/\bgestión\b/g, "gestion")
    .replace(/\bfacturación\b/g, "factura")
    // Hire / contratación → token común
    .replace(/\bcontratar(te|lo|me)?\b/g, "contratar")
    .replace(/\bhire\b/g, "contratar")
    .replace(/\bhiring\b/g, "contratar")
    // Microservicio variantes
    .replace(/\bmicroservicio\b/g, "microservice")
    .replace(/\bmicroservicios\b/g, "microservice");

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

  // Si query quedó vacía por stopwords, devolvé core docs
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

      // Peso extra al título
      let score = titleHits * 3 + bodyHits;

      // ── Boosts semánticos por intent ──────────────────────────────────────

      // Boost why_hire si preguntan por contratación
      if (isHireQuery(query) && d.id === `why_hire_${lang}`) score += 10;

      // Boost microservice_whatsapp si preguntan por WhatsApp/Baileys
      if (isWhatsappQuery(query) && d.id === `microservice_whatsapp_${lang}`)
        score += 8;
      // También boostear andeshire porque da contexto
      if (isWhatsappQuery(query) && d.id === `andeshire_${lang}`) score += 4;

      // Boost microservice_linkedin si preguntan por LinkedIn/Playwright
      if (isLinkedinQuery(query) && d.id === `microservice_linkedin_${lang}`)
        score += 8;
      if (isLinkedinQuery(query) && d.id === `andeshire_${lang}`) score += 4;

      // Boost saas_gestion si preguntan por SaaS/gestión/stock/factura
      if (isSaasQuery(query) && d.id === `saas_gestion_${lang}`) score += 8;

      return { doc: d, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.max(k * 3, k))
    .map((x) => x.doc);

  // Filtrar por idioma (siempre pasar links y assistant_style)
  const langDocs = scored.filter((d) => {
    if (d.id === "links" || d.id === "assistant_style") return true;
    const id = String(d.id || "");
    return lang === "en" ? id.endsWith("_en") : id.endsWith("_es");
  });

  // Si los boosts de intent generaron docs fuera del filtro de idioma, recuperarlos
  const intentBoostIds = new Set();
  if (isHireQuery(query)) intentBoostIds.add(`why_hire_${lang}`);
  if (isWhatsappQuery(query))
    intentBoostIds.add(`microservice_whatsapp_${lang}`);
  if (isLinkedinQuery(query))
    intentBoostIds.add(`microservice_linkedin_${lang}`);
  if (isSaasQuery(query)) intentBoostIds.add(`saas_gestion_${lang}`);

  const byId = new Map(docs.map((d) => [d.id, d]));
  const boostedExtras = [...intentBoostIds]
    .map((id) => byId.get(id))
    .filter(Boolean)
    .filter((d) => !langDocs.find((x) => x.id === d.id));

  const finalDocs = [...boostedExtras, ...langDocs].slice(0, k);

  return finalDocs.length ? finalDocs : pickCoreDocs(docs, lang).slice(0, k);
}

function pickCoreDocs(docs, lang = "es") {
  const coreIds =
    lang === "en"
      ? ["about_en", "experience_en", "links", "contact_en"]
      : ["about_es", "experience_es", "links", "contact_es"];

  const byId = new Map(docs.map((d) => [d.id, d]));
  const core = coreIds.map((id) => byId.get(id)).filter(Boolean);

  if (core.length < 2) return docs.slice(0, 4);
  return core;
}
