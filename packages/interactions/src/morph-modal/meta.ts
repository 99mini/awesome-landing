import type { InteractionMeta } from "../types.ts";

export const meta: InteractionMeta = {
  slug: "morph-modal",
  title: "Morph Modal",
  description: "카드가 그 자리에서 패널로 늘어나며 열리는 모달. Esc·배경 클릭으로 닫힘",
  category: "layout",
  tags: ["layoutId", "AnimatePresence", "dialog"],
  replayable: false,
  controls: {
    duration: { label: "Duration", min: 0.2, max: 1.2, step: 0.05, default: 0.5, unit: "s" },
    bounce: { label: "Bounce", min: 0, max: 0.5, step: 0.05, default: 0.15 },
  },
};
