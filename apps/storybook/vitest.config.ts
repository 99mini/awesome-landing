import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defaultClientConditions } from "vite";
import { defineConfig } from "vitest/config";

const CI = Boolean(process.env.CI);

/** 모든 스토리를 실제 브라우저에서 렌더 + play 함수 + axe 접근성 검사로 돌린다 */
export default defineConfig({
  plugins: [storybookTest({ configDir: ".storybook" })],
  resolve: { conditions: ["source", ...defaultClientConditions] },
  test: {
    browser: {
      enabled: true,
      headless: true,
      // 로컬은 설치된 Chrome, CI 는 playwright 가 받은 Chromium
      provider: playwright(CI ? {} : { launchOptions: { channel: "chrome" } }),
      instances: [{ browser: "chromium" }],
    },
    setupFiles: [".storybook/vitest.setup.ts"],
    // 같은 스토리를 다크·라이트 두 번 (갤러리가 둘 다 지원한다)
    projects: [
      { extends: true, test: { name: "dark" } },
      {
        extends: true,
        test: {
          name: "light",
          setupFiles: [".storybook/vitest.setup.ts", ".storybook/vitest.light.ts"],
        },
      },
    ],
  },
});
