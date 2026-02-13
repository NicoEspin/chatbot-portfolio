# backend-chatbot

API en Node.js/Express que expone un endpoint de chat por streaming (SSE) y usa Groq (API compatible con OpenAI) + un RAG simple basado en una knowledge base local para responder como asistente del portfolio.

## Que hace

- Expone `POST /api/chat/stream` que devuelve tokens por SSE (`event: delta`).
- Arma un `system prompt` (ES/EN) y obliga reglas: responder corto, usar solo contexto, no inventar datos/links.
- Recupera contexto desde una KB local (`src/data/knowledge.js`) con un retriever heuristico (`src/services/rag.js`).
- Incluye keep-alive, timeout duro y manejo de cierre del cliente para evitar streams colgados.
- Restringe CORS por allowlist (`src/config/cors.js`).

## Stack

- Runtime: Node.js (recomendado 18+ por `fetch` nativo).
- Server: Express 5.
- Streaming: Server-Sent Events (SSE) sobre HTTP.
- LLM upstream: Groq (`https://api.groq.com/openai/v1/chat/completions`).
- Config: `dotenv`.

## Estructura

```
src/
  app.js                  # Crea la app Express y exporta default (util para serverless)
  server.js               # Arranque local (app.listen)
  routes/chat.routes.js    # Rutas /api
  controllers/chat.controller.js  # Endpoint SSE + llamada a Groq
  services/rag.js          # Tokenizacion + scoring + filtro por idioma
  data/knowledge.js        # Knowledge base (docs ES/EN)
  config/
    env.js                 # Lectura de env vars (lanza error si falta GROQ_API_KEY)
    cors.js                # Allowlist de origenes
    groq.js                # Cliente groq-sdk (hoy no se usa en el controller)
```

## Requisitos

- Node.js 18+ (o 20+ recomendado)
- npm

## Instalacion

```bash
npm install
```

## Variables de entorno

Crear un `.env` en la raiz (no se commitea; esta en `.gitignore`):

```bash
GROQ_API_KEY=...              # requerido
GROQ_MODEL=llama-3.3-70b-versatile  # opcional
PORT=8787                     # opcional (default 8787)
NODE_ENV=development           # opcional
```

Defaults actuales (si no seteas nada):

- `PORT`: `8787`
- `GROQ_MODEL`: `llama-3.3-70b-versatile`

Nota: si falta `GROQ_API_KEY`, la app falla al iniciar porque `src/config/env.js` hace `throw`.

## Ejecutar

Desarrollo (recarga con nodemon):

```bash
npm run dev
```

Produccion:

```bash
npm start
```

La API queda en `http://localhost:8787` (o el `PORT` configurado).

## API

### Health

- `GET /health`
- Response: `{ "ok": true }`

### Chat streaming (SSE)

- `POST /api/chat/stream`
- Headers:
  - `Content-Type: application/json`
  - `Accept: text/event-stream` (recomendado)
- Body:

```json
{
  "messages": [{ "role": "user", "content": "Hola, que proyectos tenes?" }]
}
```

`messages` sigue el formato tipo OpenAI Chat Completions: array de objetos `{role, content}`.

Errores comunes:

- Si `messages` no es un array: HTTP 400 `{ "error": "messages must be an array" }`.

#### Eventos SSE emitidos

El server responde con `Content-Type: text/event-stream` y emite:

- `event: ready` (inmediato)
- `event: delta` con JSON: `{ "delta": "..." }` (tokens/fragmentos)
- `event: error` con JSON (si falla Groq o el server)
- `event: done` con `data: [DONE]`

Parametros actuales hacia Groq (ver `src/controllers/chat.controller.js`):

- `temperature: 0.2`
- `max_completion_tokens: 600`
- `stream: true`
- timeout duro del stream: ~60s (abort del upstream)

#### Ejemplo con curl

Usa `-N` para no bufferizar la salida:

```bash
curl -N \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -d '{"messages":[{"role":"user","content":"Hola"}]}' \
  http://localhost:8787/api/chat/stream
```

#### Ejemplo de consumo desde frontend (fetch + stream)

`EventSource` no soporta POST, asi que lo normal es usar `fetch()` y parsear SSE.

```js
async function streamChat({ baseUrl, messages, onDelta }) {
  const res = await fetch(`${baseUrl}/api/chat/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    body: JSON.stringify({ messages }),
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  if (!res.body) throw new Error("No response body");

  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const events = buffer.split(/\r?\n\r?\n/);
    buffer = events.pop() || "";

    for (const rawEvent of events) {
      const lines = rawEvent.split(/\r?\n/);
      const dataLines = lines
        .filter((l) => l.startsWith("data:"))
        .map((l) => l.slice(5).trim());

      const dataStr = dataLines.join("\n");
      if (!dataStr) continue;

      if (dataStr === "[DONE]") return;

      try {
        const payload = JSON.parse(dataStr);
        if (payload?.delta) onDelta(payload.delta);
      } catch {
        // si no es JSON, ignora o trata como texto
      }
    }
  }
}
```

## Como funciona el RAG

- La KB esta en `src/data/knowledge.js` y es un array de docs `{ id, title, text }`.
- `src/services/rag.js` hace:
  - normalizacion (lowercase + remueve acentos)
  - tokenizacion + stopwords ES/EN
  - scoring simple (hits en titulo pesan mas)
  - deteccion ES/EN y filtro para no mezclar contexto
  - fallback a "core docs" por idioma cuando la query queda vacia
- `src/controllers/chat.controller.js`:
  - detecta idioma a partir del ultimo mensaje del user
  - recupera docs con `retrieve(q, 8)`
  - asegura que siempre entren docs requeridos si estan disponibles: `assistant_style`, `links` y `contact_(es|en)`
  - construye un bloque de contexto y lo inyecta dentro del `system`.

## CORS

La allowlist esta en `src/config/cors.js`. Origenes permitidos por defecto:

- `http://localhost:3000`
- `http://localhost:5173`
- `https://portfolio-nicoespins-projects.vercel.app`

Si consumis la API desde otro dominio/puerto y te aparece `CORS blocked for origin: ...`, agrega tu origen a `ALLOWED_ORIGINS`.

## Deployment

### Opcion A: servidor Node (Render/Railway/Fly/etc.)

- Comando: `npm start`
- Variables de entorno: setear `GROQ_API_KEY` (y opcionalmente `GROQ_MODEL`, `PORT`).

### Opcion B: Vercel (serverless)

`src/app.js` exporta `default app`, que es el formato tipico para un handler de Express en entornos serverless.

En Vercel normalmente necesitas un entrypoint dentro de `/api` que re-exporte la app. Ejemplo (si tu deploy usa Vercel Functions):

```js
// api/index.js
import app from "../src/app.js";

export default app;
```

Alternativa: desplegarlo como servidor Node tradicional (Render/Railway/etc.) usando `npm start`.

## Troubleshooting

- `Missing GROQ_API_KEY in environment`: falta setear `GROQ_API_KEY` (local `.env` o env var del host).
- Stream "se queda pensando": revisa proxies/buffer; el server manda `: ping` cada 15s y setea `X-Accel-Buffering: no`.
- `upstream_error` / HTTP 401/403: API key invalida o sin permisos.
- `upstream_error` / HTTP 400: modelo invalido (`GROQ_MODEL`) o payload no compatible.
- Error de CORS: agrega el origin a `src/config/cors.js`.

## Notas de seguridad

- No commitees `.env` ni expongas `GROQ_API_KEY`.
- La KB (`src/data/knowledge.js`) contiene informacion personal pensada para el portfolio; revisala antes de publicar este repo.
- No hay rate limiting ni auth en la API (si se publica, conviene agregar ambos).
