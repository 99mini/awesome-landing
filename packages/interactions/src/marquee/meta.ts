import type { InteractionMeta } from "../types.ts";

export const meta: InteractionMeta = {
  slug: "marquee",
  title: "Infinite Marquee",
  description: "끊김 없이 흐르는 띠. hover 시 일시정지",
  category: "layout",
  tags: ["keyframes", "mask-image"],
  replayable: false,
  controls: {
    duration: { label: "Loop", min: 4, max: 40, step: 1, default: 16, unit: "s" },
  },
};
