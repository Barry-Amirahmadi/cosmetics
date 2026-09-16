import { defineConfig, devices } from "@playwright/test";

/**
 * Smoke pass against the **exported static output**, never against `next dev`.
 *
 * That distinction is the whole point: every defect Task 1 found — unprefixed
 * image paths, breadcrumbs escaping the site, 404ing RSC payloads — was
 * invisible in dev and only appeared once the export was served off disk by a
 * host with no router.
 *
 * The suite runs under the real deployment base path for the same reason.
 *
 *   npm run build:pages   # export with the deployed base path
 *   npm run test:smoke
 */
/** Matches the repository name. Overridable so a repo rename is a one-env-var fix. */
const BASE_PATH = process.env.SMOKE_BASE_PATH ?? "/cosmetics";
const PORT = 4321;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",

  use: {
    // Origin only. A path passed to page.goto() that starts with "/" replaces
    // the whole path of baseURL, so folding the base path in here would
    // silently drop it from every request. The tests spell it out instead.
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },

  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],

  webServer: {
    command: `node scripts/serve-static.mjs --port ${PORT} --base ${BASE_PATH.slice(1)}`,
    url: `http://localhost:${PORT}${BASE_PATH}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
