import type { InteractionMeta } from "../types.ts";

export const meta: InteractionMeta = {
  slug: "parallax",
  title: "Parallax Layers",
  description: "스크롤 진행도에 따라 층마다 다른 속도로 움직여 깊이를 만드는 패럴랙스",
  category: "scroll",
  tags: ["useScroll", "useTransform", "depth"],
  replayable: false,
  controls: {
    depth: { label: "Depth", min: 0, max: 2, step: 0.1, default: 1, unit: "×" },
    distance: { label: "Distance", min: 40, max: 240, step: 10, default: 120, unit: "px" },
  },
};
