import { MagneticButton, ScrollReveal, SplitText } from "@awesome/interactions";
import { m, useReducedMotion } from "motion/react";
import { useState } from "react";
import * as css from "./app.css.ts";

const COMMAND = 'pnpm new:landing my-page "My page"';

const PARTS = [
  { title: "Vite", body: "Rolldown builds the page before you look up." },
  { title: "Motion", body: "Springs carry the bloom, the headline and the button." },
  { title: "TypeScript 7", body: "The native compiler checks every style token." },
];

export function App() {
  const reduce = useReducedMotion();
  const [copied, setCopied] = useState(false);

  async function copyCommand() {
    try {
      await navigator.clipboard.writeText(COMMAND);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // 권한이 없으면 명령을 직접 선택해 복사할 수 있다
    }
  }

  return (
    <>
      <section className={css.hero}>
        <div className={css.aurora} aria-hidden>
          {css.blobs.map(({ color, className }, i) => (
            <m.span
              key={i}
              className={className}
              style={{ background: color }}
              animate={
                reduce
                  ? undefined
                  : { x: [0, 80, -60, 0], y: [0, -40, 50, 0], scale: [1, 1.2, 0.9, 1] }
              }
              transition={{ duration: 14 + i * 4, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>

        <h1 className={css.headline}>
          <SplitText text="Ship landings that glow." />
        </h1>
        <ScrollReveal delay={0.6}>
          <p className={css.lead}>Built with React 19, Motion and Vite.</p>
        </ScrollReveal>
        <ScrollReveal delay={0.8}>
          <MagneticButton className={css.cta}>Get started</MagneticButton>
        </ScrollReveal>
      </section>

      <section className={css.parts} aria-labelledby="parts-head">
        <ScrollReveal>
          <h2 id="parts-head" className={css.partsHead}>
            Three parts, nothing extra.
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <ul className={css.list}>
            {PARTS.map((p) => (
              <li key={p.title} className={css.row}>
                <h3 className={css.rowTitle}>{p.title}</h3>
                <p className={css.rowBody}>{p.body}</p>
              </li>
            ))}
          </ul>
        </ScrollReveal>
      </section>

      <section className={css.start} aria-labelledby="start-head">
        <h2 id="start-head" className={css.startHead}>
          Start from the template.
        </h2>
        <div className={css.command}>
          <code className={css.code}>{COMMAND}</code>
          <button type="button" className={css.copy} onClick={copyCommand}>
            {copied ? "Copied" : "Copy command"}
          </button>
        </div>
      </section>
    </>
  );
}
