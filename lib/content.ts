export type Lang = "en" | "id";
type T = Record<Lang, string>;

export const profile = {
  name: "Hendra Rukmana",
  role: { en: "Backend Engineer · Full-Stack", id: "Backend Engineer · Full-Stack" },
  location: { en: "Jakarta, Indonesia · open to remote or hybrid", id: "Jakarta, Indonesia · terbuka untuk remote atau hybrid" },
  summary: {
    en: "10+ years on C# and .NET. I turn ad-hoc, per-project builds into one shared architecture and integration layer, then build the business apps on top of it, backend to frontend.",
    id: "10+ tahun di C# dan .NET. Saya mengubah build per proyek yang ad-hoc menjadi satu arsitektur dan layer integrasi bersama, lalu membangun aplikasi bisnis di atasnya, dari backend sampai frontend.",
  },
  linkedin: "https://linkedin.com/in/hendra-r",
  github: "https://github.com/hendr-maker",
};

// Search snippets: titles <= 60 chars, descriptions 150-160 chars.
export const seo = {
  title: { en: "Hendra Rukmana · .NET Backend & Full-Stack Engineer", id: "Hendra Rukmana · Backend .NET & Full-Stack Engineer" },
  description: {
    en: "Backend engineer with 10+ years in C# and .NET: integration gateways, e-commerce, warehouse and KOL platforms. See each project with its own app preview.",
    id: "Backend engineer 10+ tahun di C# dan .NET: integration gateway, e-commerce, warehouse, dan platform KOL. Lihat tiap proyek lengkap dengan preview aplikasinya.",
  },
};

// GitHub Pages project sites live under /<repo>; the deploy workflow sets both values.
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
// Internal links are plain <a> (static multi-page site), so they need the base path by hand.
export const href = (path: string) => `${basePath}${path}`;
export const abs = (path: string) => `${siteUrl}${path}`;
// Every page path ends with "/" (trailingSlash: true), which static hosts resolve to index.html.
export const pagePath = (lang: Lang, slug?: string) => `${lang === "id" ? "/id" : ""}${slug ? `/projects/${slug}` : ""}/`;


export const experience: { role: string; company: string; period: string; note: T }[] = [
  {
    role: "Backend Developer (Technical Lead scope)",
    company: "Scarlett Indonesia",
    period: "2023 – Present",
    note: {
      en: "Shared architecture, integration gateway, e-commerce, warehouse and KOL platforms.",
      id: "Arsitektur bersama, integration gateway, platform e-commerce, warehouse, dan KOL.",
    },
  },
  {
    role: ".NET Developer",
    company: "Rekadia Solusi Teknologi",
    period: "2020 – 2023",
    note: {
      en: "Permit to Work and geothermal e-settlement for energy companies, SAP integration.",
      id: "Permit to Work dan e-settlement panas bumi untuk perusahaan energi, integrasi SAP.",
    },
  },
  {
    role: ".NET Developer",
    company: "Home Credit Indonesia",
    period: "2020",
    note: {
      en: "L2/L3 support for the Genesys contact-centre platform.",
      id: "Support L2/L3 untuk platform contact center Genesys.",
    },
  },
  {
    role: ".NET Developer",
    company: "Fungsitama Cipta Teknologi",
    period: "2016 – 2020",
    note: {
      en: "Seven-module airline cargo ecosystem, banking and automotive service systems.",
      id: "Ekosistem kargo maskapai tujuh modul, sistem layanan perbankan dan otomotif.",
    },
  },
  {
    role: ".NET Developer",
    company: "Adicipta Inovasi Teknologi",
    period: "2015 – 2016",
    note: {
      en: "Consumer financing and leasing platform modules.",
      id: "Modul platform pembiayaan konsumen dan leasing.",
    },
  },
];

export const skills: { title: T; items: string[] }[] = [
  {
    title: { en: "Backend", id: "Backend" },
    items: ["C#", ".NET 6–10", "ASP.NET Core", "EF Core", "Dapper", "Laravel", "FastAPI", "Rust / Axum"],
  },
  {
    title: { en: "Frontend", id: "Frontend" },
    items: ["TypeScript", "React", "Next.js", "TanStack Query", "Tailwind CSS", "Inertia"],
  },
  {
    title: { en: "Data & Infra", id: "Data & Infra" },
    items: ["PostgreSQL", "SQL Server", "Redis", "Docker", "AWS", "GCP", "BigQuery"],
  },
  {
    title: { en: "Architecture", id: "Arsitektur" },
    items: ["Clean Architecture", "DDD", "CQRS", "gRPC", "Idempotency", "Circuit breaker", "Outbox"],
  },
  {
    title: { en: "Testing & Ops", id: "Testing & Ops" },
    items: ["xUnit", "Testcontainers", "Stryker", "NBomber", "Playwright", "OpenTelemetry", "Serilog"],
  },
];

export const services = [
  {
    title: { en: "Backend & APIs", id: "Backend & API" },
    body: {
      en: "C# / .NET services, REST APIs and background jobs on PostgreSQL or SQL Server.",
      id: "Service C# / .NET, REST API, dan background job di atas PostgreSQL atau SQL Server.",
    },
  },
  {
    title: { en: "Integrations", id: "Integrasi" },
    body: {
      en: "One shared integration layer for partners, payments and internal systems instead of one-off builds.",
      id: "Satu integration layer bersama untuk partner, pembayaran, dan sistem internal, bukan build sekali pakai.",
    },
  },
  {
    title: { en: "Business apps, end to end", id: "Aplikasi bisnis, end to end" },
    body: {
      en: "Internal and operations apps from database schema to a React / Next.js UI.",
      id: "Aplikasi internal dan operasional, dari skema database sampai UI React / Next.js.",
    },
  },
];

export const engagements = [
  { en: "Full-time roles", id: "Posisi full-time" },
  { en: "Project collaboration", id: "Kolaborasi proyek" },
];

export const ui = {
  projects: { en: "Selected works", id: "Proyek pilihan" },
  experience: { en: "Experience", id: "Pengalaman" },
  skills: { en: "Skills", id: "Keahlian" },
  contact: { en: "Let's work together", id: "Mari bekerja sama" },
  contactBody: {
    en: "Hiring for a backend or full-stack role, or need a hand on a project? Remote or Jakarta-based, here is where I can help from day one.",
    id: "Sedang mencari engineer backend atau full-stack, atau butuh bantuan di sebuah proyek? Remote atau di Jakarta, ini area yang bisa langsung saya bantu sejak hari pertama.",
  },
  helpTitle: { en: "How I can help", id: "Yang bisa saya bantu" },
  reachTitle: { en: "Get in touch", id: "Hubungi saya" },
  openTo: { en: "Open to", id: "Terbuka untuk" },
  linkedinNote: { en: "Start a conversation about a role or collaboration", id: "Mulai obrolan soal posisi atau kolaborasi" },
  githubNote: { en: "Code and personal projects", id: "Kode dan proyek pribadi" },
  switchLabel: { en: "Bahasa Indonesia", id: "English" },
  seeWork: { en: "See the work", id: "Lihat karya" },
  skip: { en: "Skip to content", id: "Langsung ke konten" },
  pause: { en: "Pause auto-scroll", id: "Jeda geser otomatis" },
  prevSlide: { en: "Previous", id: "Sebelumnya" },
  nextSlide: { en: "Next", id: "Berikutnya" },
  back: { en: "All projects", id: "Semua proyek" },
  next: { en: "Next project", id: "Proyek berikutnya" },
  stack: { en: "Tech stack", id: "Tech stack" },
  context: { en: "Context", id: "Konteks" },
  role: { en: "My role", id: "Peran saya" },
  solution: { en: "Solution", id: "Solusi" },
  features: { en: "Key features", id: "Fitur utama" },
  impact: { en: "Impact", id: "Dampak" },
  client: { en: "Client", id: "Klien" },
  moreWork: { en: "Also delivered", id: "Juga dikerjakan" },
  tabApp: { en: "App", id: "Aplikasi" },
  tabApi: { en: "API (Swagger)", id: "API (Swagger)" },
  tabFlow: { en: "Workflow", id: "Workflow" },
  tabCli: { en: "Console", id: "Console" },
  mockupNote: {
    en: "Illustrative screens with dummy data. The real system is internal and is not shown.",
    id: "Tampilan ilustrasi dengan data dummy. Sistem aslinya internal dan tidak ditampilkan.",
  },
} satisfies Record<string, T>;

export const ogImage = { url: abs("/og.png"), width: 1200, height: 630, alt: seo.title.en };

// JSON for <script type="application/ld+json">; escaping "<" keeps a "</script>" in any string from closing the tag.
export const ldJson = (value: unknown) => ({ __html: JSON.stringify(value).replace(/</g, "\\u003c") });
