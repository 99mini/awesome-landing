import type { InteractionMeta } from "../types.ts";
import { ScrollReveal } from "./ScrollReveal.tsx";

export const meta: InteractionMeta = {
  slug: "scroll-reveal",
  title: "Scroll Reveal",
  description: "뷰포트에 들어올 때 페이드 + 슬라이드 업",
  category: "scroll",
  tags: ["whileInView", "stagger"],
};

export default function Demo() {
  return (
    <div style={{ display: "grid", gap: "1rem", width: "min(100%, 28rem)" }}>
      {["Fast", "Composable", "Accessible", "Delightful"].map((label, i) => (
        <ScrollReveal key={label} delay={i * 0.1} once={false}>
          <div style={{ padding: "1.5rem", borderRadius: 16, background: "#1c1c22" }}>{label}</div>
        </ScrollReveal>
      ))}
    </div>
  );
}
