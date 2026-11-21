import type { ControlValues } from "../types.ts";
import { CountUp } from "./count-up.tsx";
import * as css from "./demo.css.ts";

export default function Demo({ to = 12800, duration }: ControlValues) {
  return (
    <div className={css.stat}>
      <CountUp className={css.number} to={to} duration={duration} />
      <span className={css.label}>interactions shipped</span>
    </div>
  );
}
