import {
  CountUp,
  MagneticButton,
  Marquee,
  ScrollReveal,
  SplitText,
  TextScramble,
} from "@awesome/interactions";
import { Fragment } from "react";
import * as css from "./App.css.ts";

const TOPICS = ["Kinetic type", "Slow motion", "Negative space", "Rhythm", "Restraint"];

const STATS = [
  { value: 128, label: "Interactions studied" },
  { value: 42, label: "Typefaces in use" },
  { value: 9600, label: "Words in this issue" },
];

export function App() {
  return (
    <div className={css.page}>
      <header className={css.masthead}>
        <span>Vol. 01 — No. 04</span>
        <span className={css.brand}>The Interaction Quarterly</span>
        <span className={css.mastheadEnd}>Autumn 2026</span>
      </header>

      <section className={css.hero}>
        <p className={css.kicker}>
          <TextScramble text="ISSUE 04 / ON MOTION" duration={1.4} />
        </p>
        <h1 className={css.headline}>
          <SplitText text="Type that moves," stagger={0.025} />
          <br />
          <span className={css.headlineItalic}>
            <SplitText text="slowly." stagger={0.06} />
          </span>
        </h1>
        <ScrollReveal delay={0.9}>
          <p className={css.dek}>
            An essay on restraint: why the most memorable interfaces move less, and mean more.
          </p>
        </ScrollReveal>
      </section>

      <div className={css.band}>
        <Marquee duration={32} gap="2.5rem">
          {TOPICS.map((topic) => (
            <Fragment key={topic}>
              <span className={css.bandItem}>{topic}</span>
              <span className={css.bandMark} aria-hidden>
                ✺
              </span>
            </Fragment>
          ))}
        </Marquee>
      </div>

      <section className={css.stats} aria-label="This issue in numbers">
        {STATS.map((s) => (
          <div key={s.label} className={css.stat}>
            <CountUp className={css.statNumber} to={s.value} duration={2} />
            <span className={css.statLabel}>{s.label}</span>
          </div>
        ))}
      </section>

      <article className={css.essay}>
        <ScrollReveal>
          <h2 className={css.essayTitle}>Motion is punctuation, not prose.</h2>
        </ScrollReveal>
        <div className={css.columns}>
          <ScrollReveal>
            <p className={css.lede}>
              Every animation asks the reader to look. Used sparingly, that request feels like a
              gesture — a raised eyebrow, a pause before the punchline. Used everywhere, it becomes
              noise, and the page starts shouting over its own words.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className={css.paragraph}>
              The editorial tradition offers a useful discipline. A drop cap marks a beginning. A
              rule separates ideas. A pull quote slows the eye. None of them move, and all of them
              direct attention.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <blockquote className={css.pullQuote}>
              “Animate the moment of meaning, then get out of the way.”
            </blockquote>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className={css.paragraph}>
              So the motion here is deliberate: a headline that settles letter by letter, a ticker
              that drifts rather than races, numbers that count only once. Each one finishes, and
              then the type is left to do its work.
            </p>
          </ScrollReveal>
        </div>
      </article>

      <footer className={css.footer}>
        <h2 className={css.footerTitle}>Read the next issue first.</h2>
        <MagneticButton className={css.cta} strength={0.25}>
          Subscribe →
        </MagneticButton>
      </footer>
    </div>
  );
}
