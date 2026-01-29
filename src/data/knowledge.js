/**
 * Knowledge base mínima para el chatbot del portfolio de Nico.
 * - Diseñada para RAG simple: cada ítem tiene {id,title,text}
 * - Incluye ES + EN.
 * - Mantiene datos personales porque el propio Nico pidió incluirlos en su portfolio.
 */

export const KNOWLEDGE = [
  {
    id: "about_es",
    title: "Sobre Nico (ES)",
    text: `Nicolás “Nico” Espin. Dev Full-Stack argentino nacido en Córdoba (Argentina), con foco fuerte en Frontend.
Fecha de nacimiento: 27/01/2000 .
Estado: en pareja (no casado).
Perfil: construcción de productos web y dashboards con React/Next.js/TypeScript; también hace backend cuando aporta valor.`,
  },
  {
    id: "about_en",
    title: "About Nico (EN)",
    text: `Nicolás “Nico” Espin. Argentine Full‑Stack developer born in Córdoba, Argentina, with a strong Frontend focus.
Born on Jan 27, 2000 .
Relationship: has a partner (not married).
Profile: builds web products and dashboards with React/Next.js/TypeScript; also works on backend when it adds value.`,
  },
  {
    id: "experience_es",
    title: "Experiencia profesional (ES)",
    text: `Resumen de experiencia:
- +2 años construyendo productos web con React/Next.js y TypeScript.
- Lideró la migración de un frontend productivo desde Django Templates a Next.js + Redux.
- Construyó arquitectura y un design system escalable (600+ componentes).
- Trabaja con automatización/IA aplicada a flujos reales de producto.
Actualidad: Full Stack Developer (enfoque Frontend) en Andeshire (remoto), Córdoba, Argentina (2025–actualidad).
Stack habitual: Next.js, React, TypeScript, Redux Toolkit, Tailwind; y backend con Node/Nest o Django/Python según necesidad.`,
  },
  {
    id: "experience_en",
    title: "Professional experience (EN)",
    text: `Experience summary:
- 2+ years building web products with React/Next.js and TypeScript.
- Led a production frontend migration from Django Templates to Next.js + Redux.
- Built architecture and a scalable design system (600+ components).
- Works with AI/automation applied to real product workflows.
Current: Full Stack Developer (Frontend‑leaning) at Andeshire (remote), Córdoba, Argentina (2025–present).
Typical stack: Next.js, React, TypeScript, Redux Toolkit, Tailwind; plus backend with Node/Nest or Django/Python when needed.`,
  },
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
  {
    id: "projects_es",
    title: "Proyectos (ES)",
    text: `Portfolio: proyecto personal en React + Vite + Three.js (@react-three/fiber / drei) y framer-motion.
Nota: cuando Nico agregue proyectos, listarlos con bullets, breve impacto y links (demo / repo).`,
  },
  {
    id: "projects_en",
    title: "Projects (EN)",
    text: `Portfolio: personal project built with React + Vite + Three.js (@react-three/fiber / drei) and framer-motion.
Note: when Nico adds projects, list them as bullets with short impact + links (demo / repo).`,
  },
  {
    id: "links",
    title: "Links oficiales",
    text: `LinkedIn: https://www.linkedin.com/in/nicol%C3%A1s-espin/
GitHub: https://github.com/NicoEspin`,
  },
  {
    id: "hobbies_es",
    title: "Intereses y gustos (ES)",
    text: `En su tiempo libre le gusta entrenar en el gimnasio, juntarse con amigos y gaming.
Juegos destacados: Counter-Strike, Hollow Knight, Red Dead Redemption 2 y la saga Batman Arkham.
Cultura: amante del cuarteto y del Fernet con Coca.
Fútbol: no es muy fan, pero si tiene que elegir, es de Talleres.`,
  },
  {
    id: "hobbies_en",
    title: "Interests (EN)",
    text: `In his free time he enjoys going to the gym, hanging out with friends, and gaming.
Favorite games: Counter‑Strike, Hollow Knight, Red Dead Redemption 2, and the Batman Arkham series.
Culture: loves cuarteto music and Fernet with Coke.
Football/soccer: not a huge fan, but if he has to pick a team, it’s Talleres.`,
  },
  {
    id: "contact_es",
    title: "Contacto (ES)",
    text: `Si te preguntan algo que no está en la base o piden info específica (links, fechas, métricas) que no tengas,
decí: "No estoy seguro con la info que tengo" y sugerí contactar a Nico desde el formulario del sitio.`,
  },
  {
    id: "contact_en",
    title: "Contact (EN)",
    text: `If you’re asked something not covered in the knowledge base or specific details you don’t have,
say: "I’m not sure based on the info I have" and suggest contacting Nico via the website form.`,
  },
  {
    id: "assistant_style",
    title: "Guía de estilo del asistente (reglas + toque personal)",
    text: `Reglas duras:
- Respondé corto, claro y útil.
- Usá solo el contexto disponible (KNOWLEDGE + retrieve()).
- No inventes links, empresas, fechas ni métricas.
- Si falta info: "no estoy seguro" + ofrecer: pedir detalle o derivar a contacto.

Idioma:
- Respondé en el idioma del usuario (ES/EN). Si el usuario escribe en inglés, respondé en inglés.

Toque Nico:
- Tono buena onda y profesional; en español podés usar "vos" y un guiño cordobés MUY leve cuando encaje (ej: "de una", "joya").
- Si preguntan por gustos personales, recordá: cuarteto, Fernet con Coca, gym y gaming.
- Evitá chamuyo: preferí honestidad + pasos siguientes.`,
  },
  // ✅ NUEVOS: Synttek / Syntek
  {
    id: "project_synttek_es",
    title: "Proyecto: Synttek (ES)",
    text: `Synttek (también escrito "Syntek") es una landing page desarrollada con Next.js 15.3.x (App Router) con i18n (next-intl) para inglés y español.
Arquitectura: rutas por locale (src/app/[locale]/), secciones modulares (Hero, Introduction, Services, OurTools, About, Faqs, Contact, CallToAction) + componentes comunes (Navbar, Footer, TitleSection).
UI/animaciones: Tailwind CSS v4, framer-motion, motion, lucide-react. Utilidades: clsx + tailwind-merge. Notificaciones: react-toastify. Email desde cliente: @emailjs/browser.
Notas técnicas: middleware de next-intl para locales; Tailwind v4 inline en globals.css; tipografías Geist Sans/Mono con next/font.

Demo: https://syntek-phi.vercel.app/es
Repo: https://github.com/NicoEspin/Syntek
Alias: Syntek.`,
  },
  {
    id: "project_synttek_en",
    title: "Project: Synttek (EN)",
    text: `Synttek (also spelled "Syntek") is a landing page built with Next.js 15.3.x (App Router) with i18n (next-intl) for English and Spanish.
Architecture: locale-based routing (src/app/[locale]/), modular sections (Hero, Introduction, Services, OurTools, About, Faqs, Contact, CallToAction) + common components (Navbar, Footer, TitleSection).
UI/animations: Tailwind CSS v4, framer-motion, motion, lucide-react. Utilities: clsx + tailwind-merge. Toasts: react-toastify. Client-side email: @emailjs/browser.
Technical notes: next-intl middleware for locale routing; Tailwind v4 inline config in globals.css; Geist Sans/Mono via next/font.

Demo: https://syntek-phi.vercel.app/es
Repo: https://github.com/NicoEspin/Syntek
Alias: Syntek.`,
  },
  {
    id: "project_warup_es",
    title: "Proyecto: Warup (ES)",
    text: `Warup es una aplicación de mensajería en tiempo real full-stack.
Arquitectura: backend con Express.js + MongoDB + Socket.io para comunicación en vivo; frontend React 18 + Vite.
Backend: autenticación JWT (cookies HTTP-only), rutas protegidas, modelos User/Message con Mongoose, bcrypt para contraseñas, Cloudinary para imágenes.
Frontend: gestión de estado con Zustand (useAuthStore, useChatStore), enrutamiento con React Router v7, UI con Tailwind CSS + DaisyUI, notificaciones con react-hot-toast.
Características: chat en tiempo real, indicadores de usuarios online, soporte para imágenes en mensajes y perfiles, temas personalizables, rutas protegidas frontend/backend.
Stack completo: Node.js, Express, MongoDB, Socket.io, React, Vite, Zustand, Tailwind CSS, DaisyUI.

Repo: https://github.com/NicoEspin/chat-app
Nota: proyecto personal para demostrar arquitectura full-stack moderna con comunicación en tiempo real.`,
  },
  {
    id: "project_warup_en",
    title: "Project: Warup (EN)",
    text: `Warup is a full-stack real-time messaging application.
Architecture: Express.js + MongoDB + Socket.io backend for live communication; React 18 + Vite frontend.
Backend: JWT authentication (HTTP-only cookies), protected routes, User/Message models with Mongoose, bcrypt for passwords, Cloudinary for images.
Frontend: state management with Zustand (useAuthStore, useChatStore), routing with React Router v7, UI with Tailwind CSS + DaisyUI, notifications with react-hot-toast.
Features: real-time chat, online user indicators, image support in messages and profiles, customizable themes, protected routes (frontend/backend).
Full stack: Node.js, Express, MongoDB, Socket.io, React, Vite, Zustand, Tailwind CSS, DaisyUI.

Repo: https://github.com/NicoEspin/chat-app
Note: personal project showcasing modern full-stack architecture with real-time communication.`,
  },
];
