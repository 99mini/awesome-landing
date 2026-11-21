import type { InteractionMeta } from "../types.ts";

export const meta: InteractionMeta = {
  slug: "reorder-list",
  title: "Reorder List",
  description:
    "손잡이를 드래그해 순서를 바꾸는 목록. 키보드는 손잡이에서 ↑/↓, 바뀐 위치를 스크린 리더에 알림",
  category: "gesture",
  tags: ["Reorder", "useDragControls", "aria-live"],
};
