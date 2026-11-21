import type { ControlValues } from "../types.ts";
import { TextScramble } from "./text-scramble.tsx";
import * as css from "./demo.css.ts";

export default function Demo({ duration }: ControlValues) {
  return (
    <p className={css.text}>
      <TextScramble text="DECODING THE FUTURE" duration={duration} />
    </p>
  );
}
