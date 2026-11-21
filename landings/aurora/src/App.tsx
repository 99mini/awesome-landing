import { MagneticButton, ScrollReveal, SplitText, TiltCard } from "@awesome/interactions";
import { motion } from "motion/react";

const features = [
  { title: "Instant", body: "Rolldown 기반 Vite 로 즉시 빌드." },
  { title: "Fluid", body: "Motion 스프링으로 자연스러운 움직임." },
  { title: "Typed", body: "TypeScript 7 네이티브 컴파일러." },
];

export function App() {
  return (
    <>
      <section className="hero">
        <div className="aurora" aria-hidden>
          {["#6d5dfc", "#e05cff", "#00d4ff"].map((color, i) => (
            <motion.span
              key={color}
              style={{ background: color }}
              animate={{ x: [0, 80, -60, 0], y: [0, -40, 50, 0], scale: [1, 1.2, 0.9, 1] }}
              transition={{ duration: 14 + i * 4, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>

        <h1>
          <SplitText text="Ship landings that glow." />
        </h1>
        <ScrollReveal delay={0.6}>
          <p className="lead">React 19 · Motion · Vite 로 만든 인터랙티브 랜딩 예제</p>
        </ScrollReveal>
        <ScrollReveal delay={0.8}>
          <MagneticButton className="cta">Get started →</MagneticButton>
        </ScrollReveal>
      </section>

      <section className="features">
        {features.map((f, i) => (
          <ScrollReveal key={f.title} delay={i * 0.1}>
            <TiltCard className="feature">
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </TiltCard>
          </ScrollReveal>
        ))}
      </section>
    </>
  );
}
