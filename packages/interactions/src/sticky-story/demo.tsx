import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Fragment, useRef } from "react";
import type { ControlValues } from "../types.ts";
import * as css from "./demo.css.ts";
import { StickyStory } from "./sticky-story.tsx";

const STEPS = [
  {
    title: "Pin",
    body: "The panel on the left is sticky, so it stays put while this column scrolls.",
  },
  { title: "Track", body: "Each step watches a thin band across the middle of the scroll box." },
  { title: "Swap", body: "When a step enters that band, the pinned panel switches to match it." },
] as const;

export default function Demo({ fade = 0.3 }: ControlValues) {
  const scroller = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  return (
    <div className={css.root}>
      <p className={css.hint}>Scroll inside the box.</p>
      {/* 스크롤 상자는 키보드로도 움직일 수 있어야 한다 — Chrome 은 자동으로 주지만 다른 브라우저를 위해 명시 */}
      {/* oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
      <section ref={scroller} className={css.scroller} tabIndex={0} aria-label="Sticky story">
        <StickyStory
          className={css.story}
          container={scroller}
          steps={STEPS.map((s) => (
            <Fragment key={s.title}>
              <h3 className={css.stepTitle}>{s.title}</h3>
              <p className={css.stepBody}>{s.body}</p>
            </Fragment>
          ))}
          renderVisual={(active) => (
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                className={`${css.panel} ${css.tone[active as 0 | 1 | 2]}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0 : fade / 2 }}
              >
                <span className={css.panelNumber}>{active + 1}</span>
              </motion.div>
            </AnimatePresence>
          )}
        />
      </section>
    </div>
  );
}
