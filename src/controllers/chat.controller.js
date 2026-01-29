import { env } from "../config/env.js";
import { retrieve } from "../services/rag.js";

const GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions";

function normalize(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// Heurística simple EN/ES (suficiente para elegir system prompt + fallback de texto)
function detectLangFromText(text) {
  const q = ` ${normalize(text)} `;

  const enHints = [
    " the ",
    " and ",
    " what ",
    " how ",
    " about ",
    " project ",
    " repo ",
    " repository ",
    " link ",
    " links ",
    " github ",
    " linkedin ",
    " demo ",
  ];

  const hasEn = enHints.some((h) => q.includes(h));
  const hasEsChars = /[ñ¿¡]/i.test(text);
  const hasEsWords =
    /\b(que|cómo|como|para|vos|tenes|tenés|proyecto|repositorio|enlace|links)\b/i.test(
      q,
    );

  if (hasEsChars || hasEsWords) return "es";
  if (hasEn) return "en";
  return "es";
}

// Mantener docs “obligatorios” siempre presentes si están disponibles en lo recuperado
function ensureRequiredDocs(retrievedDocs, lang) {
  const wanted = new Set([
    "assistant_style",
    "links",
    lang === "en" ? "contact_en" : "contact_es",
  ]);

  const byId = new Map((retrievedDocs || []).map((d) => [d?.id, d]));
  const out = [];

  // primero obligatorios (si están)
  for (const id of wanted) {
    const d = byId.get(id);
    if (d && typeof d.title === "string" && typeof d.text === "string")
      out.push(d);
  }

  // después el resto, sin duplicados
  const seen = new Set(out.map((d) => d.id));
  for (const d of retrievedDocs || []) {
    if (!d || !d.id || seen.has(d.id)) continue;
    if (typeof d.title !== "string" || typeof d.text !== "string") continue;
    out.push(d);
    seen.add(d.id);
  }

  return out;
}

export async function postChatStream(req, res) {
  let clientClosed = false;
  let keepAlive = null;
  let hardTimeout = null;
  let reader = null;

  const log = (...args) =>
    console.log("[SSE]", new Date().toISOString(), ...args);

  const controller = new AbortController();

  const safeWrite = (chunk) => {
    if (clientClosed || res.writableEnded) return;
    try {
      res.write(chunk);
    } catch {}
  };

  const closeStream = (reason = "unknown") => {
    if (clientClosed) return;
    clientClosed = true;

    log("closeStream()", { reason });

    try {
      controller.abort();
    } catch {}

    try {
      reader?.cancel?.();
    } catch {}

    if (keepAlive) {
      clearInterval(keepAlive);
      keepAlive = null;
    }

    if (hardTimeout) {
      clearTimeout(hardTimeout);
      hardTimeout = null;
    }

    if (!res.writableEnded) {
      try {
        res.end();
      } catch {}
    }
  };

  try {
    const { messages } = req.body;

    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: "messages must be an array" });
    }

    const lastUserMsg =
      [...messages].reverse().find((m) => m?.role === "user")?.content ?? "";

    const lang = detectLangFromText(lastUserMsg);

    // ✅ Pedimos más para que entren estilo + links + proyectos
    const ctxDocs = retrieve(String(lastUserMsg), 8);

    const safeDocsBase = (ctxDocs || []).filter(
      (d) => d && typeof d.title === "string" && typeof d.text === "string",
    );

    const safeDocs = ensureRequiredDocs(safeDocsBase, lang);

    log("[RAG]", {
      q: lastUserMsg,
      lang,
      retrieved: safeDocs.map((d) => ({ id: d.id, title: d.title })),
    });

    const noContextMsg =
      lang === "en" ? "No context available." : "No hay contexto disponible.";

    const contextBlock = safeDocs.length
      ? safeDocs.map((d) => `### ${d.title}\n${d.text}`).join("\n\n")
      : noContextMsg;

    const system =
      lang === "en"
        ? {
            role: "system",
            content: `You are Coquito, the assistant for Nico Espin's portfolio.

Rules:
- Reply briefly and clearly, in the same language as the user's last message (Spanish or English).
- Use ONLY the provided context. If the answer isn't in the context, say you're not sure and offer: ask for details or contact Nico via the website form.
- Never invent links, companies, dates, or metrics.
- You may translate facts from the context to match the user's language, but do not add new facts.
- If the user just greets (e.g., "hi"/"hola"), greet back and ask what they want to know.

Portfolio context:
${contextBlock}`,
          }
        : {
            role: "system",
            content: `Sos Coquito, el asistente del portfolio de Nico Espin.

Reglas:
- Respondé corto, claro y útil, en el mismo idioma del último mensaje del usuario (ES/EN).
- Usá SOLO el contexto provisto. Si la respuesta no está en el contexto, decí que no estás seguro y ofrecé: pedir detalle o contactar a Nico desde el formulario del sitio.
- No inventes links, empresas, fechas ni métricas.
- Podés traducir hechos del contexto al idioma del usuario, pero no agregues hechos nuevos.
- Si el usuario solo saluda (ej: "hola"/"hi"), saludá y preguntá qué quiere saber.

Contexto del portfolio:
${contextBlock}`,
          };

    // ✅ SSE headers hacia el browser
    res.status(200);
    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders?.();

    log("request start", {
      url: req.originalUrl,
      origin: req.headers.origin,
      accept: req.headers.accept,
      ua: req.headers["user-agent"],
    });

    // ✅ SSE close lifecycle
    res.on("close", () => {
      log("res close event fired");
      closeStream("res_close");
    });

    req.on("aborted", () => {
      log("req aborted event fired");
      closeStream("req_aborted");
    });

    req.on("close", () => {
      log("req close event fired (debug)");
      // no cierro acá para evitar abortar de más
    });

    // ✅ confirmación inmediata
    safeWrite(`event: ready\ndata: {}\n\n`);
    log("sent: ready");

    // keep-alive cada 15s
    keepAlive = setInterval(() => {
      safeWrite(`: ping\n\n`);
      log("sent: ping");
    }, 15000);

    // ✅ timeout duro para evitar hangs infinitos si upstream queda colgado
    const hardTimeoutMs = 60000;
    hardTimeout = setTimeout(() => {
      log("hardTimeout reached -> abort upstream", { hardTimeoutMs });
      closeStream("hard_timeout");
    }, hardTimeoutMs);

    log("upstream fetch start", {
      model: env.GROQ_MODEL,
      hasKey: Boolean(env.GROQ_API_KEY),
      keyLen: env.GROQ_API_KEY ? String(env.GROQ_API_KEY).length : 0,
    });

    const upstream = await fetch(GROQ_CHAT_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify({
        model: env.GROQ_MODEL,
        messages: [system, ...messages],
        temperature: 0.2,
        max_completion_tokens: 600,
        stream: true,
      }),
      signal: controller.signal,
    });

    log("upstream response", {
      ok: upstream.ok,
      status: upstream.status,
      contentType: upstream.headers.get("content-type"),
    });

    if (!upstream.ok) {
      const errText = await upstream.text().catch(() => "");
      log("upstream error body (first 300)", errText?.slice?.(0, 300) || "");

      safeWrite(
        `event: error\ndata: ${JSON.stringify({
          error: "upstream_error",
          message: `Groq upstream HTTP ${upstream.status}`,
          details: errText?.slice?.(0, 500) || "",
        })}\n\n`,
      );
      safeWrite(`event: done\ndata: [DONE]\n\n`);
      closeStream("upstream_not_ok");
      return;
    }

    if (!upstream.body) {
      log("upstream has no body");

      safeWrite(
        `event: error\ndata: ${JSON.stringify({
          error: "no_upstream_body",
          message:
            lang === "en"
              ? "Groq returned no body for streaming."
              : "Groq no devolvió body para streaming.",
        })}\n\n`,
      );
      safeWrite(`event: done\ndata: [DONE]\n\n`);
      closeStream("no_upstream_body");
      return;
    }

    reader = upstream.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";
    let deltaCount = 0;

    while (!clientClosed && !res.writableEnded) {
      const { value, done } = await reader.read();
      if (done) {
        log("upstream reader done");
        break;
      }

      buffer += decoder.decode(value, { stream: true });

      // SSE events separados por doble newline
      const events = buffer.split(/\r?\n\r?\n/);
      buffer = events.pop() || "";

      for (const rawEvent of events) {
        if (!rawEvent || rawEvent.startsWith(":")) continue;

        const lines = rawEvent.split(/\r?\n/);
        const dataLines = [];

        for (const line of lines) {
          if (line.startsWith("data:")) dataLines.push(line.slice(5).trim());
        }

        const dataStr = dataLines.join("\n");
        if (!dataStr) continue;

        if (dataStr === "[DONE]") {
          log("received: [DONE]", { deltaCount });
          safeWrite(`event: done\ndata: [DONE]\n\n`);
          closeStream("done");
          return;
        }

        try {
          const parsed = JSON.parse(dataStr);
          const delta = parsed?.choices?.[0]?.delta?.content ?? "";

          if (delta) {
            deltaCount += 1;
            if (deltaCount <= 5 || deltaCount % 20 === 0) {
              log("delta", { deltaCount, sample: delta.slice(0, 40) });
            }
            safeWrite(`event: delta\ndata: ${JSON.stringify({ delta })}\n\n`);
          }
        } catch {
          // Fallback: manda data cruda como delta
          deltaCount += 1;
          log("non-json chunk", {
            deltaCount,
            sample: String(dataStr).slice(0, 60),
          });

          safeWrite(
            `event: delta\ndata: ${JSON.stringify({ delta: dataStr })}\n\n`,
          );
        }
      }
    }

    // Si sale del loop sin [DONE], cerramos igual (evita “Escribiendo…” infinito)
    log("exited loop without [DONE]", {
      clientClosed,
      writableEnded: res.writableEnded,
    });

    safeWrite(`event: done\ndata: [DONE]\n\n`);
    closeStream("loop_exit_without_done");
  } catch (err) {
    if (err?.name === "AbortError") {
      log("caught AbortError");
      closeStream("abort_error");
      return;
    }

    console.error("STREAM ERROR:", err);

    if (res.headersSent && !res.writableEnded) {
      safeWrite(
        `event: error\ndata: ${JSON.stringify({
          error: "server_error",
          message: err?.message || "server_error",
        })}\n\n`,
      );
      safeWrite(`event: done\ndata: [DONE]\n\n`);
      closeStream("server_error_headers_sent");
      return;
    }

    return res.status(500).json({ error: "server_error" });
  }
}
