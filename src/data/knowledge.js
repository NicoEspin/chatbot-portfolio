/**
 * Knowledge base para el chatbot del portfolio de Nico.
 * - Diseñada para RAG simple: cada ítem tiene {id, title, text}
 * - Incluye ES + EN.
 * - Actualizada con info detallada de experiencia, proyectos, skills y perfil personal.
 */

export const KNOWLEDGE = [
  // ─── SOBRE NICO ────────────────────────────────────────────────────────────
  {
    id: "about_es",
    title: "Sobre Nico (ES)",
    text: `Nicolás "Nico" Espin. Dev Full-Stack argentino nacido en Córdoba (Argentina), con foco fuerte en Frontend.
Fecha de nacimiento: 27/01/2000.
Estado: en pareja (no casado).
Perfil: construye productos web y dashboards con React/Next.js/TypeScript; también arquitecta y desarrolla backend cuando aporta valor.
Lema personal: "No soy desarrollador para solucionar problemas, sino para crear soluciones."
Está en búsqueda activa laboral — abierto a ofertas Freelance y posiciones Full Time / Part Time (remoto preferido).`,
  },
  {
    id: "about_en",
    title: "About Nico (EN)",
    text: `Nicolás "Nico" Espin. Argentine Full-Stack developer born in Córdoba, Argentina, with a strong Frontend focus.
Born on Jan 27, 2000.
Relationship: has a partner (not married).
Profile: builds web products and dashboards with React/Next.js/TypeScript; also architects and develops backend when it adds value.
Personal motto: "I'm not a developer to solve problems — I'm here to create solutions."
Actively looking for work — open to Freelance and Full Time / Part Time positions (remote preferred).`,
  },

  // ─── POR QUÉ CONTRATAR A NICO ──────────────────────────────────────────────
  {
    id: "why_hire_es",
    title: "¿Por qué contratar a Nico? (ES)",
    text: `Si estás buscando un dev que entregue, aprenda rápido y se involucre de verdad con el producto, Nico es la persona.

Tres cosas que lo diferencian:

1. Técnica sólida + visión de producto: no solo escribe código que funciona — arquitecta sistemas completos y los lanza en tiempo récord. Lideró una migración full de frontend en producción, construyó un design system de 600+ componentes y desarrolla microservicios con IA aplicada a workflows reales.

2. Siempre al día con el ecosistema: sigue de cerca los lanzamientos del mundo dev (herramientas de IA, frameworks, patrones de arquitectura) y los incorpora cuando tienen sentido real en el producto.

3. Se mete de lleno: trata cada proyecto como si fuera suyo. No espera que le digan qué hacer — propone, ejecuta y se hace responsable del resultado.

Su lema lo resume todo: "No soy desarrollador para solucionar problemas, sino para crear soluciones."

Está en búsqueda activa — abierto a Freelance y posiciones Full Time / Part Time.`,
  },
  {
    id: "why_hire_en",
    title: "Why hire Nico? (EN)",
    text: `If you're looking for a dev who ships, learns fast, and genuinely cares about the product — Nico is that person.

Three things that set him apart:

1. Strong technical depth + product mindset: he doesn't just write working code — he architects full systems and ships them fast. He led a complete production frontend migration, built a 600+ component design system, and develops AI-powered microservices for real product workflows.

2. Always up to date: he actively follows the dev ecosystem (AI tools, frameworks, architecture patterns) and adopts them when they genuinely add value.

3. Full ownership mentality: he treats every project as if it were his own. He doesn't wait to be told what to do — he proposes, executes, and owns the outcome.

His motto says it all: "I'm not a developer to solve problems — I'm here to create solutions."

He's actively looking — open to Freelance and Full Time / Part Time roles.`,
  },

  // ─── EXPERIENCIA ───────────────────────────────────────────────────────────
  {
    id: "experience_es",
    title: "Experiencia profesional (ES)",
    text: `Resumen:
- 2+ años construyendo productos web con React/Next.js y TypeScript.
- Lideró la migración de un frontend productivo desde Django Templates a Next.js + Redux.
- Construyó un design system escalable de 600+ componentes.
- Desarrolla microservicios con IA aplicada a flujos reales de producto.
- Experiencia en arquitectura de sistemas multi-tenant, autenticación JWT, APIs RESTful y tiempo real con WebSockets.

Posiciones:
- Full Stack Developer (Enfoque Frontend + IA) en Andeshire (remoto) — Enero 2025 a la fecha.
- Desarrollador Web Freelance (WordPress / React) — Agosto 2023 a Febrero 2025.
- Proyectos personales Full Stack (MERN/PERN, WebSockets, JWT, despliegue en la nube) — Diciembre 2022 a la fecha.`,
  },
  {
    id: "experience_en",
    title: "Professional experience (EN)",
    text: `Summary:
- 2+ years building web products with React/Next.js and TypeScript.
- Led a full production frontend migration from Django Templates to Next.js + Redux.
- Built a scalable 600+ component design system.
- Develops microservices with AI applied to real product workflows.
- Experience in multi-tenant system architecture, JWT auth, RESTful APIs, and real-time with WebSockets.

Positions:
- Full Stack Developer (Frontend + AI focus) at Andeshire (remote) — January 2025 to present.
- Freelance Web Developer (WordPress / React) — August 2023 to February 2025.
- Personal Full Stack projects (MERN/PERN, WebSockets, JWT, cloud deployment) — December 2022 to present.`,
  },

  // ─── ANDESHIRE (DETALLE) ───────────────────────────────────────────────────
  {
    id: "andeshire_es",
    title: "Andeshire — empresa y plataforma (ES)",
    text: `Andeshire es una plataforma ATS (Applicant Tracking System) de nivel Enterprise diseñada para automatizar y potenciar procesos de reclutamiento.

Qué hace la plataforma:
- Permite subir curriculums de candidatos: al subirlos, se lanza una request a OpenAI que analiza el CV y transforma los datos en un perfil estructurado del candidato.
- Dentro de cada oferta laboral (job/id) hay un sistema de etapas de reclutamiento totalmente configurables.
- Tiene un motor de matching llamado "Heimdall": analiza todos los candidatos de la base de datos contra los requisitos de un trabajo y clasifica a cada uno como "aplica", "no aplica" o "aplica fuertemente".
- Cada etapa puede tener agentes de IA personalizados: agentes de email, WhatsApp o LinkedIn que actúan automáticamente cuando un candidato llega a esa etapa.
- Incluye un CRM para que los reclutadores puedan ver todos los movimientos en las etapas, cuántos candidatos presentó cada reclutador a cada cliente, métricas de actividad, etc.

Aportes de Nico en Andeshire:
- Lideró la migración completa del frontend desde Django Templates a Next.js (TypeScript) + Redux en producción.
- Diseñó e implementó el design system escalable (600+ componentes reutilizables) con arquitectura Redux basada en features.
- Optimizó rendimiento con lazy loading, división de bundles, memoización y auditorías de selectores (Core Web Vitals).
- Estandarizó contratos de API entre backend Django y frontend Next.js.
- Desarrolló el microservicio de WhatsApp (Baileys).
- Construyó el microservicio de LinkedIn con NestJS + MCP + Playwright.`,
  },
  {
    id: "andeshire_en",
    title: "Andeshire — company and platform (EN)",
    text: `Andeshire is an Enterprise-level ATS (Applicant Tracking System) designed to automate and enhance recruitment workflows.

What the platform does:
- Allows uploading candidate CVs: on upload, it fires a request to OpenAI, which analyzes the CV and transforms the data into a structured candidate profile.
- Each job listing (job/id) has a fully configurable recruitment pipeline with custom stages.
- It has a matching engine called "Heimdall": it analyzes all candidates in the database against a job's requirements and classifies each one as "applies", "does not apply", or "strongly applies".
- Each stage can have custom AI agents: email, WhatsApp, or LinkedIn agents that trigger automatically when a candidate reaches that stage.
- Includes a CRM so recruiters can track all stage movements, see how many candidates each recruiter presented to each client, activity metrics, etc.

Nico's contributions at Andeshire:
- Led the full frontend migration from Django Templates to Next.js (TypeScript) + Redux in production.
- Designed and implemented the scalable design system (600+ reusable components) with a feature-based Redux architecture.
- Optimized performance with lazy loading, bundle splitting, memoization, and selector audits (Core Web Vitals).
- Standardized API contracts between Django backend and Next.js frontend.
- Developed the WhatsApp microservice (Baileys).
- Built the LinkedIn microservice with NestJS + MCP + Playwright.`,
  },

  // ─── MICROSERVICIO WHATSAPP ────────────────────────────────────────────────
  {
    id: "microservice_whatsapp_es",
    title: "Microservicio WhatsApp — Baileys (ES)",
    text: `Nico desarrolló un microservicio en Node.js integrado con Baileys (librería de WhatsApp Web).

Cómo funciona:
- Desde la plataforma Andeshire, un reclutador puede iniciar sesión con su WhatsApp Web y conectarlo a su perfil de reclutador dentro de la plataforma.
- Una vez conectado, el número de WhatsApp del reclutador puede enviar mensajes automáticos a candidatos en las etapas configuradas.
- Se usa para primeros contactos, follow-ups y otras comunicaciones de reclutamiento automatizadas por agentes de IA.

El microservicio permite que los agentes de WhatsApp actúen en nombre del reclutador de forma transparente para el candidato.`,
  },
  {
    id: "microservice_whatsapp_en",
    title: "WhatsApp Microservice — Baileys (EN)",
    text: `Nico developed a Node.js microservice integrated with Baileys (a WhatsApp Web library).

How it works:
- From the Andeshire platform, a recruiter can log in with their WhatsApp Web and link it to their recruiter profile.
- Once connected, the recruiter's WhatsApp number can automatically send messages to candidates at configured pipeline stages.
- Used for initial outreach, follow-ups, and other recruitment communications automated by AI agents.

The microservice allows WhatsApp agents to act on behalf of the recruiter, transparently for the candidate.`,
  },

  // ─── MICROSERVICIO LINKEDIN ────────────────────────────────────────────────
  {
    id: "microservice_linkedin_es",
    title: "Microservicio LinkedIn — NestJS + MCP + Playwright (ES)",
    text: `Nico construyó un microservicio en NestJS que lanza una instancia de Chromium en segundo plano usando el MCP de Playwright, con streaming de imágenes para interactuar con LinkedIn desde dentro de la plataforma Andeshire.

Capacidades del agente de LinkedIn:
- Enviar mensajes a candidatos.
- Leer y gestionar el chat de LinkedIn.
- Hacer follow-ups automáticos.
- Enviar y revisar solicitudes de conexión.
- Compatible tanto con LinkedIn normal como con Sales Navigator.

Caso de uso: cuando un candidato llega a una etapa configurada dentro de Andeshire, se puede lanzar automáticamente el agente de LinkedIn para iniciar o continuar la conversación con ese candidato desde la cuenta del reclutador.`,
  },
  {
    id: "microservice_linkedin_en",
    title: "LinkedIn Microservice — NestJS + MCP + Playwright (EN)",
    text: `Nico built a NestJS microservice that spins up a headless Chromium instance using the Playwright MCP, with image streaming to interact with LinkedIn from within the Andeshire platform.

LinkedIn agent capabilities:
- Send messages to candidates.
- Read and manage LinkedIn chats.
- Automated follow-ups.
- Send and review connection requests.
- Compatible with both standard LinkedIn and Sales Navigator.

Use case: when a candidate reaches a configured stage in Andeshire, the LinkedIn agent can be triggered automatically to start or continue the conversation with that candidate from the recruiter's account.`,
  },

  // ─── SAAS GESTIÓN DE NEGOCIOS ──────────────────────────────────────────────
  {
    id: "saas_gestion_es",
    title: "SaaS de Gestión de Negocios (ES)",
    text: `Nico está desarrollando un SaaS multi-tenant para la gestión integral de negocios. Actualmente en desarrollo, no lanzado al mercado aún.

Qué resuelve:
Centraliza toda la operación de un negocio en un solo lugar: clientes, ventas, productos, inventario, sucursales, facturas, reportes y proveedores — todo conectado para tener visibilidad total de lo que pasa en el negocio en tiempo real.

Stack técnico:
- Backend: NestJS + PostgreSQL + Prisma (adaptador pg + Pool explícito).
- Multi-tenancy: operaciones segmentadas por tenant usando Tenant + User + Membership (roles), scoping vía payload JWT.
- Auth: JWT access + refresh tokens persistidos (hash SHA-256) con cookies HTTP-only + rotación.
- Importación/Exportación: flujo preview + confirm soportando CSV/XLSX (ExcelJS), adaptadores por entidad, arquitectura extensible.
- Documentación: Swagger/OpenAPI en /api/docs.
- Validación: Zod para entorno, class-validator para DTOs.
- Observabilidad: nestjs-pino.
- Infraestructura: Docker para desarrollo local.

Funcionalidades actuales:
Productos, Categorías, Sucursales, Clientes, Empleados, Inventario (ajustes/transferencias/stock), Ventas (carrito + checkout), Facturas (emisión + PDF interno; integración con ARCA planificada).

Visión futura:
Integración de un agente de IA vía WhatsApp que permita gestionar el negocio desde un chat: consultar ventas del día, del mes, estado de caja, niveles de stock, y hasta interactuar con proveedores para realizar pedidos automáticamente.`,
  },
  {
    id: "saas_gestion_en",
    title: "Business Management SaaS (EN)",
    text: `Nico is developing a multi-tenant SaaS for comprehensive business management. Currently in active development, not yet launched.

What it solves:
Centralizes a business's full operation in one place: customers, sales, products, inventory, branches, invoices, reports, and suppliers — all connected for full real-time visibility into what's happening in the business.

Tech stack:
- Backend: NestJS + PostgreSQL + Prisma (explicit pg adapter + Pool).
- Multi-tenancy: tenant-scoped operations using Tenant + User + Membership (roles), scoped via JWT payload.
- Auth: JWT access + refresh tokens persisted (SHA-256 hash) with HTTP-only cookies + rotation.
- Import/Export: preview + confirm flow supporting CSV/XLSX (ExcelJS), per-entity adapters, extensible architecture.
- Documentation: Swagger/OpenAPI at /api/docs.
- Validation: Zod for environment, class-validator for DTOs.
- Observability: nestjs-pino.
- Infrastructure: Docker for local development.

Current features:
Products, Categories, Branches, Customers, Employees, Inventory (adjustments/transfers/stock), Sales (cart + checkout), Invoices (issuance + internal PDF; ARCA integration planned).

Future vision:
An AI agent via WhatsApp to manage the business from a chat: query today's sales, monthly breakdown, cash register status, stock levels, and even communicate with suppliers to place orders automatically.`,
  },

  // ─── PROYECTOS ─────────────────────────────────────────────────────────────
  {
    id: "projects_es",
    title: "Proyectos destacados (ES)",
    text: `Proyectos principales de Nico:

1. Andeshire — Plataforma ATS Enterprise con IA (trabajo actual). Ver "Andeshire" para detalle completo.

2. SaaS de Gestión de Negocios — Sistema multi-tenant (NestJS + PostgreSQL + Prisma) para stock, ventas, facturación, clientes y proveedores. En desarrollo. Ver "SaaS de Gestión" para detalle completo.

3. Thumblify — Generador de thumbnails para YouTube con IA. SPA con autenticación, galería personal y feed público comunitario.
   Demo: https://thumblify-chi-henna.vercel.app/
   Frontend: https://github.com/NicoEspin/Thumbnail-Generator
   Backend: https://github.com/NicoEspin/Thumbnail-Generator-Backend

4. Warup — App de chat en tiempo real full-stack con Socket.io, JWT, Zustand y MongoDB. Diseñada para 100+ conexiones concurrentes.
   Repo: https://github.com/NicoEspin/chat-app

5. Synttek (Syntek) — Landing page multi-idioma (ES/EN) con Next.js 15 + App Router + next-intl.
   Demo: https://syntek-phi.vercel.app/es
   Repo: https://github.com/NicoEspin/Syntek`,
  },
  {
    id: "projects_en",
    title: "Featured projects (EN)",
    text: `Nico's main projects:

1. Andeshire — Enterprise AI-powered ATS platform (current job). See "Andeshire" for full details.

2. Business Management SaaS — Multi-tenant system (NestJS + PostgreSQL + Prisma) for stock, sales, invoicing, customers, and suppliers. In development. See "Business Management SaaS" for full details.

3. Thumblify — AI-powered YouTube thumbnail generator. SPA with authentication, personal gallery, and public community feed.
   Live: https://thumblify-chi-henna.vercel.app/
   Frontend: https://github.com/NicoEspin/Thumbnail-Generator
   Backend: https://github.com/NicoEspin/Thumbnail-Generator-Backend

4. Warup — Full-stack real-time chat app with Socket.io, JWT, Zustand, and MongoDB. Designed for 100+ concurrent connections.
   Repo: https://github.com/NicoEspin/chat-app

5. Synttek (Syntek) — Multilingual landing page (ES/EN) with Next.js 15 + App Router + next-intl.
   Live: https://syntek-phi.vercel.app/es
   Repo: https://github.com/NicoEspin/Syntek`,
  },

  // ─── PROYECTO: THUMBLIFY ───────────────────────────────────────────────────
  {
    id: "project_thumblify_es",
    title: "Proyecto: Thumblify (ES)",
    text: `Thumblify es un generador de thumbnails para YouTube con IA (SPA frontend + backend API).

Incluye: landing, autenticación por sesión (cookies), formulario de generación con opciones (estilo, aspect ratio, esquema de color, visibilidad público/privado), galería "Mis generaciones", feed público "Comunidad" paginado con botón "Cargar más", y una vista /preview estilo YouTube.

Soporta hasta 2 imágenes de referencia con rol: auto | person | background | style.

Stack Frontend: React 19 + Vite 7 + TypeScript, React Router, Tailwind CSS v4, i18next (ES/EN), Axios (withCredentials), Motion/Lenis/Sonner/Lucide.
Stack Backend: Node/Express + TypeScript, MongoDB/Mongoose, sesiones (express-session + connect-mongo), Multer, Cloudinary, generación con Gemini (@google/genai).

Links:
- Demo: https://thumblify-chi-henna.vercel.app/
- Repo Frontend: https://github.com/NicoEspin/Thumbnail-Generator
- Repo Backend: https://github.com/NicoEspin/Thumbnail-Generator-Backend`,
  },
  {
    id: "project_thumblify_en",
    title: "Project: Thumblify (EN)",
    text: `Thumblify is an AI-powered YouTube thumbnail generator (SPA frontend + API backend).

Includes: landing page, cookie-based session auth, generation form with options (style, aspect ratio, color scheme, public/private visibility), a "My Generations" gallery, paginated public "Community" feed with "Load more", and a /preview route mimicking YouTube's layout.

Supports up to 2 reference images with roles: auto | person | background | style.

Frontend stack: React 19 + Vite 7 + TypeScript, React Router, Tailwind CSS v4, i18next (ES/EN), Axios (withCredentials), Motion/Lenis/Sonner/Lucide.
Backend stack: Node/Express + TypeScript, MongoDB/Mongoose, sessions (express-session + connect-mongo), Multer, Cloudinary, Gemini image generation (@google/genai).

Links:
- Live demo: https://thumblify-chi-henna.vercel.app/
- Frontend repo: https://github.com/NicoEspin/Thumbnail-Generator
- Backend repo: https://github.com/NicoEspin/Thumbnail-Generator-Backend`,
  },

  // ─── PROYECTO: WARUP ───────────────────────────────────────────────────────
  {
    id: "project_warup_es",
    title: "Proyecto: Warup (ES)",
    text: `Warup es una aplicación de mensajería en tiempo real full-stack.

Backend: Express.js + MongoDB + Socket.io; autenticación JWT (cookies HTTP-only), rutas protegidas, modelos User/Message con Mongoose, bcrypt para contraseñas, Cloudinary para imágenes.
Frontend: React 18 + Vite, Zustand (useAuthStore, useChatStore), React Router v7, Tailwind CSS + DaisyUI, react-hot-toast.

Características: chat en tiempo real, indicadores de usuarios online, soporte para imágenes en mensajes y perfiles, temas personalizables, rutas protegidas en frontend y backend. Diseñada para 100+ conexiones concurrentes con latencia menor a 100ms.

Repo: https://github.com/NicoEspin/chat-app`,
  },
  {
    id: "project_warup_en",
    title: "Project: Warup (EN)",
    text: `Warup is a full-stack real-time messaging application.

Backend: Express.js + MongoDB + Socket.io; JWT auth (HTTP-only cookies), protected routes, User/Message models with Mongoose, bcrypt for passwords, Cloudinary for images.
Frontend: React 18 + Vite, Zustand (useAuthStore, useChatStore), React Router v7, Tailwind CSS + DaisyUI, react-hot-toast.

Features: real-time chat, online user indicators, image support in messages and profiles, customizable themes, protected routes (frontend + backend). Designed for 100+ concurrent connections with under 100ms delivery.

Repo: https://github.com/NicoEspin/chat-app`,
  },

  // ─── PROYECTO: SYNTTEK ─────────────────────────────────────────────────────
  {
    id: "project_synttek_es",
    title: "Proyecto: Synttek (ES)",
    text: `Synttek (también escrito "Syntek") es una landing page con Next.js 15.3.x (App Router) e i18n (next-intl) para inglés y español.

Arquitectura: rutas por locale (src/app/[locale]/), secciones modulares (Hero, Introduction, Services, OurTools, About, Faqs, Contact, CallToAction) + Navbar, Footer, TitleSection.
UI/animaciones: Tailwind CSS v4, framer-motion, lucide-react, clsx + tailwind-merge. Notificaciones: react-toastify. Email desde cliente: @emailjs/browser.
Notas técnicas: middleware de next-intl para locales; tipografías Geist Sans/Mono con next/font.

Demo: https://syntek-phi.vercel.app/es
Repo: https://github.com/NicoEspin/Syntek`,
  },
  {
    id: "project_synttek_en",
    title: "Project: Synttek (EN)",
    text: `Synttek (also spelled "Syntek") is a landing page built with Next.js 15.3.x (App Router) with i18n (next-intl) for English and Spanish.

Architecture: locale-based routing (src/app/[locale]/), modular sections (Hero, Introduction, Services, OurTools, About, Faqs, Contact, CallToAction) + Navbar, Footer, TitleSection.
UI/animations: Tailwind CSS v4, framer-motion, lucide-react, clsx + tailwind-merge. Toasts: react-toastify. Client-side email: @emailjs/browser.
Technical notes: next-intl middleware for locale routing; Geist Sans/Mono via next/font.

Demo: https://syntek-phi.vercel.app/es
Repo: https://github.com/NicoEspin/Syntek`,
  },

  // ─── SKILLS ────────────────────────────────────────────────────────────────
  {
    id: "skills_es",
    title: "Skills técnicas (ES)",
    text: `Frontend:
React, Next.js (App Router), TypeScript, Redux Toolkit, Zustand, TailwindCSS, Framer Motion, Design Systems, optimización de rendimiento (Core Web Vitals, lazy loading, memoización, bundle splitting).

Backend:
Node.js, NestJS, Express, Django REST (Python), PostgreSQL, MongoDB, Prisma, APIs RESTful, autenticación JWT (access + refresh tokens, cookies HTTP-only).

IA y Automatización:
Orquestación de workflows con agentes de IA, integración con OpenAI API y Gemini (@google/genai), automatización con WhatsApp (Baileys), MCP + Playwright para agentes de browser, Gentleman Stack (Engram, SDD, Context7 vía MCP).

DevOps y Herramientas:
Git, Docker, Vercel, Render, Firebase, OpenAPI/Swagger, nestjs-pino, Zod, class-validator, ExcelJS, Cloudinary, Socket.io.

Idiomas:
Español (nativo), Inglés C1 (escritura y listening C2 según EF SET — https://cert.efset.org/Z8d5y9).`,
  },
  {
    id: "skills_en",
    title: "Technical skills (EN)",
    text: `Frontend:
React, Next.js (App Router), TypeScript, Redux Toolkit, Zustand, TailwindCSS, Framer Motion, Design Systems, performance optimization (Core Web Vitals, lazy loading, memoization, bundle splitting).

Backend:
Node.js, NestJS, Express, Django REST (Python), PostgreSQL, MongoDB, Prisma, RESTful APIs, JWT authentication (access + refresh tokens, HTTP-only cookies).

AI & Automation:
AI agent workflow orchestration, OpenAI API and Gemini (@google/genai) integration, WhatsApp automation (Baileys), MCP + Playwright for browser agents, Gentleman Stack (Engram, SDD, Context7 via MCP).

DevOps & Tools:
Git, Docker, Vercel, Render, Firebase, OpenAPI/Swagger, nestjs-pino, Zod, class-validator, ExcelJS, Cloudinary, Socket.io.

Languages:
Spanish (native), English C1 (C2 writing and listening per EF SET — https://cert.efset.org/Z8d5y9).`,
  },

  // ─── INGLÉS ────────────────────────────────────────────────────────────────
  {
    id: "english_es",
    title: "Inglés (ES)",
    text: `Nivel de inglés: C1 general. En particular: escritura C2 y listening C2 (según EF SET).
Certificado: https://cert.efset.org/Z8d5y9`,
  },
  {
    id: "english_en",
    title: "English level (EN)",
    text: `English level: C1 overall. Specifically: C2 writing and C2 listening (EF SET).
Certificate: https://cert.efset.org/Z8d5y9`,
  },

  // ─── HOBBIES ───────────────────────────────────────────────────────────────
  {
    id: "hobbies_es",
    title: "Intereses y gustos (ES)",
    text: `En su tiempo libre le gusta entrenar en el gimnasio y el gaming.
Juegos destacados: Counter-Strike, Hollow Knight, Red Dead Redemption 2 y la saga Batman Arkham.
Cultura: amante del cuarteto y del Fernet con Coca.
Fútbol: no es muy fan, pero si tiene que elegir, es de Talleres.`,
  },
  {
    id: "hobbies_en",
    title: "Interests (EN)",
    text: `In his free time he enjoys going to the gym and gaming.
Favorite games: Counter-Strike, Hollow Knight, Red Dead Redemption 2, and the Batman Arkham series.
Culture: loves cuarteto music and Fernet with Coke.
Football/soccer: not a huge fan, but if he has to pick a team, it's Talleres.`,
  },

  // ─── LINKS OFICIALES ───────────────────────────────────────────────────────
  {
    id: "links",
    title: "Links oficiales",
    text: `LinkedIn: https://www.linkedin.com/in/nicol%C3%A1s-espin/
GitHub: https://github.com/NicoEspin
Portfolio: https://portfolio-nicoespins-projects.vercel.app`,
  },

  // ─── CONTACTO ──────────────────────────────────────────────────────────────
  {
    id: "contact_es",
    title: "Contacto (ES)",
    text: `Si te preguntan algo que no está en la base o piden info específica que no tengas,
decí: "No estoy seguro con la info que tengo" y sugerí contactar a Nico desde el formulario del sitio.`,
  },
  {
    id: "contact_en",
    title: "Contact (EN)",
    text: `If you're asked something not in the knowledge base or need specific details you don't have,
say: "I'm not sure based on the info I have" and suggest contacting Nico via the website form.`,
  },

  // ─── ESTILO DEL ASISTENTE ──────────────────────────────────────────────────
  {
    id: "assistant_style",
    title: "Guía de estilo del asistente",
    text: `Reglas duras:
- Respondé corto, claro y útil.
- Usá solo el contexto disponible (KNOWLEDGE + retrieve()). No inventes links, empresas, fechas ni métricas.
- Si falta info: "no estoy seguro" + ofrecer pedir detalle o derivar a contacto.

Idioma:
- Respondé en el idioma del usuario (ES/EN).

Toque Nico:
- Tono profesional con calidez humana. En español podés usar "vos" y algún guiño cordobés MUY leve cuando encaje (ej: "de una", "joya").
- Evitá el chamuyo: preferí honestidad + pasos siguientes concretos.
- Si preguntan por gustos: cuarteto, Fernet con Coca, gym y gaming.
- Si preguntan por qué contratar a Nico: usá el bloque "why_hire" y el lema: "No soy desarrollador para solucionar problemas, sino para crear soluciones."`,
  },

  // ─── SOBRE EL CHATBOT ──────────────────────────────────────────────────────
  {
    id: "chatbot_info_es",
    title: "Sobre este chatbot (ES)",
    text: `Este chatbot (Coquito) fue creado por Nico Espin para su portfolio.
Funciona como una API backend en Node.js/Express con streaming de respuestas via SSE (Server-Sent Events).
Genera respuestas con Groq (API compatible con OpenAI) y agrega contexto con RAG simple sobre una knowledge base local.

Stack:
- Backend: Express.
- Streaming: SSE.
- IA: Groq (modelo configurable por env).
- Contexto: RAG simple con knowledge base local.

Limitaciones: responde solo con la info del contexto disponible. Si algo no está, dice que no está seguro y sugiere contactar a Nico.`,
  },
  {
    id: "chatbot_info_en",
    title: "About this chatbot (EN)",
    text: `This chatbot (Coquito) was built by Nico Espin for his portfolio.
It runs as a Node.js/Express backend API and streams responses via SSE (Server-Sent Events).
Responses are generated via Groq (OpenAI-compatible API) and enriched with simple RAG using a local knowledge base.

Stack:
- Backend: Express.
- Streaming: SSE.
- AI: Groq (model configurable via env).
- Context: simple RAG with local knowledge base.

Limitations: answers only from available context. If something is not there, it says it's not sure and suggests contacting Nico.`,
  },
];
