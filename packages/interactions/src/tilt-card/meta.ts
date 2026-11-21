import type { InteractionMeta } from "../types.ts";

export const meta: InteractionMeta = {
  slug: "tilt-card",
  title: "3D Tilt Card",
  description: "포인터 위치에 따라 기울어지는 원근 카드",
  category: "hover",
  tags: ["perspective", "useTransform"],
  replayable: false,
  controls: {
    maxTilt: { label: "Max tilt", min: 0, max: 30, step: 1, default: 12, unit: "°" },
  },
};
