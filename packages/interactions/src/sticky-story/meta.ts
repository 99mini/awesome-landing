import type { InteractionMeta } from "../types.ts";

export const meta: InteractionMeta = {
  slug: "sticky-story",
  title: "Sticky Story",
  description: "한쪽은 고정되고, 스크롤로 지나가는 단계에 맞춰 고정 영역이 바뀌는 스토리텔링",
  category: "scroll",
  tags: ["position: sticky", "useInView", "storytelling"],
  controls: {
    fade: { label: "Fade", min: 0, max: 0.8, step: 0.05, default: 0.3, unit: "s" },
  },
};
