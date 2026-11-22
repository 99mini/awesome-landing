import type { InteractionMeta } from "../types.ts";

export const meta: InteractionMeta = {
  slug: "command-palette",
  title: "Command Palette",
  description:
    "⌘K 로 여는 명령 목록. 입력하면 걸러지고 ↑/↓ 로 고르고 Enter 로 실행한다. 고른 줄의 배경은 layoutId 로 줄 사이를 미끄러진다",
  category: "layout",
  tags: ["layoutId", "combobox", "keyboard"],
  replayable: false,
};
