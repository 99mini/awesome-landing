import type { Preview } from "@storybook/react-vite";
import "./preview.css.ts";

const preview: Preview = {
  parameters: {
    layout: "centered",
    backgrounds: { disable: true },
    // 접근성 위반은 테스트 실패로 친다
    a11y: { test: "error" },
  },
};

export default preview;
