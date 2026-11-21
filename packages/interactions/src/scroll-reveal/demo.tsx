import type { InteractionMeta } from "../types.ts";
import { ScrollReveal } from "./ScrollReveal.tsx";
import * as css from "./demo.css.ts";

export const meta: InteractionMeta = {
  slug: "scroll-reveal",
  title: "Scroll Reveal",
  description: "뷰포트에 들어올 때 페이드 + 슬라이드 업",
  category: "scroll",
  tags: ["whileInView", "stagger"],
};

export default function Demo() {
  return (
    <div className={css.list}>
      {["Fast", "Composable", "Accessible", "Delightful"].map((label, i) => (
        <ScrollReveal key={label} delay={i * 0.1} once={false}>
          <div className={css.item}>{label}</div>
        </ScrollReveal>
      ))}
    </div>
  );
}
