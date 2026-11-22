import type { InteractionMeta } from "../types.ts";

export const meta: InteractionMeta = {
  slug: "number-ticker",
  title: "Number Ticker",
  description:
    "자릿수마다 0~9 기둥을 굴려 숫자를 바꾼다. 화면에 들어오면 굴러가기 시작하고, 자리가 늘면 새 자리가 커지며 들어와 나머지가 비켜난다",
  category: "text",
  tags: ["animate", "layout animation", "useInView", "aria-hidden"],
  controls: {
    duration: { label: "Duration", min: 0.2, max: 1.6, step: 0.1, default: 0.6, unit: "s" },
    stagger: { label: "Stagger", min: 0, max: 0.15, step: 0.01, default: 0.04, unit: "s" },
  },
};
