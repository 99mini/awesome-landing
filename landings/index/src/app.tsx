import {
  controlDefaults,
  findInteraction,
  interactions,
  type InteractionCategory,
  type InteractionDemoModule,
} from "@awesome/interactions/registry";
import { cx } from "@awesome/interactions";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import * as css from "./app.css.ts";

const GALLERY = "http://localhost:5173";

const KIND_NAMES: Record<InteractionCategory, string> = {
  cursor: "Follows the cursor",
  hover: "Answers a hover",
  scroll: "Waits for the scroll",
  text: "Moves the type",
  layout: "Reshapes the layout",
};

/** 큰 무대에 올릴 세 가지 — 폭이 필요한 것들 */
const LARGE = ["seven-segment", "line-draw", "marquee"] as const;

/** slug → 패키지가 export 하는 컴포넌트 이름 (tilt-card → TiltCard) */
const componentName = (slug: string) =>
  slug.replace(/(^|-)(\w)/g, (_, _dash: string, c: string) => c.toUpperCase());

const kinds = Object.entries(
  Object.groupBy(interactions, (m) => m.meta.category) as Record<string, InteractionDemoModule[]>,
).toSorted((a, b) => b[1].length - a[1].length);

function Demo({ mod }: { mod: InteractionDemoModule }) {
  const { default: Component, meta } = mod;
  return <Component {...controlDefaults(meta.controls)} />;
}

export function App() {
  const first = interactions[0]!;
  const [slug, setSlug] = useState(first.meta.slug);
  const selected = findInteraction(slug) ?? first;
  const reduce = useReducedMotion();
  const name = componentName(selected.meta.slug);
  const [propKey, prop] = Object.entries(selected.meta.controls ?? {})[0] ?? [];

  return (
    <>
      <header className={css.nav}>
        <span className={css.wordmark}>awesome/landing</span>
        <a className={css.navLink} href={GALLERY}>
          Gallery
        </a>
      </header>

      <main>
        <section className={css.hero} aria-labelledby="hero-head">
          <div className={css.heroText}>
            <h1 id="hero-head" className={css.headline}>
              Every name here runs.
            </h1>
            <p className={css.sentence}>
              Point at any of the {interactions.length} names to see it work.
            </p>
            <ul className={css.index} aria-label="Interactions">
              {interactions.map(({ meta }) => (
                <li key={meta.slug}>
                  <button
                    type="button"
                    className={css.entry}
                    aria-pressed={meta.slug === slug}
                    aria-controls="stage"
                    onPointerEnter={() => setSlug(meta.slug)}
                    onFocus={() => setSlug(meta.slug)}
                    onClick={() => setSlug(meta.slug)}
                  >
                    <span className={css.entryName}>{meta.title}</span>
                    <span className={css.entryKind}>{meta.category}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className={css.stageColumn}>
            <div
              id="stage"
              className={css.stage}
              aria-live="polite"
              aria-label={selected.meta.title}
            >
              <motion.div
                key={slug}
                className={css.stageDemo}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: reduce ? 0 : 0.25 }}
              >
                <Demo mod={selected} />
              </motion.div>
            </div>
            <p className={css.caption}>
              <span className={css.captionTitle}>{selected.meta.title}</span>
              {/* 레지스트리의 설명은 한국어 */}
              <span className={css.captionText} lang="ko">
                {selected.meta.description}
              </span>
            </p>
            <a className={css.open} href={`${GALLERY}/?interaction=${slug}`}>
              Open it in the gallery
            </a>
          </div>
        </section>

        <section className={css.kinds} aria-labelledby="kinds-head">
          <h2 id="kinds-head" className={css.sectionHead}>
            Sorted by what sets them off
          </h2>
          <div className={css.kindRow}>
            {kinds.map(([kind, members]) => (
              <div key={kind} className={css.kind}>
                <span className={css.kindCount}>{members.length}</span>
                <span className={css.kindName}>{KIND_NAMES[kind as InteractionCategory]}</span>
                <p className={css.kindMembers}>{members.map((m) => m.meta.title).join(", ")}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={css.large} aria-labelledby="large-head">
          <h2 id="large-head" className={css.sectionHead}>
            Three that need the width
          </h2>
          <div className={css.largeGrid}>
            {LARGE.map((s, i) => {
              const mod = findInteraction(s);
              if (!mod) return null;
              return (
                <figure
                  key={s}
                  className={cx(css.largeStage, i === 2 && css.largeWide)}
                  aria-label={mod.meta.title}
                >
                  <Demo mod={mod} />
                </figure>
              );
            })}
          </div>
        </section>

        <section className={css.take} aria-labelledby="take-head">
          <h2 id="take-head" className={css.sectionHead}>
            Take {selected.meta.title} home
          </h2>
          <ol className={css.steps}>
            <li className={css.step}>
              <p className={css.stepText}>It lives in one folder, styles and demo included.</p>
              <code className={css.code}>packages/interactions/src/{slug}/</code>
            </li>
            <li className={css.step}>
              <p className={css.stepText}>Import it from the package.</p>
              <code className={css.code}>{`import { ${name} } from "@awesome/interactions";`}</code>
            </li>
            {propKey && prop && (
              <li className={css.step}>
                <p className={css.stepText}>
                  Style it with a class and tune {prop.label.toLowerCase()} with a prop.
                </p>
                <code className={css.code}>
                  {`<${name} className={css.yours} ${propKey}={${prop.default}} />`}
                </code>
              </li>
            )}
          </ol>
        </section>
      </main>

      <footer className={css.footer}>
        <span className={css.wordmark}>awesome/landing</span>
        <nav className={css.footerLinks} aria-label="Other pages">
          <a className={css.navLink} href={GALLERY}>
            Gallery
          </a>
          <a className={css.navLink} href="http://localhost:5200">
            Aurora
          </a>
          <a className={css.navLink} href="http://localhost:5201">
            Editorial
          </a>
        </nav>
      </footer>
    </>
  );
}
