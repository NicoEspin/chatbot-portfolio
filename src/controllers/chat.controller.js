import { groq } from "../config/groq.js";
import { env } from "../config/env.js";
import { retrieve } from "../services/rag.js";

const GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions";
export async function postChat(req, res) {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: "messages must be an array" });
    }

    const lastUserMsg =
      [...messages].reverse().find((m) => m?.role === "user")?.content ?? "";

    const ctxDocs = retrieve(String(lastUserMsg), 8);

    const safeDocs = (ctxDocs || []).filter(
      (d) => d && typeof d.title === "string" && typeof d.text === "string",
    );

    const contextBlock = safeDocs.length
      ? safeDocs.map((d) => `### ${d.title}\n${d.text}`).join("\n\n")
      : "No hay contexto disponible.";

    const system = {
      role: "system",
      content: `Sos el asistente del portfolio de Nico Espin, tu nombre es Coquito.
Reglas:
- Respondé corto, claro y útil.
- Respondé en el idioma del usuario (si escribe en inglés, respondé en inglés).
- Usá SOLO el contexto provisto abajo.
- No inventes links, empresas, fechas ni métricas.
- Si falta info: decí "No estoy seguro con la info que tengo" y ofrecé contacto.

Contexto del portfolio:
${contextBlock}`,
    };

    const completion = await groq.chat.completions.create({
      model: env.GROQ_MODEL,
      messages: [system, ...messages],
      temperature: 0.2,
      max_completion_tokens: 600,
    });

    const assistantMessage = completion.choices?.[0]?.message;
    return res.json({ message: assistantMessage });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server_error" });
  }
}

export async function postChatStream(req, res) {
  let clientClosed = false;
  let keepAlive = null;

  // helper: log con timestamp corto
  const log = (...args) =>
    console.log("[SSE]", new Date().toISOString(), ...args);

  // helper: cierre seguro del SSE + abort upstream
  const controller = new AbortController();
  const closeStream = (reason = "unknown") => {
    if (clientClosed) return;
    clientClosed = true;

    log("closeStream()", { reason });

    try {
      controller.abort();
    } catch {}

    if (keepAlive) {
      clearInterval(keepAlive);
      keepAlive = null;
    }

    // 🔥 CLAVE: cerrar respuesta SSE para que el frontend salga del reader.read()
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

    const ctxDocs = retrieve(String(lastUserMsg), 4);
    console.log("[RAG]", {
      q: lastUserMsg,
      retrieved: (ctxDocs || []).map((d) => ({
        id: d?.id,
        title: d?.title,
        hasText: typeof d?.text === "string",
        hasContent: typeof d?.content === "string",
      })),
    });
    const safeDocs = (ctxDocs || []).filter(
      (d) => d && typeof d.title === "string" && typeof d.text === "string",
    );
    console.log(
      "[RAG] safeDocs",
      safeDocs.map((d) => d.id || d.title),
    );
    const contextBlock = safeDocs.length
      ? safeDocs.map((d) => `### ${d.title}\n${d.text}`).join("\n\n")
      : "No hay contexto disponible.";

    const system = {
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
    };

    // ✅ SSE headers hacia el browser
    res.status(200);
    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders?.();

    // ✅ logs de lifecycle (importante para descubrir quién corta)
    log("request start", {
      url: req.originalUrl,
      origin: req.headers.origin,
      accept: req.headers.accept,
      ua: req.headers["user-agent"],
    });

    // ⚠️ Usá res.close para SSE (no req.close)
    res.on("close", () => {
      log("res close event fired");
      closeStream("res_close");
    });

    // request aborted (útil con proxies)
    req.on("aborted", () => {
      log("req aborted event fired");
      closeStream("req_aborted");
    });

    // (solo debug) si querés ver si req.close se dispara “de más”
    req.on("close", () => {
      log("req close event fired (debug)");
      // NO cierro acá para no abortar de más
    });

    // ✅ confirmación inmediata
    res.write(`event: ready\ndata: {}\n\n`);
    log("sent: ready");

    // keep-alive cada 15s
    keepAlive = setInterval(() => {
      if (!clientClosed && !res.writableEnded) {
        res.write(`: ping\n\n`);
        log("sent: ping");
      }
    }, 15000);

    // ✅ timeout duro para evitar hangs infinitos si upstream queda colgado
    const hardTimeoutMs = 60000;
    const hardTimeout = setTimeout(() => {
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

      if (!res.writableEnded) {
        res.write(
          `event: error\ndata: ${JSON.stringify({
            error: "upstream_error",
            message: `Groq upstream HTTP ${upstream.status}`,
            details: errText?.slice?.(0, 500) || "",
          })}\n\n`,
        );
        res.write(`event: done\ndata: [DONE]\n\n`);
      }

      clearTimeout(hardTimeout);
      closeStream("upstream_not_ok");
      return;
    }

    if (!upstream.body) {
      log("upstream has no body");

      if (!res.writableEnded) {
        res.write(
          `event: error\ndata: ${JSON.stringify({
            error: "no_upstream_body",
            message: "Groq no devolvió body para streaming.",
          })}\n\n`,
        );
        res.write(`event: done\ndata: [DONE]\n\n`);
      }

      clearTimeout(hardTimeout);
      closeStream("no_upstream_body");
      return;
    }

    const reader = upstream.body.getReader();
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

          if (!res.writableEnded) {
            res.write(`event: done\ndata: [DONE]\n\n`);
            res.end();
          }

          clearTimeout(hardTimeout);
          if (keepAlive) clearInterval(keepAlive);
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
            if (!res.writableEnded) {
              res.write(`event: delta\ndata: ${JSON.stringify({ delta })}\n\n`);
            }
          }
        } catch {
          // Fallback: manda data cruda como delta
          deltaCount += 1;
          log("non-json chunk", {
            deltaCount,
            sample: String(dataStr).slice(0, 60),
          });

          if (!res.writableEnded) {
            res.write(
              `event: delta\ndata: ${JSON.stringify({ delta: dataStr })}\n\n`,
            );
          }
        }
      }
    }

    // Si sale del loop sin [DONE], cerramos igual (evita “Escribiendo…” infinito)
    log("exited loop without [DONE]", {
      clientClosed,
      writableEnded: res.writableEnded,
    });

    if (!res.writableEnded) {
      res.write(`event: done\ndata: [DONE]\n\n`);
      res.end();
    }

    clearTimeout(hardTimeout);
    if (keepAlive) clearInterval(keepAlive);
  } catch (err) {
    if (keepAlive) clearInterval(keepAlive);

    // ✅ CRÍTICO: si abortaste, cerrá stream (no return pelado)
    if (err?.name === "AbortError") {
      log("caught AbortError");
      closeStream("abort_error");
      return;
    }

    console.error("STREAM ERROR:", err);

    if (res.headersSent && !res.writableEnded) {
      res.write(
        `event: error\ndata: ${JSON.stringify({
          error: "server_error",
          message: err?.message || "server_error",
        })}\n\n`,
      );
      res.write(`event: done\ndata: [DONE]\n\n`);
      return res.end();
    }

    return res.status(500).json({ error: "server_error" });
  }
}
