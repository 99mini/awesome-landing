import type { ControlValues, InteractionMeta } from "../types.ts";
import { CursorFollower } from "./cursor-follower.tsx";
import * as css from "./demo.css.ts";

export const meta: InteractionMeta = {
  slug: "cursor-follower",
  title: "Cursor Follower",
  description: "영역 안에서 스프링으로 커서를 따라오는 원 (blend mode 반전)",
  category: "cursor",
  tags: ["useSpring", "mix-blend-mode"],
  replayable: false,
  controls: {
    size: { label: "Size", min: 8, max: 160, step: 4, default: 48, unit: "px" },
    stiffness: { label: "Stiffness", min: 50, max: 1000, step: 50, default: 300 },
  },
};

export default function Demo({ size, stiffness }: ControlValues) {
  return (
    <CursorFollower className={css.area} dotClassName={css.dot} size={size} stiffness={stiffness}>
      <p className={css.hint}>Move your cursor here</p>
    </CursorFollower>
  );
}
