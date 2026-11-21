import type { InteractionMeta } from "../types.ts";

export const meta: InteractionMeta = {
  slug: "line-draw",
  title: "Line Draw Chart",
  description: "화면에 들어오면 선이 왼쪽부터 그려지고 끝점이 튀어나오는 라인 차트",
  category: "scroll",
  tags: ["pathLength", "useInView", "SVG"],
  controls: {
    duration: { label: "Duration", min: 0.4, max: 5, step: 0.1, default: 2, unit: "s" },
    thickness: { label: "Thickness", min: 1, max: 6, step: 0.5, default: 2.5, unit: "px" },
  },
};
