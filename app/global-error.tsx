"use client";

// Last-resort boundary when the root layout itself fails. No error details are shown.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", display: "grid", placeItems: "center", minHeight: "100vh", margin: 0, textAlign: "center" }}>
        <main>
          <h1>Something went wrong</h1>
          <p>Please try again. · Silakan coba lagi.</p>
          <button type="button" onClick={reset}>Try again</button>
        </main>
      </body>
    </html>
  );
}
