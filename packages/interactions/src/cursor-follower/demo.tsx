import type { ControlValues } from "../types.ts";
import { CursorFollower } from "./cursor-follower.tsx";
import * as css from "./demo.css.ts";

export default function Demo({ size, stiffness }: ControlValues) {
  return (
    <CursorFollower className={css.area} dotClassName={css.dot} size={size} stiffness={stiffness}>
      <p className={css.hint}>Move your cursor here</p>
    </CursorFollower>
  );
}
