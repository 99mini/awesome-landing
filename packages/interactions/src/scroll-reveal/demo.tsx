import type { ControlValues } from "../types.ts";
import { ScrollReveal } from "./scroll-reveal.tsx";
import * as css from "./demo.css.ts";

export default function Demo({ offset, stagger = 0.1 }: ControlValues) {
  return (
    <div className={css.list}>
      {["Fast", "Composable", "Accessible", "Delightful"].map((label, i) => (
        <ScrollReveal key={label} offset={offset} delay={i * stagger} once={false}>
          <div className={css.item}>{label}</div>
        </ScrollReveal>
      ))}
    </div>
  );
}
