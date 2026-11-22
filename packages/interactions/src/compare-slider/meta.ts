import type { InteractionMeta } from "../types.ts";

export const meta: InteractionMeta = {
  slug: "compare-slider",
  title: "Compare Slider",
  description:
    "두 화면을 겹쳐 놓고 나누는 선을 끌어 비교한다. 앞 화면은 clip-path 로 자르고 선은 transform 으로 옮긴다. 손잡이에서 화살표 키로도",
  category: "gesture",
  tags: ["clip-path", "pointer capture", "role=slider"],
  replayable: false,
  controls: {
    step: { label: "Key step", min: 1, max: 20, step: 1, default: 5, unit: "%" },
  },
};
