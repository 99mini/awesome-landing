import type { InteractionMeta } from "../types.ts";

export const meta: InteractionMeta = {
  slug: "number-ticker",
  title: "Number Ticker",
  description:
    "자릿수마다 0~9 기둥을 굴려 숫자를 바꾼다. 일의 자리부터 차례로 출발하고, 스크린 리더는 숫자 전체를 한 번에 읽는다",
  category: "text",
  tags: ["animate", "tabular-nums", "aria-hidden"],
  controls: {
    duration: { label: "Duration", min: 0.2, max: 1.6, step: 0.1, default: 0.6, unit: "s" },
    stagger: { label: "Stagger", min: 0, max: 0.15, step: 0.01, default: 0.04, unit: "s" },
  },
};
