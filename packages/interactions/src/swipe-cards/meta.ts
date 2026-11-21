import type { InteractionMeta } from "../types.ts";

export const meta: InteractionMeta = {
  slug: "swipe-cards",
  title: "Swipe Cards",
  description:
    "카드 스택을 좌우로 던진다. 기준 거리를 넘기면 날아가고 아니면 제자리로. 같은 동작을 버튼으로도",
  category: "gesture",
  tags: ["drag", "dragSnapToOrigin", "AnimatePresence"],
  controls: {
    threshold: { label: "Threshold", min: 40, max: 200, step: 10, default: 100, unit: "px" },
    tilt: { label: "Tilt", min: 0, max: 30, step: 1, default: 12, unit: "°" },
  },
};
