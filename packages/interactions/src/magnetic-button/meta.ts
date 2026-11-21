import type { InteractionMeta } from "../types.ts";

export const meta: InteractionMeta = {
  slug: "magnetic-button",
  title: "Magnetic Button",
  description: "커서에 끌려오는 듯한 스프링 기반 CTA 버튼",
  category: "cursor",
  tags: ["spring", "pointer"],
  replayable: false,
  controls: {
    strength: { label: "Strength", min: 0, max: 1, step: 0.05, default: 0.35 },
  },
};
