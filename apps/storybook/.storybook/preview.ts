import { MotionProvider } from "@awesome/interactions/motion";
import type { Preview } from "@storybook/react-vite";
import { createElement } from "react";
import "./preview.css.ts";

const preview: Preview = {
  // 인터랙션은 m.* 를 쓰므로 LazyMotion 공급자 안에서 그린다
  decorators: [(Story) => createElement(MotionProvider, null, createElement(Story))],
  parameters: {
    layout: "centered",
    backgrounds: { disable: true },
    // 접근성 위반은 테스트 실패로 친다
    a11y: { test: "error" },
  },
};

export default preview;
