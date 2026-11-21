import type { StorybookConfig } from "@storybook/react-vite";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { mergeConfig } from "vite";

const config: StorybookConfig = {
  stories: ["../stories/**/*.stories.tsx"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y", "@storybook/addon-vitest"],
  framework: { name: "@storybook/react-vite", options: {} },
  // 워크스페이스 패키지의 .css.ts 는 앱(여기서는 Storybook)의 VE 플러그인이 컴파일한다
  viteFinal: (vite) => mergeConfig(vite, { plugins: [vanillaExtractPlugin()] }),
};

export default config;
