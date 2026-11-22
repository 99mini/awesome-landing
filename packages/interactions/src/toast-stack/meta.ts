import type { InteractionMeta } from "../types.ts";

export const meta: InteractionMeta = {
  slug: "toast-stack",
  title: "Toast Stack",
  description:
    "알림이 쌓이고 사라질 때 나머지가 layout 애니메이션으로 자리를 옮긴다. 포인터나 포커스가 머물면 사라지는 시간이 멈춘다",
  category: "layout",
  tags: ["layout animation", "popLayout", "aria-live"],
  replayable: false,
  controls: {
    duration: { label: "Auto dismiss", min: 0, max: 8, step: 1, default: 4, unit: "s" },
    limit: { label: "Visible", min: 1, max: 5, step: 1, default: 3 },
  },
};
