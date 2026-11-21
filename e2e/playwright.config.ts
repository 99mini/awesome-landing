import { defineConfig, devices } from "@playwright/test";
import { URLS } from "./tests/urls.ts";

const CI = Boolean(process.env.CI);

/** 앱마다 production 빌드를 만들고 vite preview 로 띄운다 (dev 포트 5173·5200~ 과 겹치지 않게) */
const servers = [
  { filter: "@awesome/gallery", port: 4310 },
  { filter: "@landing/aurora", port: 4320 },
  { filter: "@landing/editorial", port: 4321 },
  { filter: "@landing/index", port: 4322 },
];

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 1 : 0,
  reporter: CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: URLS.gallery,
    trace: "retain-on-failure",
    // 로컬은 설치된 Chrome, CI 는 playwright 가 받은 Chromium
    ...(CI ? {} : { channel: "chrome" }),
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], ...(CI ? {} : { channel: "chrome" }) },
    },
  ],
  webServer: servers.map(({ filter, port }) => ({
    command: `pnpm --filter ${filter} build && pnpm --filter ${filter} exec vite preview --port ${port} --strictPort`,
    url: `http://localhost:${port}`,
    cwd: "..",
    reuseExistingServer: !CI,
    timeout: 120_000,
  })),
});
