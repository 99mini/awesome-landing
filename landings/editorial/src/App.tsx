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

const ESSAY_OPEN = [
  "Every animation asks the reader to look. Used sparingly, that request feels like a gesture, a raised eyebrow before the punchline.",
  "Used everywhere, it becomes noise, and the page starts shouting over its own words.",
];

const ESSAY_CLOSE = [
  "The editorial tradition offers a discipline. A drop cap marks a beginning. A rule separates ideas. None of them move, and all of them direct attention.",
  "So a headline settles letter by letter, a ticker drifts, and numbers count once. Each one finishes, then the type does its work.",
];

/** 이 페이지에서 실제로 쓰는 인터랙션 — 아래 숫자는 이 목록과 본문에서 계산한다 */
const INTERACTIONS_ON_PAGE = [
  "TextScramble",
  "SplitText",
  "Marquee",
  "CountUp",
  "ScrollReveal",
  "MagneticButton",
];

const essayWords = [...ESSAY_OPEN, ...ESSAY_CLOSE].join(" ").split(/\s+/).length;

const FACTS = [
  { value: essayWords, label: "words in the essay below" },
  { value: INTERACTIONS_ON_PAGE.length, label: "interactions on this page" },
  { value: TOPICS.length, label: "ideas in the ticker" },
];

export function App() {
  return (
    <div className={css.page}>
      <header className={css.masthead}>
        <span>Vol. 1, No. 4</span>
        <span className={css.wordmark}>The Interaction Quarterly</span>
        <time className={css.mastheadEnd} dateTime="2026-09">
          <TextScramble text="Autumn 2026" duration={1.4} />
        </time>
      </header>

      <section className={css.hero}>
        <h1 className={css.headline}>
          <SplitText text="Type that moves slowly." stagger={0.03} />
        </h1>
        <ScrollReveal delay={0.7}>
          <p className={css.dek}>An essay on restraint in interface motion.</p>
        </ScrollReveal>
        <ScrollReveal delay={0.85}>
          <div className={css.actions}>
            <a className={css.secondary} href="#essay">
              Read the essay
            </a>
            <MagneticButton className={css.primary} strength={0.2}>
              Subscribe
            </MagneticButton>
          </div>
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

      <section className={css.facts} aria-labelledby="facts-head">
        <h2 id="facts-head" className={css.sectionHead}>
          This issue, counted.
        </h2>
        <div className={css.factRow}>
          {FACTS.map((f) => (
            <div key={f.label} className={css.fact}>
              <CountUp className={css.factNumber} to={f.value} duration={1.6} />
              <span className={css.factLabel}>{f.label}</span>
            </div>
          ))}
        </div>
      </section>

      <article id="essay" className={css.essay}>
        <h2 className={css.essayHead}>Motion is punctuation, not prose.</h2>
        <div className={css.prose}>
          {ESSAY_OPEN.map((text, i) => (
            <ScrollReveal key={i} delay={0.05}>
              <p className={i === 0 ? css.lede : css.paragraph}>{text}</p>
            </ScrollReveal>
          ))}
        </div>
      </article>

      <ScrollReveal>
        <blockquote className={css.quote}>
          <span className={css.quoteText}>
            “Animate the moment of meaning, then get out of the way.”
          </span>
        </blockquote>
      </ScrollReveal>

      <article className={css.essay} aria-labelledby="essay-close-head">
        <h2 id="essay-close-head" className={css.essayHead}>
          Stillness does the directing.
        </h2>
        <div className={css.prose}>
          {ESSAY_CLOSE.map((text, i) => (
            <ScrollReveal key={i} delay={0.05}>
              <p className={css.paragraph}>{text}</p>
            </ScrollReveal>
          ))}
        </div>
      </article>

      <section className={css.close} aria-labelledby="close-head">
        <h2 id="close-head" className={css.closeHead}>
          Read the next issue first.
        </h2>
        <MagneticButton className={css.primary} strength={0.2}>
          Subscribe
        </MagneticButton>
      </section>

      <footer className={css.colophon}>
        Set in Iowan Old Style. Built with the awesome-landing interaction set.
      </footer>
    </div>
  );
}
