import type { ControlValues } from "../types.ts";
import { SplitText } from "./split-text.tsx";
import * as css from "./demo.css.ts";

export default function Demo({ stagger }: ControlValues) {
  return (
    <h2 className={css.heading}>
      <SplitText text="Build something beautiful." stagger={stagger} />
    </h2>
  );
}
