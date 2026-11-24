import type { InteractionMeta } from "../types.ts";

export const meta: InteractionMeta = {
  slug: "photo-viewer",
  title: "Photo Viewer",
  description: "누른 칸에서 커지고 닫지 않고 앞뒤로 넘긴다. 닫으면 지금 보는 사진의 칸으로",
  category: "gesture",
  tags: ["clip-path", "drag", "dialog"],
  replayable: false,
  controls: {
    duration: { label: "Duration", min: 0.2, max: 1.2, step: 0.05, default: 0.4, unit: "s" },
    threshold: { label: "Swipe", min: 30, max: 160, step: 10, default: 80, unit: "px" },
  },
};
