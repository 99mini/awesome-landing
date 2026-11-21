import type { ControlValues, InteractionMeta } from "../types.ts";
import { ScrollReveal } from "./ScrollReveal.tsx";
import * as css from "./demo.css.ts";

export const meta: InteractionMeta = {
  slug: "scroll-reveal",
  title: "Scroll Reveal",
  description: "뷰포트에 들어올 때 페이드 + 슬라이드 업",
  category: "scroll",
  tags: ["whileInView", "stagger"],
  controls: {
    offset: { label: "Offset", min: 0, max: 120, step: 4, default: 40, unit: "px" },
    stagger: { label: "Stagger", min: 0, max: 0.4, step: 0.02, default: 0.1, unit: "s" },
  },
};

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
