import type { InteractionMeta } from "../types.ts";

export const meta: InteractionMeta = {
  slug: "scroll-reveal",
  title: "Scroll Reveal",
  description: "뷰포트에 들어올 때 페이드 + 슬라이드 업",
  category: "scroll",
  tags: ["whileInView", "stagger"],
  controls: {
    offset: { label: "Offset", min: 0, max: 120, step: 4, default: 40, unit: "px" },
    stagger: { label: "Stagger", min: 0, max: 0.4, step: 0.02, default: 0.1, unit: "s" },
  },
};
