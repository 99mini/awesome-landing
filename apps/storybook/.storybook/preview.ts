import { MotionProvider } from "@awesome/interactions/motion";
import type { Preview } from "@storybook/react-vite";
import { createElement } from "react";
import "./preview.css.ts";

const preview: Preview = {
  // 툴바에서 테마를 고른다. 고르지 않으면 시스템 설정을 따른다
  // (테스트의 light 프로젝트는 setup 에서 data-theme 을 직접 넣는다 — 그래서 기본값을 두지 않는다)
  globalTypes: {
    theme: {
      description: "Color theme",
      toolbar: {
        title: "Theme",
        icon: "mirror",
        items: [
          { value: "dark", title: "Dark" },
          { value: "light", title: "Light" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, { globals }) => {
      if (globals.theme === "light" || globals.theme === "dark") {
        document.documentElement.dataset.theme = globals.theme;
      }
      return createElement(Story);
    },
    // 인터랙션은 m.* 를 쓰므로 LazyMotion 공급자 안에서 그린다
    (Story) => createElement(MotionProvider, null, createElement(Story)),
  ],
  parameters: {
    layout: "centered",
    backgrounds: { disable: true },
    // 접근성 위반은 테스트 실패로 친다
    a11y: { test: "error" },
  },
};

export default preview;
