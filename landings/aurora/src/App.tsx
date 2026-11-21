import { MagneticButton, ScrollReveal, SplitText, TiltCard } from "@awesome/interactions";
import { motion } from "motion/react";
import * as css from "./App.css.ts";

const features = [
  { title: "Instant", body: "Rolldown 기반 Vite 로 즉시 빌드." },
  { title: "Fluid", body: "Motion 스프링으로 자연스러운 움직임." },
  { title: "Typed", body: "TypeScript 7 네이티브 컴파일러." },
];

export function App() {
  return (
    <>
      <section className={css.hero}>
        <div className={css.aurora} aria-hidden>
          {css.blobs.map(({ color, className }, i) => (
            <motion.span
              key={color}
              className={className}
              style={{ background: color }}
              animate={{ x: [0, 80, -60, 0], y: [0, -40, 50, 0], scale: [1, 1.2, 0.9, 1] }}
              transition={{ duration: 14 + i * 4, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>

        <h1 className={css.headline}>
          <SplitText text="Ship landings that glow." />
        </h1>
        <ScrollReveal delay={0.6}>
          <p className={css.lead}>React 19 · Motion · Vite 로 만든 인터랙티브 랜딩 예제</p>
        </ScrollReveal>
        <ScrollReveal delay={0.8}>
          <MagneticButton className={css.cta}>Get started →</MagneticButton>
        </ScrollReveal>
      </section>

      <section className={css.features}>
        {features.map((f, i) => (
          <ScrollReveal key={f.title} delay={i * 0.1}>
            <TiltCard className={css.feature}>
              <h3 className={css.featureText.title}>{f.title}</h3>
              <p className={css.featureText.body}>{f.body}</p>
            </TiltCard>
          </ScrollReveal>
        ))}
      </section>
    </>
  );
}
