import type { StorybookConfig } from "@storybook/react-vite";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { defaultClientConditions, mergeConfig } from "vite";

const config: StorybookConfig = {
  stories: ["../stories/**/*.stories.tsx"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y", "@storybook/addon-vitest"],
  framework: { name: "@storybook/react-vite", options: {} },
  // 워크스페이스 패키지의 .css.ts 는 앱(여기서는 Storybook)의 VE 플러그인이 컴파일한다
  // 패키지는 빌드 결과(dist)가 아니라 소스를 쓴다 (source 조건)
  viteFinal: (vite) =>
    mergeConfig(vite, {
      plugins: [vanillaExtractPlugin()],
      resolve: { conditions: ["source", ...defaultClientConditions] },
    }),
};

export default config;
