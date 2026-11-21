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
  // 스크린샷 비교는 OS·글꼴 렌더링에 따라 달라서, 기준 이미지는 CI 의 Playwright 컨테이너에서만 만들고 비교한다
  // (플랫폼 접미사 없이 한 벌만 둔다)
  snapshotPathTemplate: "{testDir}/__screenshots__/{testFilePath}/{arg}{ext}",
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.002, animations: "disabled", scale: "css" },
  },
  projects: [
    {
      name: "chromium",
      testIgnore: /visual\.spec\.ts$/,
      use: { ...devices["Desktop Chrome"], ...(CI ? {} : { channel: "chrome" }) },
    },
    {
      // 화면 회귀 — 움직임을 줄여(동작 줄이기) 같은 장면을 찍는다
      name: "visual",
      testMatch: /visual\.spec\.ts$/,
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 1,
        contextOptions: { reducedMotion: "reduce" },
        // 로컬에서는 안정성 확인용으로만 돌린다 (기준 이미지는 CI 컨테이너 것)
        ...(CI ? {} : { channel: "chrome" }),
      },
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
