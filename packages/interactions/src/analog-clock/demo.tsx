import type { ControlValues } from "../types.ts";
import { AnalogClock } from "./analog-clock.tsx";
import * as css from "./demo.css.ts";

export default function Demo({ smooth, secondHand, size }: ControlValues) {
  return (
    <AnalogClock
      className={css.clock}
      smooth={smooth === 1}
      secondHand={secondHand !== 0}
      size={size}
    />
  );
}
