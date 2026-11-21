import type { InteractionMeta } from "../types.ts";

export const meta: InteractionMeta = {
  slug: "seven-segment",
  title: "Seven Segment",
  description: "세그먼트가 켜지고 꺼지며 바뀌는 7세그먼트 디스플레이. 꺼진 세그먼트 잔상 표현",
  category: "text",
  tags: ["SVG", "animate", "LCD"],
  replayable: false,
  controls: {
    ghost: { label: "Ghost", kind: "toggle", min: 0, max: 1, step: 1, default: 1 },
    skew: { label: "Skew", min: 0, max: 14, step: 1, default: 6, unit: "°" },
  },
};
