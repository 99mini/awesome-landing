import type { InteractionMeta } from "../types.ts";

export const meta: InteractionMeta = {
  slug: "view-transition",
  title: "View Transition",
  description:
    "브라우저 네이티브 View Transitions API 로 레이아웃 변경을 모핑 (지원하지 않으면 바로 바뀜)",
  category: "layout",
  tags: ["startViewTransition", "view-transition-name", "flushSync"],
  replayable: false,
  controls: {
    duration: { label: "Duration", min: 0.15, max: 1.2, step: 0.05, default: 0.35, unit: "s" },
  },
};
