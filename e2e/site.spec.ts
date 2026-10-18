import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test, type Page } from "@playwright/test";
import { pagePath } from "../content";
import { allProjects, groups } from "../projects";

const blocklistPath = join(__dirname, "forbidden.local.txt");
const pages = [pagePath("en"), pagePath("id"), ...allProjects.flatMap((p) => [pagePath("en", p.slug), pagePath("id", p.slug)])];

// Terms that must never reach the public site (internal codenames, client names, private contact).
// The list lives in a gitignored file because publishing it would leak exactly what it protects.
const localTerms = existsSync(blocklistPath)
  ? readFileSync(blocklistPath, "utf8").split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith("#"))
  : [];
const forbidden = new RegExp(["@gmail\\.com", "\\+62", ...localTerms].join("|"), "i");

// Raw error output that must never be shown to visitors.
const leakedError = /at \w+ \(|stack trace|TypeError|ReferenceError|Unhandled Runtime Error|digest:/i;

function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("response", (r) => r.status() >= 400 && errors.push(`${r.status()} ${r.url()}`));
  return errors;
}

test.describe("every page", () => {
  for (const path of pages) {
    test(`200 and renders cleanly: ${path}`, async ({ page }) => {
      const errors = trackErrors(page);
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);

      const text = await page.locator("body").innerText();
      expect(text).not.toMatch(forbidden);
      expect(text).not.toMatch(leakedError);

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, "horizontal overflow").toBeLessThanOrEqual(0);
      expect(errors).toEqual([]);
    });
  }
});

test.describe("error handling", () => {
  test("unknown URL returns a friendly 404 page", async ({ page }) => {
    const res = await page.goto("/this-page-does-not-exist/");
    expect(res?.status()).toBe(404);
    await expect(page.locator("h1")).toHaveText("Page not found");
    await expect(page.getByRole("link", { name: "Back to home" })).toBeVisible();
    expect(await page.locator("body").innerText()).not.toMatch(leakedError);
  });

  test("unknown project slug returns 404, not an error", async ({ page }) => {
    const res = await page.goto("/projects/unknown-project/");
    expect(res?.status()).toBe(404);
    await expect(page.locator("h1")).toHaveText("Page not found");
  });
});

test.describe("SEO", () => {
  const sample = allProjects[0].slug;
  for (const path of [pagePath("en"), pagePath("id"), pagePath("en", sample), pagePath("id", sample)]) {
    test(`meta tags: ${path}`, async ({ page }) => {
      await page.goto(path);
      const title = await page.title();
      expect(title.length).toBeGreaterThan(10);
      expect(title.length).toBeLessThanOrEqual(60);

      const description = (await page.locator('meta[name="description"]').getAttribute("content")) ?? "";
      expect(description.length).toBeGreaterThanOrEqual(80);
      expect(description.length).toBeLessThanOrEqual(160);

      expect(await page.locator('link[rel="canonical"]').getAttribute("href")).toMatch(new RegExp(`${path}$`));
      await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveCount(1);
      expect(await page.locator('meta[property="og:image"]').getAttribute("content")).toMatch(/\/og\.png$/);

      const ld = await page.locator('script[type="application/ld+json"]').first().textContent();
      expect(JSON.parse(ld ?? "{}")["@context"]).toBe("https://schema.org");
    });
  }

  test("sitemap lists every project in both languages", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    for (const p of allProjects) {
      expect(xml).toContain(pagePath("en", p.slug));
      expect(xml).toContain(pagePath("id", p.slug));
    }
  });

  test("og.png is served as an image", async ({ request }) => {
    const res = await request.get("/og.png");
    expect(res.headers()["content-type"]).toBe("image/png");
  });
});

test.describe("projects", () => {
  test("home lists every project and links to its page", async ({ page }) => {
    await page.goto("/");
    const cards = page.locator('#projects a[href*="/projects/"]');
    await expect(cards).toHaveCount(allProjects.length);

    await cards.first().click();
    await expect(page).toHaveURL(new RegExp(`${pagePath("en", allProjects[0].slug)}$`));
    await expect(page.locator("h1")).toHaveText(allProjects[0].title.en);
  });

  for (const p of allProjects) {
    test(`case study and views: ${p.slug}`, async ({ page }) => {
      await page.goto(pagePath("en", p.slug));
      await expect(page.getByRole("heading", { name: "Context" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Key features" })).toBeVisible();
      if (p.view.api) await expect(page.getByText("Authorize").first()).toBeAttached();
      if (p.view.flow) await expect(page.getByText(p.view.flow.title, { exact: true }).first()).toBeAttached();
    });
  }

  test("view tabs switch between app, API and workflow", async ({ page }) => {
    const p = allProjects.find((x) => x.view.api && x.view.flow && x.view.app);
    if (!p?.view.flow) throw new Error("fixture: needs a project with app, API and workflow views");
    await page.goto(pagePath("en", p.slug));
    await page.getByRole("tab", { name: "API (Swagger)" }).click();
    await expect(page.getByText("Authorize").first()).toBeVisible();
    await page.getByRole("tab", { name: "Workflow" }).click();
    await expect(page.getByText(p.view.flow.title, { exact: true })).toBeVisible();
  });

  test("internal projects carry the illustrative-data note, personal ones do not", async ({ page }) => {
    const internal = groups.find((g) => g.internal)?.projects[0];
    const personal = groups.find((g) => !g.internal)?.projects[0];
    if (!internal || !personal) throw new Error("fixture: needs internal and personal groups");
    await page.goto(pagePath("en", internal.slug));
    await expect(page.getByText(/Illustrative screens with dummy data/)).toBeVisible();
    await page.goto(pagePath("en", personal.slug));
    await expect(page.getByText(/Illustrative screens with dummy data/)).toHaveCount(0);
  });

  test("next project link cycles through projects", async ({ page }) => {
    await page.goto(pagePath("en", allProjects[0].slug));
    await page.getByRole("link", { name: new RegExp(allProjects[1].title.en) }).click();
    await expect(page).toHaveURL(new RegExp(`${pagePath("en", allProjects[1].slug)}$`));
  });

  test("language toggle keeps the current page", async ({ page }) => {
    const p = allProjects[3];
    await page.goto(pagePath("en", p.slug));
    await page.getByRole("link", { name: "Bahasa Indonesia" }).click();
    await expect(page).toHaveURL(new RegExp(`${pagePath("id", p.slug)}$`));
    await expect(page.locator("h1")).toHaveText(p.title.id);

    await page.getByRole("link", { name: "English" }).click();
    await expect(page).toHaveURL(new RegExp(`${pagePath("en", p.slug)}$`));
  });

  test("contact shows LinkedIn and GitHub only", async ({ page }) => {
    await page.goto("/");
    const contact = page.locator("#contact");
    await expect(contact.getByRole("link", { name: "LinkedIn" })).toHaveAttribute("href", /linkedin\.com/);
    await expect(contact.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", /github\.com/);
    await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
  });
});

test.describe("language", () => {
  test("Indonesian pages declare lang=id", async ({ page }) => {
    await page.goto(pagePath("id"));
    await expect(page.locator("html")).toHaveAttribute("lang", "id");
    await page.goto(pagePath("en"));
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test.describe("Indonesian browser", () => {
    test.use({ locale: "id-ID" });

    test("first visit to home goes to /id/, the toggle choice sticks", async ({ page }) => {
      // The redirect runs in <head>, so wait on the URL instead of the first load event.
      await page.goto("/", { waitUntil: "commit" });
      await page.waitForURL(/\/id\/$/);
      await page.getByRole("link", { name: "English" }).click();
      await page.waitForURL((url) => url.pathname === "/");
      expect(await page.evaluate(() => localStorage.getItem("lang"))).toBe("en");

      await page.goto("/");
      await expect(page.locator("h1")).toContainText("Backend Engineer");
      expect(new URL(page.url()).pathname).toBe("/");
    });

    test("project pages are never redirected", async ({ page }) => {
      await page.goto(pagePath("en", allProjects[0].slug));
      await expect(page).toHaveURL(new RegExp(`${pagePath("en", allProjects[0].slug)}$`));
    });
  });

  test("English browser stays on English home", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/127\.0\.0\.1:\d+\/$/);
  });
});

test.describe("security headers", () => {
  test("CSP and referrer policy are present", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('meta[http-equiv="Content-Security-Policy"]')).toHaveAttribute("content", /object-src 'none'/);
    await expect(page.locator('meta[name="referrer"]')).toHaveAttribute("content", "strict-origin-when-cross-origin");
  });
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("content is visible immediately without animation", async ({ page }) => {
    await page.goto(pagePath("en", allProjects[0].slug));
    await expect(page.locator("h1")).toBeVisible();
    expect(await page.locator("header").last().evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
  });
});
