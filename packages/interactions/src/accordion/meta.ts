import type { InteractionMeta } from "../types.ts";

export const meta: InteractionMeta = {
  slug: "accordion",
  title: "Accordion",
  description:
    "height 를 애니메이션하지 않고, 아래 항목은 layout 으로 미끄러지고 내용은 페이드하는 아코디언",
  category: "layout",
  tags: ["layout animation", "AnimatePresence", "aria-expanded"],
  replayable: false,
  controls: {
    duration: { label: "Duration", min: 0.1, max: 0.8, step: 0.05, default: 0.3, unit: "s" },
    multiple: { label: "Multiple", kind: "toggle", min: 0, max: 1, step: 1, default: 0 },
  },
};
