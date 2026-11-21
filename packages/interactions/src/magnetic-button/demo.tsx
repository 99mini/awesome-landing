import type { ControlValues } from "../types.ts";
import { MagneticButton } from "./magnetic-button.tsx";
import * as css from "./demo.css.ts";

export default function Demo({ strength }: ControlValues) {
  return (
    <MagneticButton className={css.button} strength={strength}>
      Get started
    </MagneticButton>
  );
}
