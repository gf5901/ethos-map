import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run compile-graph && npm run dev",
    url: "http://127.0.0.1:3000",
    // Reuse an already-running `next dev` so we don't start a second server (Next allows only one dev server per project dir).
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
