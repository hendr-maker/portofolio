import { defineConfig, devices } from "@playwright/test";

const port = 3200;

// Tests the real static export in out/ (run `pnpm build` first; `pnpm e2e` does both).
export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: { baseURL: `http://127.0.0.1:${port}`, trace: "retain-on-failure" },
  projects: [
    { name: "desktop-chrome", use: { ...devices["Desktop Chrome"], channel: "chrome" } },
    { name: "mobile-chrome", use: { ...devices["Pixel 7"], channel: "chrome", viewport: { width: 390, height: 844 } } },
  ],
  webServer: {
    command: `pnpm dlx serve@14 out -l ${port} --no-port-switching`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: !process.env.CI,
  },
});
