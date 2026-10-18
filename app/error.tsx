"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { href, pagePath } from "@/lib/content";

// Deliberately never renders error.message or the stack: visitors see a generic message only.
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto flex max-w-xl flex-col items-center px-4 py-32 text-center">
      <p className="font-mono text-sm text-primary">Error</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight">Something went wrong</h1>
      <p className="mt-3 text-muted-foreground">Please try again. · Silakan coba lagi.</p>
      <div className="mt-8 flex gap-3">
        <button type="button" onClick={reset} className={buttonVariants({ size: "lg" })}>Try again</button>
        <a href={href(pagePath("en"))} className={cn(buttonVariants({ size: "lg", variant: "outline" }))}>Back to home</a>
      </div>
    </main>
  );
}
