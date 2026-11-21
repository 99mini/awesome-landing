import type { InteractionMeta } from "../types.ts";

export const meta: InteractionMeta = {
  slug: "split-text",
  title: "Split Text Reveal",
  description: "글자 단위로 블러가 걷히며 등장하는 헤드라인",
  category: "text",
  tags: ["variants", "stagger"],
  controls: {
    stagger: { label: "Stagger", min: 0, max: 0.15, step: 0.005, default: 0.03, unit: "s" },
  },
};
