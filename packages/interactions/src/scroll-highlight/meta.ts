import type { InteractionMeta } from "../types.ts";

export const meta: InteractionMeta = {
  slug: "scroll-highlight",
  title: "Scroll Highlight",
  description: "문단이 스크롤로 지나가는 동안 단어가 하나씩 밝아지는 문장",
  category: "text",
  tags: ["useScroll", "useTransform", "scrollytelling"],
  replayable: false,
  controls: {
    dim: { label: "Dim", min: 0.2, max: 0.8, step: 0.05, default: 0.5 },
  },
};
