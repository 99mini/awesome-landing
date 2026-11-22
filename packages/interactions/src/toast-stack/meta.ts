import type { InteractionMeta } from "../types.ts";

export const meta: InteractionMeta = {
  slug: "toast-stack",
  title: "Toast Stack",
  description:
    "새 알림이 맨 앞에 오고 오래된 것은 뒤로 작게 겹쳐 쌓인다 (iOS 알림처럼). 포인터나 포커스가 머물면 목록으로 펼쳐지고 사라지는 시간이 멈춘다",
  category: "layout",
  tags: ["layout animation", "popLayout", "aria-live"],
  replayable: false,
  controls: {
    duration: { label: "Auto dismiss", min: 0, max: 8, step: 1, default: 4, unit: "s" },
    limit: { label: "Visible", min: 1, max: 5, step: 1, default: 3 },
    stack: { label: "Stack", kind: "toggle", min: 0, max: 1, step: 1, default: 1 },
  },
};
