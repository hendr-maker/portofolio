import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { abs, basePath, ogImage, pagePath, profile, seo, siteUrl } from "@/content";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: seo.title.en,
  description: seo.description.en,
  authors: [{ name: profile.name, url: profile.linkedin }],
  alternates: { canonical: abs(pagePath("en")), languages: { en: abs(pagePath("en")), id: abs(pagePath("id")), "x-default": abs(pagePath("en")) } },
  openGraph: {
    type: "profile",
    locale: "en_US",
    alternateLocale: "id_ID",
    siteName: profile.name,
    title: seo.title.en,
    description: seo.description.en,
    url: abs(pagePath("en")),
    images: [ogImage],
  },
  twitter: { card: "summary_large_image" },
};

// Static hosting cannot send headers, so the policy ships as a meta tag (production only: dev needs eval).
// Next inlines its bootstrap scripts, hence 'unsafe-inline'; everything else is locked to this origin.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
].join("; ");

// First visit to the English home with an Indonesian browser goes to /id/. A click on the language toggle
// is remembered and always wins. Project pages are never redirected, so shared links keep their language.
const languageRedirect = `try{var b=${JSON.stringify(basePath)},k="lang",p=location.pathname;
document.addEventListener("click",function(e){var a=e.target.closest&&e.target.closest("a[hreflang]");if(a)localStorage.setItem(k,a.getAttribute("hreflang"))});
if(!localStorage.getItem(k)&&(p===b+"/"||p===b)&&/^id\\b/i.test(navigator.language||""))location.replace(b+"/id/")}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {process.env.NODE_ENV === "production" && <meta httpEquiv="Content-Security-Policy" content={csp} />}
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <script dangerouslySetInnerHTML={{ __html: languageRedirect }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
