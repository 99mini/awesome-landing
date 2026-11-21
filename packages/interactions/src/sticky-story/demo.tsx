import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Fragment, useRef } from "react";
import type { ControlValues, InteractionMeta } from "../types.ts";
import * as css from "./demo.css.ts";
import { StickyStory } from "./sticky-story.tsx";

export const meta: InteractionMeta = {
  slug: "sticky-story",
  title: "Sticky Story",
  description: "한쪽은 고정되고, 스크롤로 지나가는 단계에 맞춰 고정 영역이 바뀌는 스토리텔링",
  category: "scroll",
  tags: ["position: sticky", "useInView", "storytelling"],
  controls: {
    fade: { label: "Fade", min: 0, max: 0.8, step: 0.05, default: 0.3, unit: "s" },
  },
};

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
      {/* 포커스 가능한 자식이 없는 스크롤 상자는 브라우저가 키보드 포커스를 준다 */}
      <section ref={scroller} className={css.scroller} aria-label="Sticky story">
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
