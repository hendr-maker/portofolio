import type { Lang } from "@/lib/content";

type T = Record<Lang, string>;
const t = (en: string, id: string): T => ({ en, id });

// ---------- Views: illustrative screens with invented data. Never real system data. ----------

export type Block =
  | { kind: "stats"; items: [label: string, value: string, delta?: string][] }
  | { kind: "table"; title?: string; columns: string[]; rows: string[][]; badge?: number; wide?: boolean }
  | { kind: "bars"; title: string; labels: string[]; values: number[] }
  | { kind: "kanban"; columns: { title: string; cards: string[] }[] }
  | { kind: "form"; title: string; fields: [label: string, value: string][]; actions: string[] }
  | { kind: "timeline"; title: string; items: [time: string, text: string, done?: boolean][] }
  | { kind: "progress"; title: string; items: [label: string, value: number][] };

export type Screen = { name: string; blocks: Block[] };
export type AppView = { name: string; nav: string[]; screens: Screen[] };
export type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export type Endpoint = { method: Method; path: string; summary: string; body?: string; response?: string };
export type ApiView = { title: string; version: string; baseUrl: string; auth: string; groups: { tag: string; endpoints: Endpoint[] }[] };
export type FlowView = { title: string; steps: { label: string; note?: string }[] };
export type CliView = { title: string; lines: [text: string, tone?: "ok" | "warn" | "dim" | "accent"][] };

export type View = { app?: AppView; api?: ApiView; flow?: FlowView; cli?: CliView };

export type Project = {
  slug: string;
  title: T;
  client?: T;
  summary: T;
  context: T;
  role: T;
  solution: T;
  features: T[];
  impact: T[];
  stack: string[];
  view: View;
};

export type Group = { id: "current" | "earlier" | "personal"; title: T; intro: T; internal: boolean; projects: Project[] };

const json = (v: unknown) => JSON.stringify(v, null, 2);

export const groups: Group[] = [
  {
    id: "current",
    title: t("Case studies · Scarlett Indonesia", "Studi kasus · Scarlett Indonesia"),
    intro: t(
      "Platforms I designed and maintained as backend developer with technical-lead scope, 2023 to now.",
      "Platform yang saya rancang dan kelola sebagai backend developer dengan scope technical lead, 2023 sampai sekarang.",
    ),
    internal: true,
    projects: [
      {
        slug: "e-commerce-oms",
        title: t("E-Commerce & Order Management", "E-Commerce & Manajemen Pesanan"),
        summary: t(
          "End-to-end online sales platform: orders, promotions, resellers and shipping, wired to warehouse fulfilment.",
          "Platform penjualan online end-to-end: order, promo, reseller, dan pengiriman, terhubung ke fulfilment gudang.",
        ),
        context: t(
          "The brand's online sales needed one system of record for orders, coupons, resellers and shipping, connected to the warehouse instead of re-keyed by hand.",
          "Penjualan online brand butuh satu system of record untuk order, kupon, reseller, dan pengiriman, terhubung ke gudang tanpa input ulang manual.",
        ),
        role: t(
          "Backend owner: API design, data model, integrations and background jobs; worked with the frontend team on the Next.js storefront and admin.",
          "Pemilik backend: desain API, data model, integrasi, dan background job; bekerja bersama tim frontend untuk storefront dan admin Next.js.",
        ),
        solution: t(
          "A .NET 6 Clean Architecture API with MediatR, Hangfire jobs for sync work, SignalR for real-time notifications, shipping rates from a courier aggregator and fulfilment through the warehouse system.",
          "API .NET 6 Clean Architecture dengan MediatR, job Hangfire untuk sinkronisasi, SignalR untuk notifikasi real-time, ongkir dari agregator kurir, dan fulfilment lewat sistem gudang.",
        ),
        features: [
          t("Orders, coupons, promotions and reseller pricing", "Order, kupon, promo, dan harga reseller"),
          t("Real-time order notifications over SignalR", "Notifikasi order real-time lewat SignalR"),
          t("Shipping-rate, payment gateway and warehouse fulfilment integrations", "Integrasi ongkir, payment gateway, dan fulfilment gudang"),
          t("Firebase authentication, assets on AWS S3", "Autentikasi Firebase, aset di AWS S3"),
        ],
        impact: [
          t("Carries the company's online sales on a mature release cycle (v1.36+)", "Menopang penjualan online perusahaan dengan siklus rilis yang matang (v1.36+)"),
          t("Order data flows to the warehouse without duplicate entry", "Data order mengalir ke gudang tanpa input ganda"),
        ],
        stack: [".NET 6", "EF Core", "PostgreSQL", "MediatR", "SignalR", "Hangfire", "Firebase", "AWS S3", "Next.js", "TanStack Query"],
        view: {
          app: {
            name: "Commerce Admin",
            nav: ["Dashboard", "Orders", "Products", "Promotions", "Resellers", "Shipping"],
            screens: [
              {
                name: "Dashboard",
                blocks: [
                  { kind: "stats", items: [["Orders today", "1,284", "+8.2%"], ["Revenue", "Rp 214 jt", "+5.1%"], ["Avg. basket", "Rp 167 rb"], ["Pending fulfilment", "86"]] },
                  { kind: "bars", title: "Orders · last 7 days", labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], values: [62, 70, 58, 81, 77, 95, 88] },
                  { kind: "table", title: "Latest orders", columns: ["Order", "Customer", "Total", "Status"], badge: 3, rows: [["#SO-10421", "Ayu P.", "Rp 289.000", "Paid"], ["#SO-10420", "Reseller Bdg", "Rp 1.240.000", "Packed"], ["#SO-10419", "Dimas R.", "Rp 158.000", "Shipped"], ["#SO-10418", "Nadia S.", "Rp 97.000", "Pending"]] },
                ],
              },
              {
                name: "Order detail",
                blocks: [
                  { kind: "form", title: "Order #SO-10420", fields: [["Customer", "Reseller Bandung"], ["Items", "12 SKU · 48 pcs"], ["Promotion", "RESELLER-Q4 (−12%)"], ["Courier", "REG · Rp 38.000"]], actions: ["Print invoice", "Push to warehouse"] },
                  { kind: "timeline", title: "Fulfilment", items: [["09:12", "Payment confirmed", true], ["09:13", "Sent to warehouse", true], ["10:40", "Packed · AWB issued", true], ["—", "Handed to courier"]] },
                ],
              },
              {
                name: "Promotions",
                blocks: [
                  { kind: "table", wide: true, columns: ["Code", "Type", "Usage", "Period", "Status"], badge: 4, rows: [["NEWYOU", "−15% first order", "3,120", "Oct 1–31", "Active"], ["FREESHIP", "Shipping subsidy", "8,442", "Always", "Active"], ["RESELLER-Q4", "Tier price", "412", "Q4", "Active"], ["FLASH1010", "Flash sale", "5,980", "Oct 10", "Ended"]] },
                ],
              },
            ],
          },
        },
      },
      {
        slug: "warehouse-management",
        title: t("Warehouse Management System", "Sistem Manajemen Gudang"),
        summary: t(
          "Stock control from purchase to delivery with marketplace sync, and the most heavily tested service in the stack.",
          "Kontrol stok dari pembelian sampai pengiriman dengan sinkronisasi marketplace, dan service dengan testing paling matang di stack.",
        ),
        context: t(
          "Sales, purchasing, transfers and stock lived in separate tools, and marketplace orders had to be reconciled with physical stock.",
          "Penjualan, pembelian, transfer, dan stok tersebar di tool terpisah, dan order marketplace harus dicocokkan dengan stok fisik.",
        ),
        role: t(
          "Designed the service structure and testing baseline; built order, stock and approval flows.",
          "Merancang struktur service dan baseline testing; membangun flow order, stok, dan approval.",
        ),
        solution: t(
          "70+ application services on .NET 6 with Repository + Unit of Work, MediatR and Hangfire, plus Shopee and TikTok marketplace sync through the integration gateway.",
          "70+ application service di .NET 6 dengan Repository + Unit of Work, MediatR, dan Hangfire, plus sinkronisasi marketplace Shopee dan TikTok lewat integration gateway.",
        ),
        features: [
          t("Sales, purchase and transfer orders with configurable approval chains", "Sales, purchase, dan transfer order dengan approval chain yang bisa dikonfigurasi"),
          t("Warehouse, area, rack and level locations; wave picking", "Lokasi warehouse, area, rak, dan level; wave picking"),
          t("Marketplace stock and order sync", "Sinkronisasi stok dan order marketplace"),
          t("Mutation, property-based, load and benchmark tests", "Test mutation, property-based, load, dan benchmark"),
        ],
        impact: [
          t("Production issues moved from user-reported to caught before release", "Masalah production bergeser dari dilaporkan user menjadi tertangkap sebelum rilis"),
          t("One synchronised flow between warehouse, sales and accounting", "Satu flow tersinkron antara gudang, sales, dan accounting"),
        ],
        stack: [".NET 6", "EF Core", "PostgreSQL", "MediatR", "Hangfire", "xUnit", "FsCheck", "NBomber", "Stryker"],
        view: {
          app: {
            name: "WMS",
            nav: ["Dashboard", "Sales Orders", "Purchasing", "Transfers", "Stock", "Locations", "Approvals"],
            screens: [
              {
                name: "Dashboard",
                blocks: [
                  { kind: "stats", items: [["Open sales orders", "128"], ["Picking waves", "6 active"], ["Low-stock SKUs", "14"], ["Awaiting approval", "7"]] },
                  { kind: "progress", title: "Rack occupancy", items: [["Area A · Fast movers", 86], ["Area B · Bulk", 64], ["Area C · Returns", 31], ["Area D · Overflow", 12]] },
                  { kind: "table", title: "Today's waves", columns: ["Wave", "Orders", "Picker", "Status"], badge: 3, rows: [["W-0042", "38", "Team 1", "Picking"], ["W-0041", "52", "Team 2", "Packed"], ["W-0040", "44", "Team 1", "Done"]] },
                ],
              },
              {
                name: "Sales orders",
                blocks: [
                  { kind: "table", wide: true, columns: ["SO", "Channel", "Warehouse", "Qty", "Approval", "Status"], badge: 5, rows: [["SO-2210", "Shopee", "WH-01", "24", "Auto", "Allocated"], ["SO-2209", "TikTok", "WH-01", "8", "Auto", "Picking"], ["SO-2208", "Distributor", "WH-02", "1,200", "Finance", "Waiting"], ["SO-2207", "Reseller", "WH-01", "60", "Sales Mgr", "Approved"]] },
                ],
              },
              {
                name: "Approval",
                blocks: [
                  { kind: "form", title: "SO-2208 · Term of payment 45 days", fields: [["Customer", "Distributor East"], ["Amount", "Rp 186.000.000"], ["Rule", "TOP > 30 days → Finance"], ["Requested by", "Sales Admin"]], actions: ["Reject", "Approve"] },
                  { kind: "timeline", title: "Approval chain", items: [["1", "Sales Manager approved", true], ["2", "Finance review"], ["3", "Release to warehouse"]] },
                ],
              },
            ],
          },
        },
      },
      {
        slug: "kol-management",
        title: t("KOL Management & Payment", "Manajemen & Pembayaran KOL"),
        summary: t(
          "Creator campaigns end to end, from statement of work and KPI to tax and payout, with automated bank reconciliation.",
          "Kampanye kreator end to end, dari statement of work dan KPI sampai pajak dan payout, dengan rekonsiliasi bank otomatis.",
        ),
        context: t(
          "Campaign results and creator payments were handed to finance manually, and bank transfers were matched by hand.",
          "Hasil kampanye dan pembayaran kreator diserahkan ke finance secara manual, dan transfer bank dicocokkan satu per satu.",
        ),
        role: t(
          "Led the re-architecture from the previous version to a more modular platform; owned the payment and reconciliation flows.",
          "Memimpin re-arsitektur dari versi sebelumnya ke platform yang lebih modular; memegang flow pembayaran dan rekonsiliasi.",
        ),
        solution: t(
          "ASP.NET Core with Clean Architecture and MediatR; PDF and Excel documents generated server-side; bank-transfer emails read through Microsoft Graph and matched to payouts automatically.",
          "ASP.NET Core dengan Clean Architecture dan MediatR; dokumen PDF dan Excel dibuat di server; email transfer bank dibaca lewat Microsoft Graph dan dicocokkan ke payout secara otomatis.",
        ),
        features: [
          t("Statement of work, jobs, schedules and KPI tracking", "Statement of work, job, jadwal, dan tracking KPI"),
          t("Tax calculation and creator payouts", "Perhitungan pajak dan payout kreator"),
          t("SOW and invoice PDFs, Excel exports", "PDF SOW dan invoice, export Excel"),
          t("Mailbox-based bank reconciliation via Microsoft Graph", "Rekonsiliasi bank berbasis mailbox via Microsoft Graph"),
        ],
        impact: [
          t("Removed the manual finance handoff between a finished campaign and a paid creator", "Menghapus handoff manual ke finance antara kampanye selesai dan kreator dibayar"),
          t("Avoided a recurring paid bank-integration fee by reconciling from the mailbox instead", "Menghindari biaya integrasi bank berbayar dengan rekonsiliasi dari mailbox"),
        ],
        stack: [".NET 6", "ASP.NET Core", "EF Core", "PostgreSQL", "MediatR", "Hangfire", "Microsoft Graph", "AWS S3", "Next.js"],
        view: {
          app: {
            name: "KOL Hub",
            nav: ["Dashboard", "Campaigns", "Talents", "Jobs", "KPI", "Payments", "Tax"],
            screens: [
              {
                name: "Campaign board",
                blocks: [
                  { kind: "kanban", columns: [{ title: "Statement of work", cards: ["Creator A · 3 posts", "Creator B · 1 reel"] }, { title: "Running", cards: ["Creator C · KPI 82%", "Creator F · KPI 40%"] }, { title: "KPI met", cards: ["Creator D · 1.2M views"] }, { title: "Paid", cards: ["Creator E · PPh applied"] }] },
                ],
              },
              {
                name: "Payments",
                blocks: [
                  { kind: "stats", items: [["Due this week", "Rp 84 jt"], ["Auto-matched", "37 / 41"], ["Needs review", "4"]] },
                  { kind: "table", wide: true, columns: ["Payout", "Creator", "Net (after tax)", "Bank mail", "Status"], badge: 4, rows: [["P-1042", "Creator D", "Rp 9.500.000", "Matched", "Paid"], ["P-1041", "Creator E", "Rp 4.275.000", "Matched", "Paid"], ["P-1040", "Creator C", "Rp 6.650.000", "Amount differs", "Review"], ["P-1039", "Creator B", "Rp 2.850.000", "—", "Scheduled"]] },
                ],
              },
              {
                name: "SOW",
                blocks: [
                  { kind: "form", title: "Statement of work · Spring launch", fields: [["Creator", "Creator A"], ["Deliverables", "3 posts · 2 stories"], ["KPI", "500k views · 4% ER"], ["Fee", "Rp 12.000.000"]], actions: ["Export Excel", "Generate PDF"] },
                ],
              },
            ],
          },
        },
      },
      {
        slug: "integration-gateway",
        title: t("Unified Integration Gateway", "Gateway Integrasi Terpadu"),
        summary: t(
          "One signed gateway between every internal app and external vendors: marketplaces, couriers, payments, HRIS and ERP.",
          "Satu gateway bertanda tangan antara semua aplikasi internal dan vendor eksternal: marketplace, kurir, pembayaran, HRIS, dan ERP.",
        ),
        context: t(
          "Each application integrated vendors on its own, so integration code was duplicated and a vendor outage could take an application down.",
          "Setiap aplikasi mengintegrasikan vendor sendiri-sendiri, sehingga kode integrasi terduplikasi dan vendor down bisa menjatuhkan aplikasi.",
        ),
        role: t(
          "Led its evolution from a .NET gateway for payments and shipping into a unified Laravel + Redis platform covering every integration type.",
          "Memimpin evolusinya dari gateway .NET untuk pembayaran dan pengiriman menjadi platform Laravel + Redis terpadu untuk semua jenis integrasi.",
        ),
        solution: t(
          "A pure pass-through proxy: HMAC-authenticated requests resolve the vendor tenant, pass scope, rate-limit, idempotency and circuit-breaker checks, then forward. Every hop is logged.",
          "Proxy pass-through murni: request ber-HMAC me-resolve tenant vendor, lolos cek scope, rate limit, idempotency, dan circuit breaker, lalu diteruskan. Setiap hop tercatat.",
        ),
        features: [
          t("HMAC request signing with timestamp window", "Request signing HMAC dengan jendela timestamp"),
          t("Per-scope rate limiting, idempotency keys, circuit breakers", "Rate limiting per scope, idempotency key, circuit breaker"),
          t("Per-hop traffic logging and admin console", "Logging trafik per hop dan admin console"),
          t("Queue workers on Redis / Horizon", "Queue worker di Redis / Horizon"),
        ],
        impact: [
          t("Adding a sales channel went from a full build to a configuration change", "Menambah sales channel berubah dari build penuh menjadi perubahan konfigurasi"),
          t("A vendor outage now degrades one hop instead of an application", "Vendor down kini hanya mengganggu satu hop, bukan aplikasi"),
          t("Duplicated integration code across applications eliminated", "Kode integrasi yang terduplikasi antar aplikasi dihapus"),
        ],
        stack: ["Laravel 11", "PHP 8.3", "PostgreSQL", "Redis", "Horizon", ".NET 6", "OpenTelemetry"],
        view: {
          api: {
            title: "Integration Gateway API",
            version: "v1",
            baseUrl: "https://gateway.example/api/v1",
            auth: "HMAC-SHA256 · X-Client-Key, X-Timestamp, X-Signature",
            groups: [
              {
                tag: "Marketplace",
                endpoints: [
                  { method: "POST", path: "/{tenant}/orders/search", summary: "Search marketplace orders by update window", body: json({ updated_from: "2026-10-01T00:00:00Z", page_size: 50 }), response: json({ data: [{ order_sn: "2610XXXX01", status: "READY_TO_SHIP" }], next_cursor: "eyJwIjoyfQ" }) },
                  { method: "GET", path: "/{tenant}/orders/{orderSn}", summary: "Order detail passthrough" },
                ],
              },
              {
                tag: "Shipping",
                endpoints: [
                  { method: "POST", path: "/shipping/rates", summary: "Compare courier rates" },
                  { method: "GET", path: "/shipping/tracking/{awb}", summary: "Track an airwaybill" },
                ],
              },
              {
                tag: "Accounting & HRIS",
                endpoints: [
                  { method: "POST", path: "/accounting/invoices", summary: "Create invoice in ERP (Idempotency-Key required)" },
                  { method: "GET", path: "/hris/employees", summary: "List employees from HRIS" },
                ],
              },
            ],
          },
          flow: {
            title: "Request lifecycle",
            steps: [
              { label: "Internal app", note: "signs request" },
              { label: "Verify HMAC", note: "key · timestamp window" },
              { label: "Scope & rate limit", note: "per client, per scope" },
              { label: "Idempotency", note: "replay-safe writes" },
              { label: "Circuit breaker", note: "fail fast per vendor" },
              { label: "Vendor", note: "marketplace · courier · ERP" },
              { label: "Log every hop", note: "traffic observability" },
            ],
          },
          app: {
            name: "Gateway Console",
            nav: ["Traffic", "Clients", "Vendors", "Scopes", "Breakers", "Logs"],
            screens: [
              {
                name: "Traffic",
                blocks: [
                  { kind: "stats", items: [["Requests / min", "1,284"], ["p95 latency", "142 ms"], ["Error rate", "0.4%"], ["Breakers open", "1"]] },
                  { kind: "table", wide: true, title: "Live requests", columns: ["Method", "Route", "Client", "Vendor", "Status", "Time"], badge: 4, rows: [["POST", "/orders/search", "wms", "marketplace", "200", "84 ms"], ["GET", "/shipping/tracking", "oms", "courier", "200", "132 ms"], ["POST", "/accounting/invoices", "finance", "erp", "409", "12 ms"], ["GET", "/shipping/tracking", "bot", "courier", "503", "breaker open"]] },
                ],
              },
            ],
          },
        },
      },
      {
        slug: "budgeting-monitoring",
        title: t("Budgeting & Trade Monitoring", "Monitoring Anggaran & Trade"),
        summary: t(
          "Budget planning, execution and reporting with trade-activity monitoring, fed by the ERP.",
          "Perencanaan, eksekusi, dan pelaporan budget dengan monitoring aktivitas trade, datanya dari ERP.",
        ),
        context: t(
          "Budget plans lived in spreadsheets while actual spend sat in the ERP, so plan-versus-actual was always late.",
          "Rencana budget ada di spreadsheet sementara realisasi ada di ERP, sehingga plan vs actual selalu terlambat.",
        ),
        role: t("Built the backend, ERP integration and reporting.", "Membangun backend, integrasi ERP, dan pelaporan."),
        solution: t(
          "Laravel 12 with a React 19 frontend through Inertia, realisation pulled from Odoo, tested with Pest and shipped in Docker.",
          "Laravel 12 dengan frontend React 19 lewat Inertia, realisasi ditarik dari Odoo, dites dengan Pest, dan dikirim dalam Docker.",
        ),
        features: [
          t("Budget plans by brand, channel and period", "Rencana budget per brand, channel, dan periode"),
          t("Realisation synced from Odoo", "Realisasi tersinkron dari Odoo"),
          t("Trade and distribution activity monitoring", "Monitoring aktivitas trade dan distribusi"),
        ],
        impact: [t("Plan versus actual visible without waiting for month-end spreadsheets", "Plan vs actual terlihat tanpa menunggu spreadsheet akhir bulan")],
        stack: ["Laravel 12", "PHP", "React 19", "Inertia 2", "Tailwind 4", "PostgreSQL 16", "Odoo", "Pest", "Docker"],
        view: {
          app: {
            name: "Budget",
            nav: ["Overview", "Budget plans", "Realisation", "Trade activities", "Reports"],
            screens: [
              {
                name: "Overview",
                blocks: [
                  { kind: "stats", items: [["Planned FY", "Rp 4,8 M"], ["Realised", "Rp 3,1 M", "65%"], ["Committed", "Rp 0,6 M"]] },
                  { kind: "progress", title: "Absorption by program", items: [["Trade promotion", 82], ["Marketing events", 54], ["Listing fees", 31], ["Display rental", 67]] },
                  { kind: "bars", title: "Monthly realisation", labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep"], values: [40, 52, 61, 58, 73, 80] },
                ],
              },
              {
                name: "Budget plans",
                blocks: [
                  { kind: "table", wide: true, columns: ["Program", "Brand", "Planned", "Actual", "Status"], badge: 4, rows: [["Q4 Trade promo", "Brand A", "Rp 900 jt", "Rp 740 jt", "On track"], ["Year-end event", "Brand B", "Rp 450 jt", "Rp 510 jt", "Over"], ["Store listing", "Brand A", "Rp 300 jt", "Rp 92 jt", "Under"]] },
                ],
              },
            ],
          },
        },
      },
      {
        slug: "ticketing-workflow",
        title: t("Ticketing & Document Workflow", "Ticketing & Alur Dokumen"),
        summary: t(
          "Internal helpdesk with document sign-off, approvals and a changelog, updating live without an ORM.",
          "Helpdesk internal dengan sign-off dokumen, approval, dan changelog, ter-update live tanpa ORM.",
        ),
        context: t(
          "Requests, approvals and document sign-offs ran through chat and email, with no audit trail.",
          "Request, approval, dan sign-off dokumen berjalan lewat chat dan email, tanpa audit trail.",
        ),
        role: t(
          "Led an incremental refactor to route, service, repository and schema layers without pausing features.",
          "Memimpin refactor bertahap ke layer route, service, repository, dan schema tanpa menghentikan fitur.",
        ),
        solution: t(
          "Next.js 16 with raw SQL on PostgreSQL, one API gate for auth, roles, CSRF and Zod validation, and Server-Sent Events driven by Postgres LISTEN/NOTIFY.",
          "Next.js 16 dengan raw SQL di PostgreSQL, satu gerbang API untuk auth, role, CSRF, dan validasi Zod, serta Server-Sent Events dari Postgres LISTEN/NOTIFY.",
        ),
        features: [
          t("Tickets, mentions and live comments", "Tiket, mention, dan komentar live"),
          t("Document sign-off and multi-step approvals", "Sign-off dokumen dan approval bertingkat"),
          t("Append-only audit log written in the same transaction", "Audit log append-only ditulis dalam transaksi yang sama"),
          t("Generated documents (minutes of meeting, DOCX)", "Dokumen otomatis (notulen, DOCX)"),
        ],
        impact: [t("Every request and approval now has an owner, a status and an audit trail", "Setiap request dan approval kini punya owner, status, dan audit trail")],
        stack: ["Next.js 16", "React 19", "TypeScript", "PostgreSQL", "Zod", "SSE", "Playwright"],
        view: {
          app: {
            name: "Desk",
            nav: ["Inbox", "Tickets", "Documents", "Approvals", "Changelog"],
            screens: [
              {
                name: "Tickets",
                blocks: [
                  { kind: "stats", items: [["Open", "42"], ["In review", "11"], ["Overdue", "3"]] },
                  { kind: "table", wide: true, columns: ["#", "Title", "Requester", "Owner", "Status"], badge: 4, rows: [["T-218", "Generate meeting minutes", "Ops", "@dina", "In review"], ["T-217", "Approve vendor document", "Procurement", "@raka", "Open"], ["T-216", "Access request: finance share", "Finance", "@sari", "Open"], ["T-215", "Update SOP template", "QA", "@sari", "Done"]] },
                ],
              },
              {
                name: "Ticket T-217",
                blocks: [
                  { kind: "timeline", title: "Activity · live", items: [["09:02", "Created by Procurement", true], ["09:15", "@raka assigned", true], ["10:31", "Comment: please attach the signed NDA", true], ["now", "Waiting for document"]] },
                  { kind: "form", title: "Sign-off", fields: [["Document", "Vendor agreement v3.pdf"], ["Signers", "Legal → Finance → Director"], ["Current", "Finance"]], actions: ["Request changes", "Sign"] },
                ],
              },
            ],
          },
        },
      },
      {
        slug: "partner-integration-api",
        title: t("Partner Integration API", "API Integrasi Partner"),
        summary: t(
          "Public API for partners and clients with signed, time-boxed requests.",
          "API publik untuk partner dan klien dengan request bertanda tangan dan berbatas waktu.",
        ),
        context: t(
          "Partners needed self-service access to lookups and orders without being given direct database or internal API access.",
          "Partner butuh akses mandiri ke lookup dan order tanpa diberi akses langsung ke database atau API internal.",
        ),
        role: t("Designed the authentication scheme and the API.", "Merancang skema autentikasi dan API-nya."),
        solution: t(
          "Access token plus HMAC signature over a base string with timestamp and client key; requests outside the time window are rejected.",
          "Access token plus signature HMAC atas base string berisi timestamp dan client key; request di luar jendela waktu ditolak.",
        ),
        features: [
          t("Token issuance per client key", "Penerbitan token per client key"),
          t("HMAC signature with replay window", "Signature HMAC dengan jendela replay"),
          t("Lookups (couriers, products) and order endpoints", "Endpoint lookup (kurir, produk) dan order"),
        ],
        impact: [t("Partners integrate without access to internal systems", "Partner bisa integrasi tanpa akses ke sistem internal")],
        stack: [".NET 6", "ASP.NET Core", "EF Core", "PostgreSQL"],
        view: {
          api: {
            title: "Partner API",
            version: "v1",
            baseUrl: "https://partner-api.example",
            auth: "access-token + signature (HMAC) + timestamp + client-key",
            groups: [
              { tag: "Auth", endpoints: [{ method: "POST", path: "/api/auth/token", summary: "Get access token", body: json({ client_key: "ck_demo_7f3a", timestamp: 1760000000, signature: "HMAC-SHA256(...)" }), response: json({ access_token: "eyJhbGciOi...", expires_in: 3600 }) }] },
              { tag: "Lookups", endpoints: [{ method: "GET", path: "/api/lookups/couriers", summary: "List couriers" }, { method: "GET", path: "/api/lookups/products", summary: "List products" }] },
              { tag: "Orders", endpoints: [{ method: "POST", path: "/api/orders", summary: "Create order" }, { method: "GET", path: "/api/orders/{id}", summary: "Order status" }] },
            ],
          },
          flow: {
            title: "Signed call",
            steps: [
              { label: "Partner", note: "client key + secret" },
              { label: "Build base string", note: "method · path · timestamp" },
              { label: "Sign HMAC", note: "SHA-256" },
              { label: "API verifies", note: "token · signature · window" },
              { label: "Response", note: "or 401 on replay" },
            ],
          },
        },
      },
      {
        slug: "order-data-pipeline",
        title: t("Multi-brand Order Data Pipeline", "Pipeline Data Order Multi-brand"),
        summary: t(
          "Marketplace orders, returns and settlements for several brands, synced into an OMS and replicated to BigQuery for Power BI.",
          "Order, retur, dan settlement marketplace beberapa brand, disinkron ke OMS dan direplikasi ke BigQuery untuk Power BI.",
        ),
        context: t(
          "Management reporting needed marketplace data from several brands in one place, refreshed hourly.",
          "Pelaporan manajemen butuh data marketplace beberapa brand di satu tempat, ter-update per jam.",
        ),
        role: t("Designed and built the pipeline, schema and runbook; decisions recorded as ADRs.", "Merancang dan membangun pipeline, schema, dan runbook; keputusan dicatat sebagai ADR."),
        solution: t(
          "Scheduled Cloud Run jobs pull through the integration gateway into PostgreSQL on AWS RDS with checkpoints, then extract Parquet to BigQuery raw and mart layers.",
          "Cloud Run job terjadwal menarik data lewat integration gateway ke PostgreSQL di AWS RDS dengan checkpoint, lalu extract Parquet ke layer raw dan mart BigQuery.",
        ),
        features: [
          t("Checkpointed, re-runnable sync with backfill", "Sync ber-checkpoint yang bisa diulang, dengan backfill"),
          t("Cross-cloud over static NAT IP with verify-full TLS", "Cross-cloud lewat static NAT IP dengan TLS verify-full"),
          t("Hourly extract to BigQuery for Power BI", "Extract per jam ke BigQuery untuk Power BI"),
        ],
        impact: [t("Brand and channel performance in one dashboard, refreshed hourly", "Performa brand dan channel dalam satu dashboard, ter-update per jam")],
        stack: ["Python", "Alembic", "PostgreSQL", "AWS RDS", "Cloud Run", "BigQuery", "Power BI"],
        view: {
          flow: {
            title: "Data flow",
            steps: [
              { label: "Cloud Scheduler", note: "hourly" },
              { label: "oms-sync job", note: "Cloud Run" },
              { label: "Integration gateway", note: "Shopee · TikTok" },
              { label: "OMS Postgres", note: "AWS RDS · checkpoints" },
              { label: "oms-extract job", note: "Parquet → GCS" },
              { label: "BigQuery", note: "raw → mart" },
              { label: "Power BI", note: "import refresh" },
            ],
          },
          cli: {
            title: "gcloud run jobs execute oms-sync",
            lines: [
              ["▶ oms-sync started · brands=3 · window=PT1H", "accent"],
              ["  brand-a/shopee   orders  +412  returns +9   checkpoint 10:00Z", "ok"],
              ["  brand-a/tiktok   orders  +188  returns +3   checkpoint 10:00Z", "ok"],
              ["  brand-b/shopee   429 rate limited · retry in 2s", "warn"],
              ["  brand-b/shopee   orders  +97   returns +1   checkpoint 10:00Z", "ok"],
              ["  settlements      candidates 61 · fetched 61", "dim"],
              ["✔ done in 3m12s · next run 11:00Z", "accent"],
            ],
          },
        },
      },
      {
        slug: "shipment-tracking-bot",
        title: t("Shipment Tracking Bot", "Bot Tracking Pengiriman"),
        summary: t(
          "Desktop bot that bulk-checks shipment status through the gateway, used daily by operations.",
          "Bot desktop untuk cek status pengiriman massal lewat gateway, dipakai harian oleh tim operasional.",
        ),
        context: t("Operations checked hundreds of airwaybills one by one on courier websites.", "Tim operasional mengecek ratusan resi satu per satu di website kurir."),
        role: t("Built and released it end to end.", "Membangun dan merilisnya end to end."),
        solution: t(
          "A single-file Python tool that reads a spreadsheet, calls the gateway within its rate limit and writes results back; packaged with PyInstaller by a scripted release.",
          "Tool Python satu file yang membaca spreadsheet, memanggil gateway sesuai rate limit, lalu menulis hasilnya; dipaketkan dengan PyInstaller lewat release terskrip.",
        ),
        features: [
          t("Throughput tuned to the server rate limit with backoff", "Throughput disesuaikan rate limit server dengan backoff"),
          t("Regression tests guard every fixed bug", "Regression test menjaga setiap bug yang sudah diperbaiki"),
          t("One-command release: bump, test, build, verify, tag", "Release satu perintah: bump, test, build, verify, tag"),
        ],
        impact: [t("Bulk tracking became a one-click job for operations", "Tracking massal jadi pekerjaan satu klik untuk operasional")],
        stack: ["Python", "PyInstaller", "PowerShell"],
        view: {
          cli: {
            title: "tracking-bot.exe",
            lines: [
              ["> Load shipments.xlsx (1,240 AWB)", "accent"],
              ["> Rate limit 60 req/min · workers 4", "dim"],
              ["  AWB0000001  DELIVERED     Jakarta", "ok"],
              ["  AWB0000002  IN_TRANSIT    Bandung", "warn"],
              ["  AWB0000003  DELIVERED     Surabaya", "ok"],
              ["  AWB0000004  RETRY (429)   backoff 2s", "dim"],
              ["  AWB0000004  DELIVERED     Cirebon", "ok"],
              ["[████████████░░░░] 78%  967/1240"],
              ["> Writing output/result.xlsx", "dim"],
            ],
          },
          flow: {
            title: "Run",
            steps: [{ label: "Spreadsheet", note: "list of AWB" }, { label: "Bot", note: "rate-limited workers" }, { label: "Integration gateway", note: "HMAC" }, { label: "Courier APIs" }, { label: "Result sheet", note: "status per AWB" }],
          },
        },
      },
      {
        slug: "service-architecture-template",
        title: t("Service Architecture Standard", "Standar Arsitektur Service"),
        summary: t(
          "The shared Clean Architecture template and internal library that 8 backend services were standardised on.",
          "Template Clean Architecture dan library internal bersama yang menjadi standar 8 service backend.",
        ),
        context: t(
          "Each service followed its author's preferences, so new services took weeks to set up and developers could not move between codebases.",
          "Setiap service mengikuti preferensi pembuatnya, sehingga setup service baru butuh berminggu-minggu dan developer sulit pindah codebase.",
        ),
        role: t(
          "Defined the standard and made it hold: shared library, code review, pairing and documented patterns.",
          "Mendefinisikan standar dan menjaganya: shared library, code review, pairing, dan pola yang terdokumentasi.",
        ),
        solution: t(
          "A layered .NET template (Api, Services, Domain, Infrastructure) with CQRS via MediatR, Hangfire, structured logging to CloudWatch, health checks and Testcontainers integration tests.",
          "Template .NET berlapis (Api, Services, Domain, Infrastructure) dengan CQRS via MediatR, Hangfire, structured logging ke CloudWatch, health check, dan integration test Testcontainers.",
        ),
        features: [
          t("Dependency rule enforced by architecture tests", "Dependency rule dijaga oleh architecture test"),
          t("Integration tests on real PostgreSQL via Testcontainers + Respawn", "Integration test di PostgreSQL asli via Testcontainers + Respawn"),
          t("Logging, tracing and health checks wired by default", "Logging, tracing, dan health check terpasang default"),
        ],
        impact: [
          t("New service setup cut from weeks to days", "Setup service baru dari hitungan minggu jadi hari"),
          t("Developers move between services without relearning the codebase", "Developer pindah service tanpa belajar ulang codebase"),
        ],
        stack: [".NET 10", "ASP.NET Core", "EF Core", "PostgreSQL", "MediatR", "Hangfire", "Serilog", "Testcontainers"],
        view: {
          flow: {
            title: "Dependency direction",
            steps: [{ label: "Api", note: "controllers · middleware" }, { label: "Services", note: "MediatR handlers · validators" }, { label: "Domain", note: "entities · rules" }, { label: "Infrastructure", note: "EF Core · jobs · clients" }],
          },
          cli: {
            title: "dotnet test",
            lines: [
              ["$ dotnet test Service.Tests.Unit", "accent"],
              ["  Passed!  Failed: 0, Passed: 412, Skipped: 0 (3.1 s)", "ok"],
              ["$ dotnet test Service.Tests.Integration", "accent"],
              ["  Starting postgres:16 container (Testcontainers)", "dim"],
              ["  Passed!  Failed: 0, Passed: 96, Skipped: 0 (41 s)", "ok"],
              ["$ dotnet test --filter Category=Architecture", "accent"],
              ["  Domain has no dependency on Infrastructure ✔", "ok"],
            ],
          },
        },
      },
      {
        slug: "document-ocr",
        title: t("Document Management with OCR", "Manajemen Dokumen dengan OCR"),
        summary: t(
          "Turns distributor reports and scanned documents into normalised, comparable data.",
          "Mengubah laporan distributor dan dokumen hasil scan menjadi data yang ternormalisasi dan bisa dibandingkan.",
        ),
        context: t("Distributor sales reports arrived as PDFs and spreadsheets in many different layouts.", "Laporan penjualan distributor datang sebagai PDF dan spreadsheet dengan banyak format berbeda."),
        role: t("Built the extraction pipeline and normalisation rules.", "Membangun pipeline ekstraksi dan aturan normalisasi."),
        solution: t(
          "A separate reader service with optional OCR, header normalisation across distributor formats, and a web app for review.",
          "Reader service terpisah dengan OCR opsional, normalisasi header lintas format distributor, dan aplikasi web untuk review.",
        ),
        features: [
          t("Upload, OCR and header normalisation", "Upload, OCR, dan normalisasi header"),
          t("Review screen before data is accepted", "Layar review sebelum data diterima"),
          t("S3-compatible storage", "Storage kompatibel S3"),
        ],
        impact: [t("Distributor data comparable across formats without manual re-typing", "Data distributor bisa dibandingkan lintas format tanpa ketik ulang")],
        stack: ["Python", "OCR", "Laravel", "React", "PostgreSQL", "Redis", "MinIO"],
        view: {
          app: {
            name: "Reports",
            nav: ["Uploads", "Review", "Distributors", "Reports"],
            screens: [
              {
                name: "Uploads",
                blocks: [
                  { kind: "table", wide: true, columns: ["File", "Distributor", "Pages", "Rows", "Status"], badge: 4, rows: [["sept-sales.pdf", "Distributor East", "4", "312", "Extracted"], ["sept-sales.xlsx", "Distributor West", "—", "1,048", "Normalised"], ["scan-0921.jpg", "Distributor North", "1", "—", "OCR running"]] },
                  { kind: "bars", title: "Sales by region (normalised)", labels: ["West", "Central", "East", "North", "South"], values: [80, 64, 72, 40, 55] },
                ],
              },
            ],
          },
        },
      },
    ],
  },
  {
    id: "earlier",
    title: t("Earlier client work", "Proyek klien sebelumnya"),
    intro: t(
      "Enterprise systems delivered for energy, airline and banking clients, 2015 to 2023. Client names withheld.",
      "Sistem enterprise untuk klien energi, maskapai, dan perbankan, 2015 sampai 2023. Nama klien tidak ditampilkan.",
    ),
    internal: true,
    projects: [
      {
        slug: "geothermal-e-settlement",
        title: t("Geothermal Production to E-Settlement", "Produksi Panas Bumi ke E-Settlement"),
        client: t("State-owned geothermal energy company", "Perusahaan energi panas bumi BUMN"),
        summary: t(
          "Field production data feeding commercial settlement in a single flow.",
          "Data produksi lapangan langsung masuk ke settlement komersial dalam satu flow.",
        ),
        context: t("Production figures were re-entered by finance before every settlement, on a revenue-critical process.", "Angka produksi diinput ulang oleh finance sebelum setiap settlement, pada proses yang menyangkut revenue."),
        role: t("Backend developer; led SAP and third-party integration design.", "Backend developer; memimpin desain integrasi SAP dan pihak ketiga."),
        solution: t("ASP.NET Core application linking field production data to settlement with approval workflows and SAP integration.", "Aplikasi ASP.NET Core yang menghubungkan data produksi lapangan ke settlement dengan workflow approval dan integrasi SAP."),
        features: [t("Production data capture and validation", "Input dan validasi data produksi"), t("Settlement calculation and approval", "Perhitungan dan approval settlement"), t("SAP integration", "Integrasi SAP")],
        impact: [t("Eliminated manual reconciliation between field operations and finance", "Menghapus rekonsiliasi manual antara operasi lapangan dan finance"), t("Approval cycle time cut from days to hours", "Waktu siklus approval dari hitungan hari jadi jam")],
        stack: ["ASP.NET Core", "C#", "SQL Server", "PostgreSQL", "SAP"],
        view: {
          app: {
            name: "E-Settlement",
            nav: ["Dashboard", "Production", "Settlement", "Approvals", "Reports"],
            screens: [
              {
                name: "Settlement",
                blocks: [
                  { kind: "stats", items: [["Steam delivered (MTD)", "412,800 t"], ["Electricity (MTD)", "58.2 GWh"], ["Settlements pending", "3"]] },
                  { kind: "timeline", title: "Settlement · September", items: [["1", "Production data locked", true], ["2", "Operations verified", true], ["3", "Finance review"], ["4", "Posted to SAP"]] },
                  { kind: "bars", title: "Daily production", labels: ["W1", "W2", "W3", "W4"], values: [72, 78, 69, 81] },
                ],
              },
            ],
          },
        },
      },
      {
        slug: "permit-to-work",
        title: t("Permit to Work System", "Sistem Permit to Work"),
        client: t("Geothermal power producer", "Produsen listrik panas bumi"),
        summary: t("Paperless, traceable safety work permits for a geothermal operation.", "Izin kerja keselamatan yang paperless dan bisa ditelusuri untuk operasi panas bumi."),
        context: t("Safety-critical work permits were paper forms that were hard to audit.", "Izin kerja yang kritikal untuk keselamatan masih berupa formulir kertas yang sulit diaudit."),
        role: t(".NET developer on the permit and approval flows.", ".NET developer untuk flow permit dan approval."),
        solution: t("ASP.NET MVC application with role-based multi-step approvals and a full audit trail.", "Aplikasi ASP.NET MVC dengan approval bertingkat berbasis role dan audit trail lengkap."),
        features: [t("Permit request with hazard and isolation checklist", "Pengajuan permit dengan checklist bahaya dan isolasi"), t("Multi-step approval by role", "Approval bertingkat berdasarkan role"), t("Audit trail for every permit", "Audit trail untuk setiap permit")],
        impact: [t("Permits became traceable and auditable instead of paper-based", "Permit jadi bisa ditelusuri dan diaudit, bukan lagi kertas"), t("Approval cycle time cut from days to hours", "Waktu siklus approval dari hitungan hari jadi jam")],
        stack: ["ASP.NET MVC", "C#", "SQL Server"],
        view: {
          app: {
            name: "PTW",
            nav: ["My permits", "Approvals", "Active work", "Audit"],
            screens: [
              {
                name: "Permit",
                blocks: [
                  { kind: "form", title: "PTW-2023-0418 · Hot work", fields: [["Location", "Well pad 3 · Separator"], ["Hazards", "Hot work · H₂S area"], ["Isolation", "LOTO applied · verified"], ["Valid", "07:00–17:00"]], actions: ["Reject", "Approve"] },
                  { kind: "timeline", title: "Approvals", items: [["07:05", "Requested by contractor", true], ["07:20", "Area authority approved", true], ["07:31", "HSE officer review"], ["—", "Issued"]] },
                ],
              },
            ],
          },
        },
      },
      {
        slug: "hse-master-material",
        title: t("HSE Management & SAP Master Material", "Manajemen HSE & Master Material SAP"),
        client: t("Geothermal power producer", "Produsen listrik panas bumi"),
        summary: t("Safety, health and environment reporting plus SAP-integrated material master data.", "Pelaporan keselamatan, kesehatan, dan lingkungan plus master data material yang terintegrasi SAP."),
        context: t("Incident reporting and material master changes ran through manual forms.", "Pelaporan insiden dan perubahan master material berjalan lewat formulir manual."),
        role: t(".NET developer.", ".NET developer."),
        solution: t("Two ASP.NET applications: HSE incident and inspection reporting, and a material master request flow synced to SAP.", "Dua aplikasi ASP.NET: pelaporan insiden dan inspeksi HSE, serta flow request master material yang tersinkron ke SAP."),
        features: [t("Incident and inspection reporting", "Pelaporan insiden dan inspeksi"), t("Material master request and approval", "Request dan approval master material"), t("SAP synchronisation", "Sinkronisasi SAP")],
        impact: [],
        stack: ["ASP.NET Core", "C#", "SQL Server", "SAP"],
        view: {
          app: {
            name: "HSE",
            nav: ["Dashboard", "Incidents", "Inspections", "Material master"],
            screens: [
              {
                name: "Dashboard",
                blocks: [
                  { kind: "stats", items: [["Days without LTI", "214"], ["Open findings", "9"], ["Inspections (MTD)", "37"]] },
                  { kind: "table", columns: ["Finding", "Area", "Severity", "Status"], badge: 3, rows: [["F-112", "Power plant", "Medium", "Open"], ["F-111", "Well pad 2", "Low", "Closed"], ["F-110", "Warehouse", "High", "In progress"]] },
                ],
              },
            ],
          },
        },
      },
      {
        slug: "gas-transmission-bi",
        title: t("Gas Transmission BI & Facilities", "BI Transmisi Gas & Fasilitas"),
        client: t("Gas transmission company", "Perusahaan transmisi gas"),
        summary: t("Analytics dashboard for pipeline transmission and a facilities information system.", "Dashboard analitik transmisi pipa dan sistem informasi fasilitas."),
        context: t("Transmission and facility data sat in separate reports.", "Data transmisi dan fasilitas tersebar di laporan terpisah."),
        role: t(".NET developer; data-layer optimisation.", ".NET developer; optimasi data layer."),
        solution: t("ASP.NET dashboards over SQL Server and PostgreSQL with query tuning.", "Dashboard ASP.NET di atas SQL Server dan PostgreSQL dengan query tuning."),
        features: [t("Transmission volume and pressure analytics", "Analitik volume dan tekanan transmisi"), t("Facility asset register", "Register aset fasilitas")],
        impact: [t("Query cost reduced by about 30 percent through data-layer optimisation", "Biaya query turun sekitar 30 persen lewat optimasi data layer")],
        stack: ["ASP.NET Core", "C#", "SQL Server", "PostgreSQL"],
        view: {
          app: {
            name: "BI",
            nav: ["Overview", "Transmission", "Facilities", "Reports"],
            screens: [
              {
                name: "Transmission",
                blocks: [
                  { kind: "stats", items: [["Throughput", "1,020 MMSCFD"], ["Line pack", "Normal"], ["Stations online", "12 / 12"]] },
                  { kind: "bars", title: "Daily throughput", labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], values: [78, 82, 80, 85, 83, 70, 68] },
                  { kind: "progress", title: "Segment utilisation", items: [["Segment 1", 88], ["Segment 2", 71], ["Segment 3", 54]] },
                ],
              },
            ],
          },
        },
      },
      {
        slug: "airline-cargo",
        title: t("Airline Cargo Ecosystem", "Ekosistem Kargo Maskapai"),
        client: t("National airline cargo, later two more carriers", "Kargo maskapai nasional, lalu dua maskapai lain"),
        summary: t(
          "Seven-module cargo platform: operations, tracking, door-to-door, auto dimension, x-ray capture and airwaybill.",
          "Platform kargo tujuh modul: operasional, tracking, door-to-door, auto dimension, x-ray capture, dan airwaybill.",
        ),
        context: t("Cargo operations were the operational backbone of cargo revenue and needed one connected system.", "Operasional kargo adalah tulang punggung revenue kargo dan butuh satu sistem yang terhubung."),
        role: t("Sole backend owner on most modules, from requirements through release to production support.", "Pemilik backend tunggal di sebagian besar modul, dari requirement sampai rilis dan support production."),
        solution: t("ASP.NET MVC applications on SQL Server with REST APIs connecting dimension scanners and x-ray capture to airwaybill processing.", "Aplikasi ASP.NET MVC di SQL Server dengan REST API yang menghubungkan scanner dimensi dan x-ray capture ke proses airwaybill."),
        features: [
          t("Airwaybill issuance and shipment tracking", "Penerbitan airwaybill dan tracking kiriman"),
          t("Automatic dimension and x-ray capture at acceptance", "Auto dimension dan x-ray capture saat penerimaan"),
          t("Door-to-door service", "Layanan door-to-door"),
        ],
        impact: [t("Later extended to two more airlines' cargo operations", "Kemudian diperluas ke operasional kargo dua maskapai lain")],
        stack: ["ASP.NET MVC", "C#", "SQL Server", "REST API", "Kendo UI", "jQuery"],
        view: {
          app: {
            name: "Cargo",
            nav: ["Acceptance", "Airwaybill", "Tracking", "Door-to-door", "Reports"],
            screens: [
              {
                name: "Acceptance",
                blocks: [
                  { kind: "form", title: "AWB 126-1234 5675", fields: [["Origin → Dest", "CGK → DPS"], ["Pieces / weight", "12 pcs · 184 kg"], ["Dimension (auto)", "120 × 80 × 95 cm"], ["X-ray", "Cleared · image #XR-8812"]], actions: ["Print label", "Accept"] },
                  { kind: "timeline", title: "Tracking", items: [["08:10", "Accepted at CGK", true], ["09:40", "Built up · ULD AKE1234", true], ["11:25", "Departed GA-404", true], ["—", "Arrived DPS"]] },
                ],
              },
            ],
          },
        },
      },
      {
        slug: "bank-customer-service",
        title: t("Bank Customer Service System", "Sistem Customer Service Bank"),
        client: t("National private bank", "Bank swasta nasional"),
        summary: t("Case handling system for branch and call-centre customer service.", "Sistem penanganan kasus untuk customer service cabang dan call center."),
        context: t("Customer complaints were tracked in spreadsheets across branches.", "Komplain nasabah dilacak di spreadsheet di banyak cabang."),
        role: t(".NET developer.", ".NET developer."),
        solution: t("ASP.NET MVC case management with SLA tracking and escalation.", "Manajemen kasus ASP.NET MVC dengan tracking SLA dan eskalasi."),
        features: [t("Case intake and assignment", "Input dan penugasan kasus"), t("SLA timers and escalation", "Timer SLA dan eskalasi"), t("Branch reporting", "Pelaporan per cabang")],
        impact: [],
        stack: ["ASP.NET MVC", "C#", "SQL Server"],
        view: {
          app: {
            name: "CS Desk",
            nav: ["Queue", "Cases", "Escalations", "Reports"],
            screens: [
              {
                name: "Queue",
                blocks: [
                  { kind: "stats", items: [["Open cases", "214"], ["Within SLA", "93%"], ["Escalated", "11"]] },
                  { kind: "table", wide: true, columns: ["Case", "Category", "Branch", "SLA left", "Status"], badge: 4, rows: [["CS-88120", "Card blocked", "Jakarta 01", "3h", "Open"], ["CS-88119", "Transfer dispute", "Bandung 04", "22h", "In progress"], ["CS-88117", "Statement request", "Surabaya 02", "—", "Closed"]] },
                ],
              },
            ],
          },
        },
      },
    ],
  },
  {
    id: "personal",
    title: t("Personal projects", "Proyek personal"),
    intro: t("Built outside work to explore architecture and tooling.", "Dibangun di luar pekerjaan untuk eksplorasi arsitektur dan tooling."),
    internal: false,
    projects: [
      {
        slug: "saga-orchestration",
        title: t("SagaOrchestration · .NET 10 Template", "SagaOrchestration · Template .NET 10"),
        summary: t("Order processing with a saga state machine on a modular monolith.", "Pemrosesan order dengan saga state machine di modular monolith."),
        context: t("A reference for distributed transactions without two-phase commit.", "Referensi untuk transaksi terdistribusi tanpa two-phase commit."),
        role: t("Solo project.", "Proyek solo."),
        solution: t(
          "MassTransit saga over RabbitMQ with the outbox pattern, CQRS, circuit breaker and .NET Aspire for local orchestration; multi-tenant with a security baseline.",
          "Saga MassTransit di atas RabbitMQ dengan outbox pattern, CQRS, circuit breaker, dan .NET Aspire untuk orkestrasi lokal; multi-tenant dengan baseline keamanan.",
        ),
        features: [t("Saga state machine with compensation", "Saga state machine dengan kompensasi"), t("Transactional outbox", "Transactional outbox"), t("Unit and integration tests with xUnit", "Unit dan integration test dengan xUnit")],
        impact: [],
        stack: [".NET 10", "MassTransit", "RabbitMQ", "EF Core", "MediatR", ".NET Aspire", "xUnit"],
        view: {
          flow: {
            title: "Order saga",
            steps: [{ label: "OrderSubmitted" }, { label: "PaymentReserved", note: "or → Cancelled" }, { label: "StockReserved", note: "or → RefundPayment" }, { label: "Shipped" }, { label: "Completed" }],
          },
          api: {
            title: "Orders API",
            version: "v1",
            baseUrl: "https://localhost:7001",
            auth: "Bearer JWT · X-Tenant-Id",
            groups: [{ tag: "Orders", endpoints: [{ method: "POST", path: "/api/orders", summary: "Submit order (starts saga)", body: json({ customerId: "c-01", lines: [{ sku: "SKU-1", qty: 2 }] }), response: json({ orderId: "o-9f1c", state: "Submitted" }) }, { method: "GET", path: "/api/orders/{id}", summary: "Order and saga state" }] }],
          },
        },
      },
      {
        slug: "rust-microservices",
        title: t("Rust Microservices Platform", "Platform Microservices Rust"),
        summary: t("API gateway, auth and user services over gRPC, on DDD and Clean Architecture.", "API gateway, auth, dan user service via gRPC, dengan DDD dan Clean Architecture."),
        context: t("Exploring Rust for production-style backend services.", "Eksplorasi Rust untuk backend service bergaya production."),
        role: t("Solo project.", "Proyek solo."),
        solution: t(
          "Axum gateway calling Tonic gRPC services; SeaORM on PostgreSQL; Redis for caching, rate limiting and locks; JWT with Argon2; OpenAPI via utoipa.",
          "Gateway Axum memanggil service gRPC Tonic; SeaORM di PostgreSQL; Redis untuk caching, rate limiting, dan lock; JWT dengan Argon2; OpenAPI via utoipa.",
        ),
        features: [t("gRPC between services with Protocol Buffers", "gRPC antar service dengan Protocol Buffers"), t("Background jobs with Apalis", "Background job dengan Apalis"), t("One Dockerfile per service", "Satu Dockerfile per service")],
        impact: [],
        stack: ["Rust", "Axum", "Tonic gRPC", "SeaORM", "PostgreSQL", "Redis", "Docker"],
        view: {
          api: {
            title: "Gateway API (utoipa)",
            version: "0.1.0",
            baseUrl: "http://localhost:8080",
            auth: "Bearer JWT",
            groups: [
              { tag: "auth", endpoints: [{ method: "POST", path: "/api/auth/register", summary: "Register user" }, { method: "POST", path: "/api/auth/login", summary: "Login, returns JWT", body: json({ email: "dev@example.com", password: "••••••" }), response: json({ access_token: "eyJ...", token_type: "Bearer" }) }] },
              { tag: "users", endpoints: [{ method: "GET", path: "/api/users/me", summary: "Current user" }, { method: "PATCH", path: "/api/users/me", summary: "Update profile" }] },
            ],
          },
          flow: {
            title: "Request path",
            steps: [{ label: "Client" }, { label: "Gateway", note: "Axum · rate limit" }, { label: "gRPC", note: "Tonic" }, { label: "Auth / User service" }, { label: "PostgreSQL · Redis" }],
          },
        },
      },
      {
        slug: "ai-video-suite",
        title: t("AI Video Generation Suite", "Suite Pembuatan Video AI"),
        summary: t("Theme to script to image to video to voice, for short-form content.", "Tema ke naskah ke gambar ke video ke suara, untuk konten pendek."),
        context: t("Producing short-form videos by hand took hours per clip.", "Membuat video pendek secara manual butuh berjam-jam per klip."),
        role: t("Solo project.", "Proyek solo."),
        solution: t("Event-driven Python pipeline with a custom event bus and live progress over Server-Sent Events; FFmpeg for assembly; runs on a CPU-only PC.", "Pipeline Python event-driven dengan event bus sendiri dan progress live via Server-Sent Events; FFmpeg untuk perakitan; jalan di PC tanpa GPU."),
        features: [t("Four-scene narrative arc", "Alur naratif empat scene"), t("Video and voice kept in sync per scene", "Video dan suara sinkron per scene"), t("Live progress over SSE", "Progress live via SSE")],
        impact: [],
        stack: ["Python", "FFmpeg", "SSE", "pytest"],
        view: {
          flow: { title: "Pipeline", steps: [{ label: "Theme" }, { label: "Script", note: "hook → resolution" }, { label: "Images" }, { label: "Clips", note: "FFmpeg" }, { label: "Voice-over" }, { label: "Final video" }] },
          cli: {
            title: "python main.py --theme \"morning discipline\"",
            lines: [
              ["event: script.ready    scenes=4 duration=10s", "ok"],
              ["event: image.ready     scene=1/4", "ok"],
              ["event: image.ready     scene=2/4", "ok"],
              ["event: clip.rendering  scene=3/4 ffmpeg", "warn"],
              ["event: voice.pending", "dim"],
            ],
          },
        },
      },
      {
        slug: "pdf-to-jpg",
        title: t("Size-Guaranteed PDF to JPG", "PDF ke JPG dengan Ukuran Terjamin"),
        summary: t("Converts PDFs to JPGs guaranteed to fit an upload limit for government and job portals.", "Konversi PDF ke JPG yang dijamin muat di batas upload portal pemerintah dan lamaran kerja."),
        context: t("Portals reject uploads above 1 to 5 MB, and generic converters do not guarantee size.", "Portal menolak upload di atas 1 sampai 5 MB, dan converter umum tidak menjamin ukuran."),
        role: t("Solo project.", "Proyek solo."),
        solution: t("FastAPI service that searches quality settings until every page fits the chosen limit; Next.js frontend behind Caddy; CI with Playwright end-to-end tests.", "Service FastAPI yang mencari setelan kualitas sampai setiap halaman muat di batas yang dipilih; frontend Next.js di belakang Caddy; CI dengan test end-to-end Playwright."),
        features: [t("Every JPG stays under the chosen limit", "Setiap JPG selalu di bawah batas yang dipilih"), t("Full-stack CI: tests, type-check, lint, build, e2e", "CI full-stack: test, type-check, lint, build, e2e")],
        impact: [],
        stack: ["FastAPI", "Python 3.13", "Next.js 16", "Caddy", "Docker", "Playwright"],
        view: {
          app: {
            name: "Converter",
            nav: ["Convert", "History"],
            screens: [
              {
                name: "Convert",
                blocks: [
                  { kind: "form", title: "PDF → JPG", fields: [["File", "ijazah-scan.pdf · 3 pages"], ["Max size per JPG", "2 MB"], ["Output", "page-1.jpg, page-2.jpg, page-3.jpg"]], actions: ["Download ZIP"] },
                  { kind: "table", columns: ["Page", "Size", "Limit"], badge: 2, rows: [["page-1.jpg", "1.84 MB", "OK"], ["page-2.jpg", "1.97 MB", "OK"], ["page-3.jpg", "1.62 MB", "OK"]] },
                ],
              },
            ],
          },
        },
      },
      {
        slug: "docfinder",
        title: t("DocFinder", "DocFinder"),
        summary: t("Finds every Markdown file on a PC and serves a local, browsable viewer.", "Mencari semua file Markdown di PC dan menyajikan viewer lokal yang bisa di-browse."),
        context: t("Notes and specs were scattered across drives with no quick way to read them.", "Catatan dan spesifikasi tersebar di banyak drive tanpa cara cepat untuk membacanya."),
        role: t("Solo project.", "Proyek solo."),
        solution: t("A single Python file using only the standard library's threaded HTTP server; runs in the background at startup.", "Satu file Python yang hanya memakai threaded HTTP server dari standard library; jalan di background saat startup."),
        features: [t("Scans all fixed drives", "Memindai semua drive"), t("Renders Markdown in place", "Render Markdown langsung"), t("No dependencies required", "Tanpa dependency wajib")],
        impact: [],
        stack: ["Python"],
        view: {
          app: {
            name: "DocFinder",
            nav: ["All files", "Recent", "Rescan"],
            screens: [
              {
                name: "Browse",
                blocks: [
                  { kind: "table", columns: ["Folder", "Files"], rows: [["C:/Users/me/notes", "214"], ["D:/docs/specs", "88"], ["C:/projects/api", "31"]] },
                  { kind: "form", title: "README.md", fields: [["Path", "C:/projects/api/README.md"], ["Modified", "Today 09:14"]], actions: ["Open folder"] },
                ],
              },
            ],
          },
        },
      },
    ],
  },
];

export const allProjects = groups.flatMap((g) => g.projects.map((p) => ({ ...p, group: g })));

// Smaller earlier engagements, listed without detail pages.
export const moreWork: T[] = [
  t("Project portfolio monitoring (PMO) for a power generation company", "Monitoring portofolio proyek (PMO) untuk perusahaan pembangkit listrik"),
  t("Document management and PDF collaboration for a geothermal company", "Manajemen dokumen dan kolaborasi PDF untuk perusahaan panas bumi"),
  t("Automotive service care system for a car manufacturer", "Sistem service care otomotif untuk produsen mobil"),
  t("FIFO/LIFO warehousing and product authentication", "Pergudangan FIFO/LIFO dan autentikasi produk"),
  t("Trading sales CRM, academic and HR management systems", "CRM sales trading, sistem manajemen akademik dan HR"),
  t("Online auction with real-time bidding; MLM with automated commissions", "Lelang online dengan bidding real-time; MLM dengan komisi otomatis"),
  t("Contact-centre platform support (IVR, agent desktop, SLA wallboards) for a consumer-finance company", "Support platform contact center (IVR, agent desktop, wallboard SLA) untuk perusahaan pembiayaan konsumen"),
];
