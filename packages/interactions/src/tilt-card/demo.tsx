import type { ControlValues } from "../types.ts";
import { TiltCard } from "./tilt-card.tsx";
import * as css from "./demo.css.ts";

export default function Demo({ maxTilt }: ControlValues) {
  return (
    <TiltCard maxTilt={maxTilt}>
      <div className={css.card}>Hover me</div>
    </TiltCard>
  );
}
